import * as asyncapiValidator from 'asyncapi-validator';
import * as fs from "fs";
import * as YAML from "yaml";
import { mergedPath, modelsDirectory } from './consts';

export class Validator {
    private static readonly allKeys: string[] = [];

    constructor() { }

    public static run(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Looking for duplicate keys in yamls...`);
        Validator.processDirectory();

        if (!preventLogging) console.log(`Validating ${mergedPath} using asyncapi-validator...`);
        asyncapiValidator.fromSource(mergedPath, { msgIdentifier: 'name' })
            .then(() => { })
            .catch((err: any) => { throw err; });
    }

    private static processDirectory(subPath: string = ''): void {
        if (fs.existsSync(`${modelsDirectory}/${subPath}`)) {
            fs.readdirSync(`${modelsDirectory}/${subPath}`, { withFileTypes: true })
                .forEach(dirent => {
                    if (dirent.isDirectory()) {
                        Validator.processDirectory(`${subPath}/${dirent.name}`);
                    } else if (dirent.isFile() && (dirent.name.endsWith('.yaml') || dirent.name.endsWith('.yml'))) {
                        Validator.processFile(subPath, dirent.name);
                    }
                });
        }
    }

    private static processFile(subPath: string, name: string): void {
        if (name === "_Header.yaml") return;

        let data = fs.readFileSync(`${modelsDirectory}/${subPath}/${name}`);
        let yaml = YAML.parse(data.toString());

        Object.keys(yaml.components.schemas).forEach(key => Validator.checkFile(yaml.components.schemas[key], `#/components/schemas/${key}`));
    }

    private static checkFile(model: any, keyPath: string): void {
        if (!(model.type === "object" || model.enum)) {
            Object.keys(model).forEach(key => Validator.checkFile(model[key], `${keyPath}/${key}`));
        }
        else {
            if (Validator.allKeys.includes(keyPath))
                throw new Error(`There are two models with key ${keyPath}`);

            Validator.allKeys.push(keyPath);
        }
    }
}


// let data = fs.readFileSync(`${modelsDirectory}/${subPath}/${name}`).toString();
// let yaml = YAML.parse(data);

// let lines = data.split('\n');
// let namespace = lines.filter(x => x.includes('namespace:'))[0].replace('namespace:', '').replace('\r', '').trim();
// lines = lines.filter(x => !x.includes('namespace:'));
// let schemaIndex = lines.findIndex(x => x.includes('schemas:'));
// lines.splice(schemaIndex + 1, 0, `    ${namespace}:\r`);

// for (let i = schemaIndex + 2; i < lines.length; i++) {
//     lines[i] = `  ${lines[i]}`;
// }

// fs.writeFileSync(`${modelsDirectory}/${subPath}/${name}`, lines.join('\n'));