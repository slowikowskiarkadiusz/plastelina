import { Merger } from "./merger";
import { Validator } from "./validator";

Merger.run(true);

Validator.run(true);

Merger.removeMerged(true);