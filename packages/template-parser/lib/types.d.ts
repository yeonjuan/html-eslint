import type {
  DocumentNode,
  AttributeNode,
  AttributeKeyNode,
  AttributeValueNode,
  AttributeValueWrapperEndNode,
  AttributeValueWrapperStartNode,
  CloseScriptTagNode,
  CloseStyleTagNode,
  CloseTagNode,
  CommentContentNode,
  CommentNode,
  CommentOpenNode,
  CommentCloseNode,
  DoctypeNode,
  DoctypeAttributeNode,
  DoctypeAttributeValueNode,
  DoctypeAttributeWrapperEndNode,
  DoctypeAttributeWrapperStartNode,
  DoctypeOpenNode,
  DoctypeCloseNode,
  OpenScriptTagEndNode,
  OpenScriptTagStartNode,
  OpenStyleTagEndNode,
  OpenStyleTagStartNode,
  OpenTagEndNode,
  OpenTagStartNode,
  ScriptTagNode,
  ScriptTagContentNode,
  StyleTagNode,
  StyleTagContentNode,
  TagNode,
  TextNode,
  AnyNode,
} from "@html-eslint/types";
import { NodeTypes } from "es-html-parser";

type PostFix<T, S extends string> = {
  [K in keyof T as `${K & string}${S}`]: T[K];
};

export type TemplateHTMLVisitor = BaseVisiter & PostFix<BaseVisiter, ":exit">;
export type TemplateHTMLVisitorKeys = {
  [key in NodeTypes]: string[];
};

type BaseVisiter = Partial<{
  [NodeTypes.Document]: (node: DocumentNode) => void;
  [NodeTypes.Attribute]: (node: AttributeNode) => void;
  [NodeTypes.AttributeKey]: (node: AttributeKeyNode) => void;
  [NodeTypes.AttributeValue]: (node: AttributeValueNode) => void;
  [NodeTypes.AttributeValueWrapperEnd]: (
    node: AttributeValueWrapperEndNode
  ) => void;
  [NodeTypes.AttributeValueWrapperStart]: (
    node: AttributeValueWrapperStartNode
  ) => void;
  [NodeTypes.CloseScriptTag]: (node: CloseScriptTagNode) => void;
  [NodeTypes.CloseStyleTag]: (node: CloseStyleTagNode) => void;
  [NodeTypes.CloseTag]: (node: CloseTagNode) => void;
  [NodeTypes.Comment]: (node: Comment) => void;
  [NodeTypes.CommentContent]: (node: CommentContentNode) => void;
  [NodeTypes.CommentOpen]: (node: CommentOpenNode) => void;
  [NodeTypes.CommentClose]: (node: CommentCloseNode) => void;
  [NodeTypes.Doctype]: (node: DoctypeNode) => void;
  [NodeTypes.DoctypeAttribute]: (node: DoctypeAttributeNode) => void;
  [NodeTypes.DoctypeAttributeValue]: (node: DoctypeAttributeValueNode) => void;
  [NodeTypes.DoctypeAttributeWrapperEnd]: (
    node: DoctypeAttributeWrapperEndNode
  ) => void;
  [NodeTypes.DoctypeAttributeWrapperStart]: (
    node: DoctypeAttributeWrapperStartNode
  ) => void;
  [NodeTypes.DoctypeOpen]: (node: DoctypeOpenNode) => void;
  [NodeTypes.DoctypeClose]: (node: DoctypeCloseNode) => void;
  [NodeTypes.OpenScriptTagEnd]: (node: OpenScriptTagEndNode) => void;
  [NodeTypes.OpenScriptTagStart]: (node: OpenScriptTagStartNode) => void;
  [NodeTypes.OpenStyleTagEnd]: (node: OpenStyleTagEndNode) => void;
  [NodeTypes.OpenStyleTagStart]: (node: OpenStyleTagStartNode) => void;
  [NodeTypes.OpenTagEnd]: (node: OpenTagEndNode) => void;
  [NodeTypes.OpenTagStart]: (node: OpenTagStartNode) => void;
  [NodeTypes.ScriptTag]: (node: ScriptTagNode) => void;
  [NodeTypes.ScriptTagContent]: (node: ScriptTagContentNode) => void;
  [NodeTypes.StyleTag]: (node: StyleTagNode) => void;
  [NodeTypes.StyleTagContent]: (node: StyleTagContentNode) => void;
  [NodeTypes.Tag]: (node: TagNode) => void;
  [NodeTypes.Text]: (node: TextNode) => void;
}>;

type PostFix<T, S extends string> = {
  [K in keyof T as `${K & string}${S}`]: T[K];
};

export type TemplateHTMLVisitor = BaseVisiter & PostFix<BaseVisiter, ":exit">;
export type TemplateHTMLVisitorKeys = {
  [key in NodeTypes]: string[];
};
