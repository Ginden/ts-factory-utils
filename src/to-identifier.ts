import ts from "typescript";

export type StringOrIdentifier = string | ts.Identifier;

export function toIdentifier(name: StringOrIdentifier): ts.Identifier {
    if (typeof name === 'string') {
        return ts.factory.createIdentifier(name);
    }
    return name;
}
