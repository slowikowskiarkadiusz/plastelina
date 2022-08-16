import * as cp from "child_process";
import { generatedDirectory, mergedPath } from "./consts";

export class AsyncApiGenerator {
    public static run(): void {
        console.log("Generating HTML...");
        cp.execSync(`sudo ag ${mergedPath} @asyncapi/html-template -o ${generatedDirectory}/html --force-write`, { stdio: "inherit", cwd: "./" });
    }
}