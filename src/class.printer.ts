import { Printer } from "./base.printer";
import { Attribute, Model, Properties, Property } from "./models";

export class ClassPrinter extends Printer {
    public nugets: string[] = [];
    private usings: string[] = [];

    public generate(model: Model, modelKey: string, namespace: string): string[] {
        let result: string[] = ['// This file was generated automatically. Do not modify it by hand.', ''];

        model.usings?.forEach(dependency => this.addUsing(dependency));

        var class_ = this.generateClass(model, modelKey);

        if (this.usings.length > 0) {
            this.usings.forEach(using => result.push(`using ${using};`));
            result.push('');
        }

        if (namespace)
            result.push(`namespace ${namespace}`, '{');

        result.push(...Printer.indent(...class_));

        if (namespace)
            result.push('}');

        result = result.map(x => x === Printer.indent('')[0] ? '' : x);

        return result;
    }

    private generateClass(model: Model, key: string): string[] {
        let result: string[] = [];

        if (model.description)
            result.push(...Printer.summary(model.description));

        result.push(`public class ${key}`);
        result.push("{");
        if (model.properties) {
            Object.keys(model.properties).forEach((key, i, c) => {
                result.push(...Printer.indent(...this.renderProperty(model.properties[key], key, false, model.required?.includes(key))))

                if (i !== c.length - 1) result.push('');
            });

            if (model.required?.length > 0) {
                result.push('', ...Printer.indent(...this.renderConstructor({}, key)));
                result.push('', ...Printer.indent(...this.renderConstructor(model.properties, key)));
                let requiredProperties: Properties = {};
                model.required.forEach(x => requiredProperties[x] = model.properties[x]);
                if (!Object.keys(model.properties).some(x => Object.keys(requiredProperties).includes(x)))
                    result.push('', ...Printer.indent(...this.renderConstructor(requiredProperties, key)));
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
            Object.keys(properties).forEach((key, i, c) => result.push(...Printer.indent(`${this.renderType(properties[key], true)} ${this.decapitalize(key)}${i === c.length - 1 ? '' : ','}`)));
            result[result.length - 1] += ')';
            result.push('{');
            Object.keys(properties).forEach(key => {
                let rightSide = this.decapitalize(key);
                let leftSide = this.capitalize(key);
                result.push(...Printer.indent(`${leftSide === rightSide ? 'this.' : ''}${leftSide} = ${rightSide};`));
            });
            result.push('}');
        }

        return result;
    }

    private renderProperty(property: Property, propertyKey: string, isArray?: boolean, isRequired?: boolean): string[] {
        let result: string[] = [];

        if (property.description)
            result.push(...Printer.summary(property.description));

        property.attributes?.forEach(attribute => result.push(...this.renderAttribute(attribute)));

        if (isRequired)
            result.push(...this.reunderJsonRequiredAttribute());

        result.push(`public ${this.renderType(property, isRequired)} ${this.capitalize(propertyKey)} { get; set; }`);

        return result;
    }

    private reunderJsonRequiredAttribute(): string[] {
        const newtonsoftJson = 'Newtonsoft.Json';

        if (!this.nugets.includes(newtonsoftJson))
            this.nugets.push(newtonsoftJson);

        if (!this.usings.includes(newtonsoftJson))
            this.usings.push(newtonsoftJson);

        return this.renderAttribute({ name: 'JsonProperty', parameters: [{ name: 'Required', value: 'Required.Always' }] });
    }

    private renderAttribute(attribute: Attribute): string[] {
        let parameters: string[] = attribute.parameters.map(parameter => {
            if (parameter.name)
                return `${parameter.name} = ${parameter.value}`;
            else
                return parameter.value;
        });

        return [`[${attribute.name}(${parameters.join(', ')})]`];
    }

    private renderType(property: Property, isRequired: boolean, isArray?: boolean): string {
        let type = '';

        if (property.$ref) {
            let split = property.$ref.split('/');
            type = property.format ?? split[split.length - 1];
        }
        else {
            type = property.format ?? property.type;

            if (type == "array")
                return this.renderType(property.items, true, true);
        }

        var renderedType = '';

        switch (type) {
            case "string":
                renderedType = "string";
                break;
            case "integer":
            case "number":
                renderedType = this.nullable("int", !isRequired);
                break;
            case "decimal":
                renderedType = this.nullable("decimal", !isRequired);
                break;
            case "boolean":
                renderedType = this.nullable("bool", !isRequired);
                break;
            case "double":
                renderedType = this.nullable("double", !isRequired);
                break;
            case "date-time":
            case "date":
            case "time":
                renderedType = this.nullable("DateTime", !isRequired);
                this.addUsing("System");
                break;
            default:
                renderedType = type;
                break;
        };

        if (isArray) {
            renderedType = `IEnumerable<${renderedType.replace('?', '')}>`;
            this.addUsing("System.Collections.Generic");
        }

        return renderedType;
    }

    private nullable(value: string, nullable: boolean): string {
        return `${value}${(nullable ? "?" : '')}`
    };

    private addUsing(value: string): void {
        if (!this.usings.includes(value))
            this.usings.push(value);
    }

    private capitalize(value: string): string {
        return this.handleReservedWord(value[0].toUpperCase().concat(value.substring(1)));
    }

    private decapitalize(value: string): string {
        return this.handleReservedWord(value[0].toLowerCase().concat(value.substring(1)));
    }

    private handleReservedWord(word: string): string {
        const reservedWords = ['abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while'];
        return reservedWords.includes(word) ? `@${word}` : word;
    }
}