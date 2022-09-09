import { ArgumentSettings } from "./argument_settings";
import { Merger } from "./merger";
import { Validator } from "./validator";
import { VersionReaderWriter } from "./version-reader-writer";

ArgumentSettings.update();

Merger.run(true);

VersionReaderWriter.run();

Validator.run(true)
    .then(() => {
        Merger.removeMerged(true);
    })
    .catch((err) => {
        console.log(err);
        Merger.removeMerged(true);
    });