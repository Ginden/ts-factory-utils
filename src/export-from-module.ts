import ts from "typescript";
import {StringOrIdentifier, toIdentifier} from "./to-identifier";

type ExportVarOptions = ['var', identifier: StringOrIdentifier, value: ts.Expression];
type ExportLetOptions = ['let', identifier: StringOrIdentifier, value: ts.Expression];
type ExportConstOptions = ['const', identifier: StringOrIdentifier, value: ts.Expression]
type ExportFunctionOptions = ['function', identifier: StringOrIdentifier, parameters: ts.ParameterDeclaration[], body: ts.Block];
type ExportTypeOptions = ['type', identifier: StringOrIdentifier, type: ts.TypeNode, typeParameters?: ts.TypeParameterDeclaration[]];
type ExportInterfaceOptions = ['interface', identifier: StringOrIdentifier, members: ts.TypeElement[], typeParameters?: ts.TypeParameterDeclaration[]];
type ExportEnumOptions = ['enum', identifier: StringOrIdentifier, members: ts.EnumMember[]];
type ExportClassOptions = ['class', identifier: StringOrIdentifier, members: ts.ClassElement[], typeParameters?: ts.TypeParameterDeclaration[]];

type ExportOptions = ExportVarOptions | ExportLetOptions | ExportConstOptions | ExportFunctionOptions | ExportTypeOptions | ExportInterfaceOptions | ExportEnumOptions | ExportClassOptions;

function exportVar(...args: ExportVarOptions | ExportConstOptions | ExportLetOptions) {
    const [type, identifier, value] = args;
    const flag = (() => {
        switch (type) {
            case "var":
                return ts.NodeFlags.None;
            case "let":
                return ts.NodeFlags.Let;
            case "const":
                return ts.NodeFlags.Const;
        }
    })();
    return ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [ts.factory.createVariableDeclaration(
                toIdentifier(identifier),
                undefined,
                undefined,
                value
            )],
            flag
        )
    )
}

function exportFunction(...args: ExportFunctionOptions) {
    const [, identifier, parameters, body] = args;
    return ts.factory.createFunctionDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        undefined,
        toIdentifier(identifier),
        undefined,
        parameters,
        undefined,
        body
    );
}

function exportType(...args: ExportTypeOptions) {
    const [, identifier, type, typeParameters] = args;
    return ts.factory.createTypeAliasDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        toIdentifier(identifier),
        typeParameters,
        type
    )
}

function exportInterface(...args: ExportInterfaceOptions) {
    const [, identifier, members, typeParameters] = args;
    return ts.factory.createInterfaceDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        toIdentifier(identifier),
        typeParameters,
        undefined,
        members
    )
}

function exportEnum(...args: ExportEnumOptions) {
    const [, identifier, members] = args;
    return ts.factory.createEnumDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        toIdentifier(identifier),
        members
    )
}

function exportClass(...args: ExportClassOptions) {
    const [, identifier, members, typeParameters] = args;
    return ts.factory.createClassDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        toIdentifier(identifier),
        typeParameters,
        undefined,
        members
    )
}

/**
 * Easily export something from module
 * More advanced cases should be handled manually
 */
export function exportFromModule(...options: ExportTypeOptions): ts.TypeAliasDeclaration;
export function exportFromModule(...options: ExportInterfaceOptions): ts.InterfaceDeclaration;
export function exportFromModule(...options: ExportEnumOptions): ts.EnumDeclaration;
export function exportFromModule(...options: ExportClassOptions): ts.ClassDeclaration;
export function exportFromModule(...options: ExportFunctionOptions): ts.FunctionDeclaration;
export function exportFromModule(...options: ExportVarOptions | ExportConstOptions | ExportLetOptions): ts.VariableStatement;
export function exportFromModule(...options: ExportOptions): ts.Statement {


    switch (options[0]) {
        case "var":
        case "let":
        case "const":
            return exportVar(...options);
        case "function":
            return exportFunction(...options);
        case "type":
            return exportType(...options);
        case "interface":
            return exportInterface(...options);
        case "enum":
            return exportEnum(...options);
        case "class":
            return exportClass(...options);
    }

    // @ts-ignore
    throw new Error(`Unsupported export type (${String(options[0])})`);
}
