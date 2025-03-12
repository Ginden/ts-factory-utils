import {factory as originalFactory} from 'typescript';
import {convertValueToExpressionNode} from "./raw-object-to-expression";
import {exportFromModule} from "./export-from-module";
export {toIdentifier, StringOrIdentifier} from "./to-identifier";

const extension = {
    convertValueToExpressionNode,
    exportFromModule,
}

export const factory: (typeof extension & typeof originalFactory) = Object.assign(Object.create(originalFactory), extension);
