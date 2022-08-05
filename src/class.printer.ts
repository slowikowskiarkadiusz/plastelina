import { Printer } from "./base.printer";
import { Attribute, Model, Property } from "./models";

export class ClassPrinter extends Printer {
    private usings: string[] = [];

    public generate(model: Model, modelKey: string, namespace: string): string[] {
        let result: string[] = ['// This file was generated automatically. Do not modify it by hand.', ''];

        model.usings?.forEach(dependency => this.addUsing(dependency));

        var class_ = this.generateClass(model, modelKey);

        if (this.usings.length > 0) {
            this.usings.forEach(using => result.push(`using ${using};`));
            result.push('');
        }

        if (namespace) {
            result.push(`namespace ${namespace};`);
            result.push('');
            result.push(...class_);
            result.push('');
        }
        else
            result.push(...class_);

        return result;
    }

    private generateClass(model: Model, key: string): string[] {
        let result: string[] = [];

        result.push(`public class ${model.$id ?? key}`);
        result.push("{");
        if (model.properties)
            Object.keys(model.properties).forEach(key => result.push(...this.indent(this.renderProperty(model.properties[key], key, false, model.required?.includes(key)))));
        result.push("}");

        return result;
    }

    private renderProperty(property: Property, propertyKey: string, isArray?: boolean, isRequired?: boolean): string[] {
        let result: string[] = [];

        let type = '';

        if (property.$ref) {
            let split = property.$ref.split('/');
            type = property.format ?? split[split.length - 1];
        }
        else {
            type = property.format ?? property.type;

            if (type == "array")
                return this.renderProperty(property.items, propertyKey, true);
        }

        property.attributes?.forEach(attribute => result.push(...this.renderAttribute(attribute)));

        result.push(`public ${this.renderType(type, isArray, isRequired)} ${this.capitalize(propertyKey)} { get; set; }`);

        return result;
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

    private renderType(type: string, isArray: boolean, isRequired: boolean): string {
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
        return value[0].toUpperCase().concat(value.substring(1));
    };
}