import * as fs from "fs";
import * as YAML from "yaml";
import { generatedDirectory, modelsDirectory } from './consts';

export class VersionReaderWriter {
    public static run(): void {
        console.log("Updating version.txt file...");
        let data = fs.readFileSync(`${modelsDirectory}\\_Header.yaml`);
        let yaml = YAML.parse(data.toString());
        fs.writeFileSync(`${generatedDirectory}\\version.txt`, yaml.info.version);
        console.log(`Current version is ${yaml.info.version}`);
    }
}