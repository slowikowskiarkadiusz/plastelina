import { ArgumentSettings } from "./argument_settings";
import { Merger } from "./merger";
import { Attribute, Model, Properties, Property } from "./models";
import { indent, splitRef, summary } from "./utils";

export class ClassPrinter {
    private nugets: string[] = [];
    private usings: string[] = [];

    public generate(model: Model, modelKey: string, namespace: string, derivedFrom: string = null): { result: string[], nugets: string[] } {
        let result: string[] = ['// This file was generated automatically. Do not modify it by hand.', ''];

        model.usings?.forEach(dependency => this.addUsing(dependency));

        var class_ = this.generateClass(model, modelKey, derivedFrom);

        if (this.usings.length > 0) {
            this.usings.forEach(using => result.push(`using ${using};`));
            result.push('');
        }

        if (namespace) {
            result.push(`namespace ${namespace}`);
            result.push('{');
            result.push(...indent(...class_));
            result.push('}');
        }
        else
            result.push(...class_);

        return { result: result, nugets: this.nugets };
    }

    private generateClass(model: Model, key: string, derivedFrom: string = null): string[] {
        let result: string[] = [];

        if (model.description)
            result.push(...summary(model.description));

        result.push(`public class ${key}${!!derivedFrom ? ` : ${derivedFrom}` : ''}`);
        result.push("{"); if (model.properties) {
            Object.keys(model.properties).forEach((key, i, c) => {
                result.push(...indent(...this.renderProperty(model.properties[key], key, model.required?.includes(key))))

                if (i !== c.length - 1) result.push('');
            });

            if (ArgumentSettings.constructors) {
                result.push('', ...indent(...this.renderConstructor({}, key)));

                if (model.required?.length > 0) {
                    let requiredProperties: Properties = {};
                    model.required.forEach(x => {
                        if (!!model.properties[x])
                            requiredProperties[x] = model.properties[x];
                    });
                    if (Object.keys(model.properties).filter(x => !Object.keys(requiredProperties).includes(x)).length > 0)
                        result.push('', ...indent(...this.renderConstructor(requiredProperties, key)));
                }

                result.push('', ...indent(...this.renderConstructor(model.properties, key)));
            }
        }
        result.push("}");

        return result;
    }

    private renderConstructor(properties: Properties, key: string): string[] {
        let result: string[] = [];
        const isEmpty: boolean = Object.keys(properties).length === 0;

        if (isEmpty) {
            result.push(`public ${key}() { }`);
        }
        else {
            result.push(`public ${key}(`);
            Object.keys(properties).forEach((key, i, c) => result.push(...indent(`${this.renderType(properties[key])} ${this.decapitalize(key)}${i === c.length - 1 ? '' : ','}`)));
            result[result.length - 1] += ')';
            result.push('{');
            Object.keys(properties).forEach(key => {
                let rightSide = this.decapitalize(key);
                let leftSide = this.capitalize(key);
                result.push(...indent(`${leftSide === rightSide ? 'this.' : ''}${leftSide} = ${rightSide};`));
            });
            result.push('}');
        }

        return result;
    }

    private getRef($ref: string): { model: Model, key: string } {
        let split = splitRef($ref);
        return { model: Merger.getFullSchemas()[split.namespace][split.type], key: split.type };
    }

    private isRefClass($ref: string): boolean {
        return !this.getRef($ref).model.enum;
    }

    private renderProperty(property: Property, propertyKey: string, isRequired?: boolean): string[] {
        let result: string[] = [];

        if (property.description)
            result.push(...summary(property.description));

        property.attributes ??= [];

        if (isRequired)
            this.addRequiredAttributeToArray(property.attributes);

        property.attributes?.forEach(attribute => result.push(...this.renderAttribute(attribute)));

        result.push(`public ${this.renderType(property, !!isRequired)} ${this.capitalize(propertyKey)} { get; ${ArgumentSettings.privatesetters ? 'private ' : ''}set; }`);

        if (ArgumentSettings.defaultvalues && property.default) {
            result[result.length - 1] += this.renderDefaultValue(property, propertyKey);
        }

        return result;
    }

    private renderDefaultValue(property: Property, propertyKey: string): string {
        let result: string[] = [];
        this.processDefaultValue(property, propertyKey, property.default, result);

        if (typeof property.default === 'object' && !property.items) {
            let split = splitRef(property.$ref);
            return ` = new ${split.type} { ${result.join(' ')} };`;
        }
        else {
            return `${result.join(' ')}`;
        }
    }

    private processDefaultValue(property: Property, propertyKey: string, defaultValues: string, result: string[] = [], isNested: boolean = false): void {
        if (Array.isArray(defaultValues) && !!property.items) {
            const listType = this.renderType(property.items);

            result.push((!property.default.length ? ` = Enumerable.Empty<${listType}>()` : `= new List<${listType}>() { }`) + `${isNested ? ',' : ';'}`);
            this.addUsing('System.Linq');
        }
        else if (typeof defaultValues === 'object' || property.$ref) {
            let ref = this.getRef(property.$ref);

            for (let x of Object.keys(defaultValues)) {
                if (typeof defaultValues[x] === 'object') {
                    result.push(`${x} = new ${splitRef(ref.model.properties[x].$ref).type} {`);
                    this.processDefaultValue(ref.model.properties[x], x, defaultValues[x], result, true);
                    result.push('},');
                }
                else {
                    if (ref?.model.properties[x].$ref) {
                        let propRef = this.getRef(ref.model.properties[x].$ref);
                        result.push(`${x} = ${propRef.key}.${defaultValues[x]},`);
                    }
                    else {
                        this.processDefaultValue(ref.model.properties[x], x, defaultValues[x], result, true);
                    }
                }
            }
        }
        else {
            let render: string = `${isNested ? `${propertyKey}` : ''} = `;
            if (property.type === 'string') {
                if (property.format === 'date-time' || property.format === 'time' || property.format === 'date') {
                    let date: Date = new Date(Date.parse(defaultValues));
                    render += `new DateTime(${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()}, ${date.getMilliseconds()})`;
                }
                else render += `"${defaultValues}"`;
            }
            else render += `${defaultValues}`;

            render += `${isNested ? ',' : ';'}`;
            result.push(render);
        }
    }

    private addRequiredAttributeToArray(attributes: Attribute[]): void {
        let jsonPropertyAttribute = attributes.filter(x => x.name === 'JsonProperty')[0];

        const newtonsoftJson = 'Newtonsoft.Json';

        if (!this.nugets.includes(newtonsoftJson))
            this.nugets.push(newtonsoftJson);

        if (!this.usings.includes(newtonsoftJson))
            this.usings.push(newtonsoftJson);

        if (jsonPropertyAttribute)
            jsonPropertyAttribute.parameters.push({ name: 'Required', value: 'Required.Always' });
        else
            attributes.push({ name: 'JsonProperty', parameters: [{ name: 'Required', value: 'Required.Always' }] });
    }

    private renderAttribute(attribute: Attribute): string[] {
        let parameters = attribute
            .parameters
            ?.map(x => {
                let value = x.type === 'string' ? `"${x.value}"` : x.value;
                let left = x.name ? `${x.name} = ` : '';
                return `${left}${value}`;
            })
            .join(", ");

        return [`[${attribute.name}${parameters?.length > 0 ? `(${parameters})` : ''}]`];
    }

    private renderType(property: Property, isRequired: boolean = true, isArray?: boolean): string {
        let type = '';
        let isClass = false;

        if (property.$ref) {
            isClass = this.isRefClass(property.$ref);
            type = property.format ?? splitRef(property.$ref).type;
        }
        else {
            type = property.format ?? property.type;

            if (type == 'array')
                return this.renderType(property.items, true, true);
        }

        let renderedType: string = '';

        switch (type) {
            case 'string':
                renderedType = 'string';
                break;
            case 'integer':
                renderedType = this.nullable('int', !isRequired);
                break;
            case 'decimal':
                renderedType = this.nullable('decimal', !isRequired);
                break;
            case 'boolean':
                renderedType = this.nullable('bool', !isRequired);
                break;
            case 'double':
            case 'number':
                renderedType = this.nullable('double', !isRequired);
                break;
            case 'date-time':
            case 'date':
            case 'time':
                renderedType = this.nullable('DateTime', !isRequired);
                this.addUsing('System');
                break;
            default:
                renderedType = isClass ? type : this.nullable(type, !isRequired);
                break;
        };

        if (isArray) {
            renderedType = `IEnumerable<${renderedType.replace('?', '')}>`;
            this.addUsing('System.Collections.Generic');
        }

        return renderedType;
    }

    private nullable(value: string, nullable: boolean): string {
        return `${value}${(nullable ? "?" : '')}`
    }

    private addUsing(value: string): void {
        if (!this.usings.includes(value))
            this.usings.push(value);
    }

    private capitalize(value: string): string {
        return value[0].toUpperCase().concat(value.substring(1));
    }

    private decapitalize(value: string): string {
        return this.handleReservedWord(value[0].toLowerCase().concat(value.substring(1)));
    }

    private handleReservedWord(word: string): string {
        const reservedWords = ['abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while'];
        return reservedWords.includes(word) ? `@${word}` : word;
    }
}