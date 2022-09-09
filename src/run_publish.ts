import { BusinessDocumentationDataGenerator } from "./business-documentation-data-generator";
import * as cp from "child_process";
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Merger } from "./merger";
import { HtmlGenerator } from "./html_generator";
import { VersionReaderWriter } from "./version-reader-writer";
import { ArgumentSettings } from "./argument_settings";
import { Validator } from "./validator";
import { businessDocsPath } from "./consts";

let argv = yargs(hideBin(process.argv)).argv;

ArgumentSettings.update();

Merger.run(true);

VersionReaderWriter.run();

Validator.run(true)
    .then(() => {
        BusinessDocumentationDataGenerator.run();

        let domainModelDocsArgs = [`--confluence`];
        domainModelDocsArgs.push(`--business-docs-path ${businessDocsPath}`);
        if (!!argv.host) domainModelDocsArgs.push(`--host ${argv.host}`);
        if (!!argv.username) domainModelDocsArgs.push(`--username ${argv.username}`);
        if (!!argv.apiToken) domainModelDocsArgs.push(`--api-token ${argv.apiToken}`);
        if (!!argv.templateContentId) domainModelDocsArgs.push(`--template-content-id ${argv.templateContentId}`);
        cp.execSync(`dotnet run --project ./src/DomainModelDocsGenerator/ConfluenceDocsGenerator/ ${domainModelDocsArgs.join(' ')}`, { stdio: 'inherit', cwd: './' });

        // cp.execSync('dotnet msbuild', { stdio: 'inherit', cwd: './src/DomainModelDocsGenerator/WordDocsGenerator' });
        // cp.execSync(`./src/DomainModelDocsGenerator/WordDocsGenerator/bin/Debug/WordDocsGenerator.exe --business-docs-path ${businessDocsPath} --template-path src/assets/D0130Template.docx --destination-directory Generated/WordDocs`, { stdio: 'inherit', cwd: './' });

        BusinessDocumentationDataGenerator.removeDocsTemp(true);
        HtmlGenerator.run();
        Merger.removeMerged(true);
    })
    .catch((err) => {
        console.log(err);
        BusinessDocumentationDataGenerator.removeDocsTemp(true);
        Merger.removeMerged(true);
    });