import type {
  NodeTypes,
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
} from "es-html-parser";

type PostFix<T, S extends string> = {
  [K in keyof T as `${K & string}${S}`]: T[K];
};

export type TemplateHTMLVisitor = BaseVisiter & PostFix<BaseVisiter, ":exit">;
export type TemplateHTMLVisitorKeys = {
  [key in NodeTypes]: string[];
};

type BaseVisiter = {
  [key in NodeTypes]: (node: AnyNode) => void;
};
