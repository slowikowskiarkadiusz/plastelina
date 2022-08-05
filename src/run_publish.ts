import { Confluencer } from "./confluencer";
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Merger } from "./merger";

Merger.run(true);

Confluencer.run(yargs(hideBin(process.argv)).argv);

Merger.removeMerged(true);
