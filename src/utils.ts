export function indent(...rows: string[]): string[] {
    return rows.map(row => row.length > 0 ? `    ${row}` : row);
}

export function summary(content: string): string[] {
    return [
        '/// <summary>',
        `/// ${content}`,
        '/// </summary>',
    ];
}

export function splitRef($ref: string): { type: string, namespace: string } {
    let split = $ref.split('/');
    return {
        namespace: split[split.length - 2],
        type: split[split.length - 1],
    }
}