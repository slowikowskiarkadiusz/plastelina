import { Model } from "./models";
import { indent } from "./utils";

export class EnumPrinter {
    public generate(model: Model, modelKey: string, namespace: string): string[] {
        let result: string[] = ['// This file was generated automatically. Do not modify it by hand.', ''];

        var enum_ = this.generateEnum(model, modelKey);

        if (namespace) {
            result.push(`namespace ${namespace}`);
            result.push('{');
            result.push(...indent(...enum_));
            result.push('}');
        }
        else
            result.push(...enum_);

        return result;
    }

    private generateEnum(model: Model, key: string): string[] {
        let result: string[] = [];

        result.push(`public enum ${key}`);
        result.push("{");
        model.enum.forEach(x => result.push(...indent(`${x},`)));

        result.push("}");

        return result;
    }
}