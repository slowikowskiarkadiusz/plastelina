import * as fs from "fs";
import { mergedPath, modelsDirectory } from './consts';
import * as YAML from "yaml";
import { MetaFile } from "./printer_runner";

export class VersionReaderWriter {
    private static allVersions: string[] = [];

    public static run(): void {
        VersionReaderWriter.processDirectory();

        let merged = YAML.parse(fs.readFileSync(mergedPath).toString());

        merged.info.version = VersionReaderWriter.getHighestVersion();

        fs.writeFileSync(mergedPath, YAML.stringify(merged));
    }

    private static processDirectory(subPath: string = ''): void {
        if (fs.existsSync(`${modelsDirectory}/${subPath}`)) {
            fs.readdirSync(`${modelsDirectory}/${subPath}`, { withFileTypes: true })
                .forEach(dirent => {
                    if (dirent.isDirectory()) {
                        VersionReaderWriter.processDirectory(`${subPath}/${dirent.name}`);
                    } else if (dirent.isFile() && (dirent.name.endsWith('_meta.yaml') || dirent.name.endsWith('_meta.yml'))) {
                        let meta: MetaFile = YAML.parse(fs.readFileSync(`${modelsDirectory}/${subPath}/${dirent.name}`).toString())

                        VersionReaderWriter.allVersions.push(meta.version);
                    }
                });
        }
    }

    public static getHighestVersion(): string {
        const splitVersions = VersionReaderWriter.allVersions.map(x => x.split('.'));
        return splitVersions.reduce((p, c) => VersionReaderWriter.isVersionBigger(p, c) ? p : c).join('.');
    }

    private static isVersionBigger(v1: string[], v2: string[], index: number = 0): boolean {
        if (v1[index] > v2[index])
            return true;
        else if (v1[index] === v2[index])
            if (index === 2)
                return true;
            else
                return this.isVersionBigger(v1, v2, ++index);

        return false;
    }
}