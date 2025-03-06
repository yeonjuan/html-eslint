import type { AST } from "eslint";

export type TemplateSyntaxParserConfig = {
  skipRanges?: [number, number][];
  syntax: Record<string, string>;
};

export type TemplateSyntax = {
  open: AST.Range;
  close: AST.Range;
};

export type OpenSyntax = {
  type: "open";
  value: string;
  range: AST.Range;
};

export type CloseSyntax = {
  type: "close";
  value: string;
  range: AST.Range;
};

export type TemplateSyntaxParserResult = {
  syntax: TemplateSyntax[];
};
