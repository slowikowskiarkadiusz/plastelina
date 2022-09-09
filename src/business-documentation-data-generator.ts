import * as fs from 'fs';
import * as YAML from "yaml";
import { businessDocsPath, mergedPath } from './consts';
import { Properties } from './models';
import { splitRef } from './utils';

interface Schema {
    description: string;
    dependecies: string[];
    confluencePageContentId: string;
    type: string;
    namespace: string;
}

interface Entity extends Schema {
    required: string[];
    properties: Properties;
}

interface Enum extends Schema {
    enum: string[];
}

interface Info {
    name: string;
    description: string;
    namespace: string;
}

interface EntityInfo extends Info {
    propertyInfos: PropertyInfo[];
    dependecies: string[];
}

interface PropertyInfo extends Info {
    type: string;
    required: string;
    dependecies: string[];
    description: string;
}

interface EnumInfo extends Info {
    name: string;
    values: string[];
}

interface ChapterTableData {
    title: string;
    description: string;
    isEnum: boolean;
    table: string[][];
}

interface EntityDocumentData {
    title: string;
    introduction: string;
    confluencePageContentId: string;
    chapters: ChapterTableData[];
}

export class BusinessDocumentationDataGenerator {
    public static run(): void {
        let data = fs.readFileSync(mergedPath);
        let schemas = YAML.parse(data.toString()).components.schemas;
        let entities: { entity: Entity, entityKey: string, entityNamespace: string }[] = [];
        let enums: { enum: Enum, enumKey: string, enumNamespace: string }[] = [];
        Object.keys(schemas).forEach((namespaceKey: string) => {
            Object.keys(schemas[namespaceKey]).forEach(schemaKey => {
                let value = schemas[namespaceKey][schemaKey];
                if (value.allOf) {
                    let notRef = value.allOf.filter(x => !x.$ref)[0];
                    let split = splitRef(value.allOf.filter(x => x.$ref)[0].$ref);
                    let $ref = schemas[split.namespace][split.type];
                    entities.push({ entity: { ...notRef, properties: { ...notRef.properties, ...$ref.properties } }, entityNamespace: namespaceKey, entityKey: schemaKey });
                }
                else if (value.type == "object") {
                    entities.push({ entity: value, entityNamespace: namespaceKey, entityKey: schemaKey });
                } else if (value.type == "string" && Object.keys(value).includes("enum"))
                    enums.push({ enum: value, enumNamespace: namespaceKey, enumKey: schemaKey });
            });
        });

        let confluencableEntities: EntityInfo[] = [];

        let processedEntities: EntityInfo[] = entities.map(x => {
            let processed = BusinessDocumentationDataGenerator.processEntity(x.entityKey, x.entityNamespace, x.entity);
            if (x.entity.confluencePageContentId) confluencableEntities.push(processed);
            return processed;
        });
        let processedEnums: EnumInfo[] = enums.map(x => BusinessDocumentationDataGenerator.processEnum(x.enumKey, x.enum));

        let allData: EntityDocumentData[] = confluencableEntities.map(entity => {
            let relatedEntities = [entity];
            BusinessDocumentationDataGenerator.getRelatedEntities(entity, relatedEntities, processedEntities);
            relatedEntities.filter((elem, index, self) => index === self.indexOf(elem));

            let chapters = relatedEntities.map(x => BusinessDocumentationDataGenerator.createEntityChapter(x));
            chapters.push(...processedEnums
                .filter(x => relatedEntities
                    .filter(entity => entity.propertyInfos.filter(y => y.type.includes(x.name)).length > 0).length > 0)
                .map(x => BusinessDocumentationDataGenerator.createEnumChapter(x)));

            let rawEntity = entities.filter(x => x.entityKey === entity.name)[0];

            return {
                title: `${BusinessDocumentationDataGenerator.capitalize(rawEntity.entityKey)} [Auto Generated]`,
                introduction: rawEntity.entity.description,
                confluencePageContentId: rawEntity.entity.confluencePageContentId,
                chapters: chapters,
            };
        });

        fs.writeFileSync(businessDocsPath, JSON.stringify(allData));
    }

    private static capitalize(str: string, inserSpaces: boolean = true): string {
        if (!str || str.length == 0 || !str.charAt) return '';
        str = str.charAt(0).toUpperCase() + str.slice(1);
        str = str.replace('-', '');
        let result: string[] = [];

        for (let i = 0; i < str.length; i++) {
            let letter = str[i];

            if (inserSpaces && i > 0 && str[i - 1] != ' ' && letter.toUpperCase() == letter && ![' ', '-'].includes(letter))
                result.push(` `);

            result.push(letter);
        }

        result.forEach((value: string, index: number) => {
            if ([' ', '-'].includes(value) && index < result.length - 1)
                result[index + 1] = result[index + 1].toUpperCase();
        });

        return result.join('');
    }

    private static getTypeOfProperty(property: any): string {
        if (property.$ref)
            return `${splitRef(property.$ref).type}`;
        else if (property.format)
            return `${property.format}`;
        else if (property.type === "array")
            return `Collection of ${BusinessDocumentationDataGenerator.getTypeOfProperty(property.items)}`;
        else
            return `${property.type}`;
    }

    private static processEntity(entityName: string, entityNamespace: string, entity: Entity): EntityInfo {
        let entityInfo: EntityInfo = { name: entityName, description: entity.description, namespace: entityNamespace, propertyInfos: [], dependecies: entity.dependecies };
        if (entity.properties) {
            Object.keys(entity.properties).forEach(x => {
                let type = BusinessDocumentationDataGenerator.getTypeOfProperty(entity.properties[x]);

                entityInfo.propertyInfos.push(
                    {
                        name: x,
                        type: type,
                        namespace: entityNamespace,
                        dependecies: entity.dependecies,
                        required: entity.required?.includes(x) ? "Yes" : "No",
                        description: entity.properties[x].description,
                    }
                );
            });
        }

        return entityInfo;
    }

    private static processEnum(enumName: string, _enum: Enum): EnumInfo {
        return { name: enumName, description: _enum.description, namespace: _enum.namespace, values: _enum.enum.map(x => x) };
    }

    private static createEntityChapter(entityInfo: EntityInfo): ChapterTableData {
        let printableProperties = ['name', 'type', 'required', 'description'];

        entityInfo.propertyInfos = entityInfo.propertyInfos.map(x => {
            return {
                ...x,
                type: splitRef(x.type).type,
            };
        })

        return {
            title: entityInfo.name,
            description: entityInfo.description,
            isEnum: false,
            table: [printableProperties.map(x => this.capitalize(x)), ...entityInfo.propertyInfos.map(propInfo => printableProperties.map(propName => propInfo[propName]))]
        };
    }

    private static createEnumChapter(enumInfo: EnumInfo): ChapterTableData {
        return {
            title: enumInfo.name,
            description: enumInfo.description,
            isEnum: true,
            table: [["Member name"], ...enumInfo.values.map(x => [x])]
        };
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
                    BusinessDocumentationDataGenerator.getRelatedEntities(x, relatedEntities, processedEntities);
                }
            });
    }

    public static removeDocsTemp(preventLogging?: boolean): void {
        if (!preventLogging) console.log(`Removing ${businessDocsPath}...`);
        fs.rmSync(businessDocsPath);
    }
}
