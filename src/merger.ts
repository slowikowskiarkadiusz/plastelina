import * as fs from "fs";
import * as glob from 'glob';
import * as YAML from "yaml";
import { mergedPath } from './consts';
import { Schemas } from "./models";

export class Merger {
    private static fullSchemas: any;

    public static run(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Merging all models into ${mergedPath}...`);
        let targetFiles = glob
            .sync('./Models/**/*.yaml')
            .filter(x => !x.includes('_meta'));

        let mergeYaml = require('merge-yaml');
        let doc = mergeYaml(targetFiles);

        fs.writeFileSync(mergedPath, YAML.stringify(doc));
    }

    public static removeMerged(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Removing ${mergedPath}...`);
        fs.rmSync(mergedPath);
    }

    public static getFullSchemas(): Schemas {
        if (Merger.fullSchemas)
            return Merger.fullSchemas;
        else {
            let data = fs.readFileSync(mergedPath);
            return Merger.fullSchemas = YAML.parse(data.toString()).components.schemas;
        }
    }
}