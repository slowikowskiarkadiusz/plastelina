export interface Model {
    description: string;
    namespace: string;
    usings: string[];
    references: string[];
    nugets: string[];
    type: string;
    properties: Properties;
    required: string[];
    enum: string[];
}

export interface Properties {
    [key: string]: Property;
}

export interface Property {
    $ref: string,
    type: string;
    description: string;
    format: string;
    items: Property;
    attributes: Attribute[];
}

export interface Attribute {
    name: string;
    parameters: {
        name?: string;
        value: string;
    }[];
}