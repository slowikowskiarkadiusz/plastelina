import { GeneratorRunner } from "./generator_runner";
import { Merger } from "./merger";
import { Validator } from "./validator";
import { VersionReaderWriter } from "./version-reader-writer"
import { HtmlGenerator } from "./html_generator"
import { BuildRunner } from "./build_runner"

Merger.run();

Validator.run();

GeneratorRunner.run();

VersionReaderWriter.run();

BuildRunner.run();

HtmlGenerator.run();

Merger.removeMerged();