import { Model } from "./models";
import * as fs from "fs";
import * as YAML from "yaml";
import * as cp from "child_process";
import { ClassPrinter } from "./class.printer";
import { EnumPrinter } from "./enum.printer";
import { codeDirectory, modelsDirectory, solutionName, staticProjects } from "./consts";

interface Reference {
    refProjPath: string;
    projPath: string;
}

interface NuGetPackage {
    nugetName: string;
    projPath: string;
}

export class GeneratorRunner {
    private static readonly filesToRemove: { path: string, isFile: boolean }[] = [];
    private static readonly references: Reference[] = [];
    private static readonly packages: NuGetPackage[] = [];

    public static run(): void {
        GeneratorRunner.getExistingFiles();

        GeneratorRunner.createSolution();

        console.log("Generating code...");

        GeneratorRunner.processDirectory();

        (GeneratorRunner.reduce(GeneratorRunner.references, (x: Reference) => x.projPath, (x: Reference) => x.refProjPath) as Reference[])
            .forEach(x => {
                if (!GeneratorRunner.list(x.projPath, 'reference').some(y => x.refProjPath.includes(y.replace('..', '')))) {
                    console.log(`Adding reference to ${x.refProjPath} for ${x.projPath}...`);
                    cp.execSync(`dotnet add ${x.projPath} reference ${x.refProjPath}`);
                }
            });

        (GeneratorRunner.reduce(GeneratorRunner.packages, (x: NuGetPackage) => x.projPath, (x: NuGetPackage) => x.nugetName) as NuGetPackage[])
            .forEach(x => {
                if (!GeneratorRunner.list(x.projPath, 'package').some(y => y.includes(x.nugetName))) {
                    console.log(`Installing package ${x.nugetName} in ${x.projPath}...`);
                    cp.execSync(`dotnet add ${x.projPath} package ${x.nugetName}`);
                }
            });

        GeneratorRunner.removeResidues();
    }

    private static createSolution() {
        if (!fs.existsSync(`${codeDirectory}/${solutionName}.sln`)) {
            cp.execSync(`dotnet new sln --name ${solutionName}`, { cwd: codeDirectory });

            staticProjects.forEach(x => {
                cp.execSync(`dotnet sln ./${solutionName}.sln add ${x}`, { cwd: codeDirectory });
            });
        }
    }

    private static processDirectory(subPath: string = '', isRoot: boolean = true): void {
        if (fs.existsSync(`${modelsDirectory}/${subPath}`)) {
            fs.readdirSync(`${modelsDirectory}/${subPath}`, { withFileTypes: true })
                .forEach(dirent => {
                    if (dirent.isDirectory()) {
                        if (isRoot)
                            GeneratorRunner.makeProject(dirent.name);
                        else if (!fs.existsSync(`${codeDirectory}/${subPath}/${dirent.name}`))
                            fs.mkdirSync(`${codeDirectory}/${subPath}/${dirent.name}`);

                        GeneratorRunner.removeFromFilesToRemove(`${subPath}/${dirent.name}`);

                        GeneratorRunner.processDirectory(`${subPath}/${dirent.name}`, false);
                    } else if (dirent.isFile() && (dirent.name.endsWith('.yaml') || dirent.name.endsWith('.yml'))) {
                        GeneratorRunner.processFile(subPath, dirent.name);
                    }
                });
        }
    }

    private static processFile(subPath: string, name: string): void {
        if (name === "_Header.yaml") return;

        let data = fs.readFileSync(`${modelsDirectory}/${subPath}/${name}`);
        let yaml = YAML.parse(data.toString());

        name = name.replace('.yaml', '').replace('.yml', '');
        GeneratorRunner.removeFromFilesToRemove(`${subPath}/${name}.cs`);

        let result: string[][] = [];
        Object.keys(yaml.components.schemas).forEach(key => GeneratorRunner.generateCode(yaml.components.schemas[key], key, '', subPath, result));

        result.forEach((x) => fs.writeFileSync(`${codeDirectory}/${subPath}/${name}.cs`, x.join('\n')));
    }

    private static generateCode(model: Model, modelKey: string, prevKey: string, subPath: string, result: string[][]): void {
        model.nugets?.forEach(nuget => GeneratorRunner.addNuget(nuget, subPath.split('/')[1]));
        model.references?.forEach(reference => GeneratorRunner.addReference(reference, subPath.split('/')[1]));

        if (model.type == "object") {
            result.push(new ClassPrinter().generate(model, modelKey, prevKey));
        }
        else if (model.enum) {
            result.push(new EnumPrinter().generate(model, modelKey, prevKey));
        }
        else {
            Object.keys(model).forEach(key => GeneratorRunner.generateCode(model[key], key, modelKey, subPath, result));
        }
    }

    private static removeFromFilesToRemove(path: string) {
        let index = GeneratorRunner.filesToRemove.findIndex(x => x.path.replace(codeDirectory, '') === path);
        if (index !== -1)
            GeneratorRunner.filesToRemove.splice(index, 1);
    }

    private static makeProject(name: string): void {
        let csprojName: string = `${codeDirectory}/${name}/${name}.csproj`;

        if (!fs.existsSync(csprojName)) {
            cp.execSync(`dotnet new classlib --name ${name} --framework net6.0`, { cwd: codeDirectory });

            let csprojContent = fs.readFileSync(csprojName).toString();
            fs.writeFileSync(csprojName, csprojContent.replace('    <Nullable>enable</Nullable>', ''));
            fs.rmSync(`${codeDirectory}/${name}/Class1.cs`);

            cp.execSync(`dotnet sln ./${solutionName}.sln add ./${name}/${name}.csproj`, { cwd: codeDirectory });
        }
    }

    private static addNuget(nuget: string, projName: string) {
        let projPath = `${codeDirectory}/${projName}`;
        GeneratorRunner.packages.push({ nugetName: nuget, projPath: projPath });
    }

    private static addReference(refProjName: string, projName: string) {
        let projPath = `${codeDirectory}/${projName}`;
        let refProjPath = `${codeDirectory}/${refProjName}/${refProjName}.csproj`;
        GeneratorRunner.references.push({ refProjPath: refProjPath, projPath: projPath });
    }

    private static getExistingFiles(root: string = codeDirectory): void {
        fs.readdirSync(root, { withFileTypes: true })
            .forEach(x => {
                let rootName = `${root}/${x.name}`;
                if (!rootName.includes('/obj') && !rootName.includes('/bin') && !staticProjects.some(x => rootName.includes(x))) {
                    if (x.isDirectory()) {
                        GeneratorRunner.getExistingFiles(rootName);
                        GeneratorRunner.filesToRemove.push({ path: rootName, isFile: false });
                    }
                    else if (x.isFile() && x.name.endsWith('.cs')) {
                        GeneratorRunner.filesToRemove.push({ path: rootName, isFile: true });
                    }
                }
            });
    }

    private static reduce<T>(array: T[], ...predicates: ((x: T) => string)[]): T[] {
        let result: T[] = [];
        array.forEach((elem) => {
            let consideredResults = [...result];
            predicates.forEach(predicate => consideredResults = consideredResults.filter(x => predicate(x) === predicate(elem)));

            if (consideredResults.length === 0) result.push(elem);
        });

        return result;
    }

    private static removeResidues(): void {
        console.log("Removing residues...");

        GeneratorRunner.filesToRemove
            .forEach(x => {
                if (x.isFile)
                    fs.unlinkSync(x.path);
                else
                    fs.rmSync(x.path, { recursive: true, force: true });
            });
    }

    private static list(projPath: string, type: 'package' | 'reference'): string[] {
        return cp.execSync(`dotnet list ${projPath} ${type}`)
            .toString()
            .split('\r\n')
            .slice(type === 'package' ? 3 : 2)
            .filter(x => x !== '');
    }
}
