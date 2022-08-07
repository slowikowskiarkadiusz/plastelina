import { Printer } from "./base.printer";
import { Model } from "./models";

export class EnumPrinter extends Printer {
    public generate(model: Model, modelKey: string, namespace: string): string[] {
        let result: string[] = ['// This file was generated automatically. Do not modify it by hand.', ''];

        var enum_ = this.generateEnum(model, modelKey);

        if (namespace)
            result.push(`namespace ${namespace};`, '');

        if (model.description)
            result.push(...this.summary(model.description));

        result.push(...enum_);

        return result;
    }

    private generateEnum(model: Model, key: string): string[] {
        let result: string[] = [];

        result.push(`public enum ${model.$id ?? key}`);
        result.push("{");
        model.enum.forEach(x => result.push(...this.indent([`${x},`])));

        result.push("}");

        return result;
    }
}