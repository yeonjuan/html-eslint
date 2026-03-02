import { HTMLComment, HTMLProgram, ParserOptions } from "@html-eslint/parser";
import { AnyHTMLNode } from "@html-eslint/types";

export type SourceCodeOptions = {
  LangOptions: ParserOptions;
  RootNode: HTMLProgram;
  SyntaxElementWithLoc: AnyHTMLNode;
  ConfigNode: HTMLComment;
};
