import type {
  Document,
  Attribute,
  AttributeKey,
  AttributeValue,
  AttributeValueWrapperEnd,
  AttributeValueWrapperStart,
  CloseScriptTag,
  CloseStyleTag,
  CloseTag,
  CommentContent,
  Comment,
  CommentOpen,
  CommentClose,
  Doctype,
  DoctypeAttribute,
  DoctypeAttributeValue,
  DoctypeAttributeWrapperEnd,
  DoctypeAttributeWrapperStart,
  DoctypeOpen,
  DoctypeClose,
  OpenScriptTagEnd,
  OpenScriptTagStart,
  OpenStyleTagEnd,
  OpenStyleTagStart,
  OpenTagEnd,
  OpenTagStart,
  ScriptTag,
  ScriptTagContent,
  StyleTag,
  StyleTagContent,
  Tag,
  Text,
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
  [NodeTypes.Document]: (node: Document) => void;
  [NodeTypes.Attribute]: (node: Attribute) => void;
  [NodeTypes.AttributeKey]: (node: AttributeKey) => void;
  [NodeTypes.AttributeValue]: (node: AttributeValue) => void;
  [NodeTypes.AttributeValueWrapperEnd]: (
    node: AttributeValueWrapperEnd
  ) => void;
  [NodeTypes.AttributeValueWrapperStart]: (
    node: AttributeValueWrapperStart
  ) => void;
  [NodeTypes.CloseScriptTag]: (node: CloseScriptTag) => void;
  [NodeTypes.CloseStyleTag]: (node: CloseStyleTag) => void;
  [NodeTypes.CloseTag]: (node: CloseTag) => void;
  [NodeTypes.Comment]: (node: Comment) => void;
  [NodeTypes.CommentContent]: (node: CommentContent) => void;
  [NodeTypes.CommentOpen]: (node: CommentOpen) => void;
  [NodeTypes.CommentClose]: (node: CommentClose) => void;
  [NodeTypes.Doctype]: (node: Doctype) => void;
  [NodeTypes.DoctypeAttribute]: (node: DoctypeAttribute) => void;
  [NodeTypes.DoctypeAttributeValue]: (node: DoctypeAttributeValue) => void;
  [NodeTypes.DoctypeAttributeWrapperEnd]: (
    node: DoctypeAttributeWrapperEnd
  ) => void;
  [NodeTypes.DoctypeAttributeWrapperStart]: (
    node: DoctypeAttributeWrapperStart
  ) => void;
  [NodeTypes.DoctypeOpen]: (node: DoctypeOpen) => void;
  [NodeTypes.DoctypeClose]: (node: DoctypeClose) => void;
  [NodeTypes.OpenScriptTagEnd]: (node: OpenScriptTagEnd) => void;
  [NodeTypes.OpenScriptTagStart]: (node: OpenScriptTagStart) => void;
  [NodeTypes.OpenStyleTagEnd]: (node: OpenStyleTagEnd) => void;
  [NodeTypes.OpenStyleTagStart]: (node: OpenStyleTagStart) => void;
  [NodeTypes.OpenTagEnd]: (node: OpenTagEnd) => void;
  [NodeTypes.OpenTagStart]: (node: OpenTagStart) => void;
  [NodeTypes.ScriptTag]: (node: ScriptTag) => void;
  [NodeTypes.ScriptTagContent]: (node: ScriptTagContent) => void;
  [NodeTypes.StyleTag]: (node: StyleTag) => void;
  [NodeTypes.StyleTagContent]: (node: StyleTagContent) => void;
  [NodeTypes.Tag]: (node: Tag) => void;
  [NodeTypes.Text]: (node: Text) => void;
}>;
