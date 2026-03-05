import type {
  HTMLComment,
  HTMLProgram,
  ParserOptions,
} from "@html-eslint/parser";
import type { AnyHTMLNode, AnyToken } from "@html-eslint/types";

export type SourceCodeOptions = {
  LangOptions: ParserOptions;
  RootNode: HTMLProgram;
  SyntaxElementWithLoc: AnyHTMLNode;
  ConfigNode: HTMLComment;
};

export type TokenOrHTMLComment = AnyToken | HTMLComment;
