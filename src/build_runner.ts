import * as cp from "child_process";
import { codeDirectory } from "./consts";

export class BuildRunner {
    public static run(): void {
        cp.spawnSync(`dotnet`, ['build'], { stdio: "inherit", cwd: codeDirectory });
    }
}