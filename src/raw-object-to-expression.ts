import type { JsonObject, JsonValue} from "type-fest";
import ts from "typescript";

function convertValueToLiteral(this: void, value: JsonValue): ts.Expression {
    if (value === null) {
        return ts.factory.createNull();
    } else if (typeof value === "string") {
        return ts.factory.createStringLiteral(value);
    } else if (typeof value === "number") {
        return ts.factory.createNumericLiteral(value.toString());
    } else if (typeof value === "boolean") {
        return value ? ts.factory.createTrue() : ts.factory.createFalse();
    } else if (Array.isArray(value)) {
        return ts.factory.createArrayLiteralExpression(value.map(convertValueToLiteral))
    }
    // Bad typing in built-in library "readonly JsonValue[]" is not recognized as an array by Array.isArray
    const v = value as JsonObject;

    const properties = Object.entries(v).map(([key, value]) => {
        return ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(key),
            convertValueToLiteral(value)
        );
    })

    return ts.factory.createObjectLiteralExpression( properties)
}

/**
 *
 */
export function convertValueToExpressionNode(obj: JsonValue): ts.Expression {
    return convertValueToLiteral(obj);
}
