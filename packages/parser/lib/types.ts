import type {
  AnyNode,
  DocumentNode,
  AnyToken,
  CommentContentNode,
} from "es-html-parser";

export interface ProgramNode {
  type: "Program";
  body: AnyHTMLNode[];
  loc: AnyNode["loc"];
  range: AnyNode["range"];
  tokens: AnyToken[];
  comments: CommentContentNode[];
}

export type AnyHTMLNode = Exclude<AnyNode, DocumentNode> | ProgramNode;
