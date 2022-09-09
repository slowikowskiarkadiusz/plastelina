export interface Schemas {
    [key: string]: {
        [key: string]: Model
    };
}

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
    type: 'string' | 'integer' | 'decimal' | 'boolean' | 'double' | 'number' | 'date-time' | 'date' | 'time';
    format: string;
    items: Property;
    description: string;
    attributes: Attribute[];
    default: any;
    $ref: string;
}

export interface Attribute {
    name: string;
    parameters: {
        name?: string;
        type?: string;
        value: string;
    }[];
}