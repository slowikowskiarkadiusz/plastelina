import * as cp from "child_process";
import { generatedDirectory } from "./consts";

export class HtmlGenerator {
    public static run(): void {
        console.log("Generating HTML...");
        cp.execSync(`ag ${generatedDirectory}/__do_not_commit_me__.yaml @asyncapi/html-template -o ${generatedDirectory}/html --force-write`, { stdio: "inherit", cwd: "./" });
    }
}