import { Model, Schemas } from "./models";
import * as fs from "fs";
import * as YAML from "yaml";
import * as cp from "child_process";
import { ClassPrinter } from "./class.printer";
import { EnumPrinter } from "./enum.printer";
import { codeDirectory, modelsDirectory, solutionName, staticProjects } from "./consts";
import { splitRef } from "./utils";

interface Reference {
    refProjPath: string;
    projPath: string;
}

interface NuGetPackage {
    nugetName: string;
    projPath: string;
}

export interface MetaFile {
    version: string;
    description: string;
}

export class PrinterRunner {
    private static readonly filesToRemove: { path: string, isFile: boolean }[] = [];
    private static readonly references: Reference[] = [];
    private static readonly packages: NuGetPackage[] = [];

    public static run(): void {
        PrinterRunner.getExistingFiles();

        PrinterRunner.createSolution();

        console.log("Generating code...");

        PrinterRunner.processDirectory();

        (PrinterRunner.reduce(PrinterRunner.references, (x: Reference) => x.projPath, (x: Reference) => x.refProjPath) as Reference[])
            .forEach(x => {
                if (!PrinterRunner.list(x.projPath, 'reference').map(x => x.replaceAll('\\', '/')).some(y => x.refProjPath.includes(y.replace('..', '')))) {
                    console.log(`Adding reference to ${x.refProjPath} for ${x.projPath}...`);
                    cp.execSync(`dotnet add ${x.projPath} reference ${x.refProjPath}`);
                }
            });

        (PrinterRunner.reduce(PrinterRunner.packages, (x: NuGetPackage) => x.projPath, (x: NuGetPackage) => x.nugetName) as NuGetPackage[])
            .forEach(x => {
                if (!PrinterRunner.list(x.projPath, 'package').some(y => y.includes(x.nugetName))) {
                    console.log(`Installing package ${x.nugetName} in ${x.projPath}...`);
                    cp.execSync(`dotnet add ${x.projPath} package ${x.nugetName}`);
                }
            });

        PrinterRunner.removeResidues();
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
                            PrinterRunner.createProject(dirent.name);
                        else if (!fs.existsSync(`${codeDirectory}/${subPath}/${dirent.name}`))
                            fs.mkdirSync(`${codeDirectory}/${subPath}/${dirent.name}`);

                        PrinterRunner.removeFromFilesToRemove(`${subPath}/${dirent.name}`);

                        PrinterRunner.processDirectory(`${subPath}/${dirent.name}`, false);
                    } else if (dirent.isFile() && (dirent.name.endsWith('.yaml') || dirent.name.endsWith('.yml'))) {
                        PrinterRunner.processFile(subPath, dirent.name);
                    }
                });
        }
    }

    private static processFile(subPath: string, name: string): void {
        if (name === "_Header.yaml" || name === "_meta.yaml") return;

        let data = fs.readFileSync(`${modelsDirectory}/${subPath}/${name}`);
        let yaml = YAML.parse(data.toString());

        name = name.replace('.yaml', '').replace('.yml', '');
        PrinterRunner.removeFromFilesToRemove(`${subPath}/${name}.cs`);

        let result: string[][] = [];
        let schemas: Schemas = yaml.components.schemas;
        Object.keys(schemas).forEach(key => PrinterRunner.generateCode(schemas[key], key, '', subPath, result));

        result.forEach((x) => fs.writeFileSync(`${codeDirectory}/${subPath}/${name}.cs`, x.join('\n')));
    }

    private static generateCode(model: { [key: string]: any }, modelKey: string, prevKey: string, subPath: string, result: string[][], derivedFrom: string = null): void {
        model.nugets?.forEach((nuget: string) => PrinterRunner.addNuget(nuget, subPath.split('/')[1]));
        model.references?.forEach((reference: string) => PrinterRunner.addReference(reference, subPath.split('/')[1]));

        if (!!model.allOf) {
            let refs = model.allOf.filter(x => !!x.$ref);
            let $ref: string = null;
            if (refs.length > 1)
                throw `There are more than two $refs in allOf in ${modelKey}. Unfortunately you can inherit only from one class in C#.`

            if (refs.length === 1)
                $ref = splitRef(refs.map(x => x.$ref)[0]).type;

            let actualModels = model.allOf.filter(x => x !== refs[0]);
            if (actualModels.length > 1)
                throw `There are more than one model in allOf in ${modelKey}.`
            let actualModel = actualModels[0];

            PrinterRunner.generateCode(actualModel, modelKey, prevKey, subPath, result, $ref);
        }
        else if (model.type == "object") {
            let printerResult = new ClassPrinter().generate(<Model>model, modelKey, prevKey, derivedFrom);
            result.push(printerResult.result);
            printerResult.nugets?.forEach(nuget => PrinterRunner.addNuget(nuget, subPath.split('/')[1]));
        }
        else if (model.enum) {
            result.push(new EnumPrinter().generate(<Model>model, modelKey, prevKey));
        }
        else {
            Object.keys(model).forEach(key => PrinterRunner.generateCode(model[key], key, modelKey, subPath, result));
        }
    }

    private static removeFromFilesToRemove(path: string) {
        let index = PrinterRunner.filesToRemove.findIndex(x => x.path.replace(codeDirectory, '') === path);
        if (index !== -1)
            PrinterRunner.filesToRemove.splice(index, 1);
    }

    private static createProject(name: string): void {
        let csprojName: string = `${codeDirectory}/${name}/${name}.csproj`;
        let meta: MetaFile = YAML.parse(fs.readFileSync(`${modelsDirectory}/${name}/_meta.yaml`).toString());

        if (!fs.existsSync(csprojName)) {
            cp.execSync(`dotnet new classlib --name ${name} --framework netstandard2.0`, { cwd: codeDirectory });
            cp.execSync(`dotnet sln ./${solutionName}.sln add ./${name}/${name}.csproj`, { cwd: codeDirectory });
            fs.rmSync(`${codeDirectory}/${name}/Class1.cs`);
        }

        let fileContentArray = fs.readFileSync(csprojName).toString().split('\n');

        let start = fileContentArray.findIndex(x => x.includes('<PropertyGroup>')) + 1;
        let end = fileContentArray.findIndex(x => x.includes('</PropertyGroup>'));

        let newContent = fileContentArray.splice(start, end - start);
        newContent = newContent
            .filter(x => !x.includes('<Version>'))
            .filter(x => !x.includes('<Description>'));

        if (meta.version)
            newContent.splice(0, 0, `    <Version>${meta.version}</Version>`);
        else
            throw `There's no version in meta file for ${name}`;

        if (meta.description)
            newContent.splice(1, 0, `    <Description>${meta.description}</Description>`)

        fs.writeFileSync(csprojName, fileContentArray
            .join('\n')
            .replace('  </PropertyGroup>', [...newContent, '  </PropertyGroup>'].join('\n')));
    }

    private static addNuget(nuget: string, projName: string) {
        let projPath = `${codeDirectory}/${projName}`;
        PrinterRunner.packages.push({ nugetName: nuget, projPath: projPath });
    }

    private static addReference(refProjName: string, projName: string) {
        let projPath = `${codeDirectory}/${projName}`;
        let refProjPath = `${codeDirectory}/${refProjName}/${refProjName}.csproj`;
        PrinterRunner.references.push({ refProjPath: refProjPath, projPath: projPath });
    }

    private static getExistingFiles(root: string = codeDirectory): void {
        fs.readdirSync(root, { withFileTypes: true })
            .forEach(x => {
                let rootName = `${root}/${x.name}`;
                if (!rootName.includes('/obj') && !rootName.includes('/bin') && !staticProjects.some(x => rootName.includes(x))) {
                    if (x.isDirectory()) {
                        PrinterRunner.getExistingFiles(rootName);
                        PrinterRunner.filesToRemove.push({ path: rootName, isFile: false });
                    }
                    else if (x.isFile() && x.name.endsWith('.cs')) {
                        PrinterRunner.filesToRemove.push({ path: rootName, isFile: true });
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

        PrinterRunner.filesToRemove
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
