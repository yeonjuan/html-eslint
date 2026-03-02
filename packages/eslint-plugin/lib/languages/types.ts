import { HTMLComment, HTMLProgram, ParserOptions } from "@html-eslint/parser";
import { AnyHTMLNode, AnyToken } from "@html-eslint/types";

export type SourceCodeOptions = {
  LangOptions: ParserOptions;
  RootNode: HTMLProgram;
  SyntaxElementWithLoc: AnyHTMLNode;
  ConfigNode: HTMLComment;
};

export type TokenOrHTMLComment = AnyToken | HTMLComment;
