import { Model } from "./models";

export abstract class Printer {
    public abstract generate(model: Model, modelKey: string, namespace: string): string[];

    protected static indent(...rows: string[]): string[] {
        let result: string[] = [];
        rows.forEach(row => result.push(`    ${row}`));
        return result;
    }

    protected static summary(content: string): string[] {
        return [
            '/// <summary>',
            `/// ${content}`,
            '/// </summary>',
        ];
    }
}
