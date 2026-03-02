import type { SyntaxConfig } from "@html-eslint/template-syntax-parser";
import type {
  AnyHTMLNode,
  AnyToken,
  CommentContent,
  Range,
  SourceLocation,
} from "@html-eslint/types";

export type ParserOptions = {
  templateEngineSyntax?: SyntaxConfig;
  frontmatter?: boolean;
  rawContentTags?: string[];
};

export type HTMLComment = Omit<CommentContent, "parts" | "parent">;

export type HTMLProgram = {
  type: "Program";
  body: AnyHTMLNode[];
  loc: SourceLocation;
  range: Range;
  tokens: AnyToken[];
  comments: HTMLComment[];
};
