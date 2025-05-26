import { AnyHTMLNode } from "./html-ast";
import { AnyJsNode } from "./js-ast";
export { AnyToken } from "es-html-parser";
export type AnyNode = AnyHTMLNode | AnyJsNode;
