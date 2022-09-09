import { PrinterRunner as PrinterRunner } from "./printer_runner";
import { Merger } from "./merger";
import { Validator } from "./validator";
import { VersionReaderWriter } from "./version-reader-writer"
import { BuildRunner } from "./build_runner"
import { ArgumentSettings } from "./argument_settings";

ArgumentSettings.update();

Merger.run();

VersionReaderWriter.run();

Validator.run()
    .then(() => {
        PrinterRunner.run();
        BuildRunner.run();
        Merger.removeMerged();
    })
    .catch((err) => {
        console.log(err);
        Merger.removeMerged();
    });