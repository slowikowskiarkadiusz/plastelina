import * as fs from "fs";
import * as glob from 'glob';
import * as YAML from "yaml";
import { mergedPath } from './consts';

export class Merger {

    public static run(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Merging all models into ${mergedPath}...`);
        let targetFiles = glob.sync('./Models/**/*.yaml');

        let mergeYaml = require('merge-yaml');
        let doc = mergeYaml(targetFiles);

        fs.writeFileSync(mergedPath, YAML.stringify(doc));
    }

    public static removeMerged(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Removing ${mergedPath}...`);
        fs.rmSync(mergedPath);
    }
}