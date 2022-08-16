import * as fs from 'fs';
import * as YAML from "yaml";
import { Confluence } from 'ts-confluence-client';
import { ContentFormat } from 'ts-confluence-client/dist/resources/types';
import { UpdatePageProperties } from 'ts-confluence-client/dist/resources/contentApi';
import { generatedDirectory, mergedPath } from './consts';

interface Schema {
    namespace: string;
    description: string;
    dependecies: string[];
    confluencePageContentId: string;
    type: string;
}

interface Entity extends Schema {
    properties: any;
    required: string[];
    // properties: { [key: string]: { type: string; format?: string; items?: { type: string }[] | { $ref: string }[] } | { $ref: string } }
}

interface Enum extends Schema {
    enum: string[];
}

interface Info {
    name: string;
    dependecies: string[];
    namespace: string;
}

interface EntityInfo extends Info {
    propertyInfos: PropertyInfo[];
}

interface PropertyInfo extends Info {
    type: string;
    required: string;
    description: string;
}

interface EnumInfo {
    name: string;
    values: string[];
}

export class Confluencer {
    public static run(argv: any): void {
        const sourceFile = mergedPath;

        if (argv.username && argv.apiToken) {
            let data = fs.readFileSync(sourceFile);
            let schemas = YAML.parse(data.toString()).components.schemas;
            let entities: Entity[] = [];
            let enums: Enum[] = [];
            Object.keys(schemas).forEach((schemaKey: string) => {
                let value = schemas[schemaKey];
                if (value.type == "object") {
                    entities.push(value);
                } else if (value.type == "string" && Object.keys(value).includes("enum"))
                    enums.push(value);
            });

            let confluencableEntities: EntityInfo[] = [];

            let processedEntities: EntityInfo[] = entities.map(x => {
                let processed = Confluencer.processEntity(x);
                if (x.confluencePageContentId) confluencableEntities.push(processed);
                return processed;
            });
            let processedEnums: EnumInfo[] = enums.map(x => Confluencer.processEnum(x));

            confluencableEntities.forEach(async entity => {
                let relatedEntities = [entity];
                Confluencer.getRelatedEntities(entity, relatedEntities, processedEntities);
                relatedEntities.filter((elem, index, self) => index === self.indexOf(elem));

                let chapters = relatedEntities.map(x => Confluencer.createEntityChapter(x));
                processedEnums
                    .filter(x => relatedEntities
                        .filter(entity => entity.propertyInfos.filter(y => y.type.includes(x.name)).length > 0).length > 0)
                    .forEach(x => chapters.push(Confluencer.createEnumChapter(x)));

                let rawEntity = entities.filter(x => x.$id === entity.name)[0];
                let confluencePageContentId = rawEntity.confluencePageContentId;
                let introduction = rawEntity.description;

                console.log(`Uploading ${entity.name} to a confluence page with a content id: ${confluencePageContentId}`);

                await Confluencer.uploadToConfluence(argv, confluencePageContentId, entity.name, introduction, chapters.join('\n'));
            });
        }
        else {
            console.log("Credentials for confluence are not suffienct. You did not specify either a username or a password");
        }
    }

    private static capitalize(str: string, inserSpaces: boolean = true): string {
        if (!str || str.length == 0 || !str.charAt) return '';
        str = str.charAt(0).toUpperCase() + str.slice(1);
        str = str.replace('-', '');
        let result: string[] = [];

        for (let i = 0; i < str.length; i++) {
            let letter = str[i];

            if (inserSpaces) {
                if (i > 0 && str[i - 1] != ' ' && letter.toUpperCase() == letter && ![' ', '-'].includes(letter)) {
                    result.push(` `);
                }
            }

            result.push(letter);
        }

        result.forEach((value: string, index: number) => {
            if ([' ', '-'].includes(value) && index < result.length - 1)
                result[index + 1] = result[index + 1].toUpperCase();
        });

        return result.join('');
    }

    private static getRefType(ref: string): string {
        return ref.substring(21);
    }

    private static getTypeOfProperty(property: any): string {
        if (property.$ref)
            return `${Confluencer.getRefType(property.$ref)}`;
        else if (property.format)
            return `${property.format}`;
        else if (property.type === "array")
            return `Collection of ${Confluencer.getTypeOfProperty(property.items)}`;
        else
            return `${property.type}`;
    }

    private static processEntity(entity: Entity): EntityInfo {
        let entityInfo: EntityInfo = { name: entity.$id, namespace: entity.namespace, propertyInfos: [], dependecies: entity.dependecies };
        if (entity.properties) {
            Object.keys(entity.properties).forEach(x => {
                let type = Confluencer.getTypeOfProperty(entity.properties[x]);

                entityInfo.propertyInfos.push(
                    {
                        name: x,
                        type: type,
                        namespace: entity.namespace,
                        dependecies: entity.dependecies,
                        required: entity.required?.includes(x) ? "Yes" : "No",
                        description: entity.properties[x].description,
                    }
                );
            });
        }

        return entityInfo;
    }

    private static processEnum(_enum: Enum): EnumInfo {
        return { name: _enum.$id, values: _enum.enum.map(x => x) };
    }

    private static createEntityChapter(entityInfo: EntityInfo): string {
        let chapter = '';

        let printableProperties = ['name', 'type', 'required', 'description'];

        chapter += `<h2>${Confluencer.capitalize(entityInfo.name)}</h2>\n`;
        chapter += "This is an entity. \n"
        chapter += "<table>\n";

        chapter += "<tr>\n";
        printableProperties.forEach(x => chapter += `<th><b>${Confluencer.capitalize(x)}</b></th>\n`);
        chapter += "</tr>\n";

        entityInfo.propertyInfos.forEach(x => {
            chapter += "<tr>\n";
            printableProperties.forEach(y => {
                if (y != 'dependecies')
                    chapter += `<td>${Confluencer.capitalize(x[y])}</td>\n`
            });
            chapter += "</tr>\n";
        });

        chapter += "</table>\n";

        return chapter;
    }

    private static createEnumChapter(enumInfo: EnumInfo): string {
        let chapter = '';

        chapter += `<h2>${Confluencer.capitalize(enumInfo.name)}</h2>\n`;
        chapter += "This is an enum. \n"
        chapter += "<table>\n";

        chapter += "<tr>\n";
        chapter += `<th><b>Member name</b></th>\n`;
        chapter += "</tr>\n";

        enumInfo.values.forEach(x => {
            chapter += "<tr>\n";
            chapter += `<td>${Confluencer.capitalize(x, false)}</td>\n`;
            chapter += "</tr>\n";
        });

        chapter += "</table>\n";

        return chapter;
    }

    private static async uploadToConfluence(argv: any, contentId: string, title: string, introduction: string, pageContent: string): Promise<void> {
        // let argv = yargs(hideBin(process.argv)).argv;
        let confluence = new Confluence({
            host: argv.host,
            username: argv.username,
            apiToken: argv.apiToken
        });

        let templateBody = await (await confluence.content.getContentById(argv.templateId, ['body.storage', 'version'])).body.storage.value;

        let body = templateBody.replace('{{introduction}}', introduction)
        body = body.replace('{{content}}', pageContent);

        let content = await confluence.content.getContentById(contentId);

        let updateProperties: UpdatePageProperties = {
            body: body,
            format: ContentFormat.storage,
            title: `${Confluencer.capitalize(title)} [Auto Generated]`,
            version: ++content.version.number
        };
        await confluence.content.updateContent(contentId, updateProperties).catch(err => console.log(err));
    }

    private static getRelatedEntities(entity: EntityInfo, relatedEntities: EntityInfo[], processedEntities: EntityInfo[]) {

        processedEntities.filter(x =>
            entity.propertyInfos.filter(y =>
                (x.namespace == y.namespace || y.dependecies?.includes(x.namespace)) &&
                y.type.includes(x.name)
            ).length > 0)
            .filter(x => x.name != entity.name)
            .forEach(x => {
                if (!relatedEntities.includes(x)) {
                    relatedEntities.push(x);
                    Confluencer.getRelatedEntities(x, relatedEntities, processedEntities);
                }
            });
    }
}
