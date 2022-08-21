import { GeneratorRunner } from "./printer_runner";
import { Merger } from "./merger";
import { Validator } from "./validator";
import { VersionReaderWriter } from "./version-reader-writer"
import { AsyncApiGenerator } from "./asyncapi_generator"
import { BuildRunner } from "./build_runner"
import { ArgumentSettings } from "./argument_settings";

ArgumentSettings.update();

Merger.run();

Validator.run();

GeneratorRunner.run();

VersionReaderWriter.run();

BuildRunner.run();

AsyncApiGenerator.run();

Merger.removeMerged();