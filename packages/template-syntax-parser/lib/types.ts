import type { AST } from "eslint";

export type SyntaxConfigItem = {
  open: string;
  close: string;
  isComment?: boolean;
};

export type SyntaxConfig = Record<string, string> | SyntaxConfigItem[];

export type TemplateSyntaxParserConfig = {
  skipRanges?: [number, number][];
  syntax: SyntaxConfig;
};

export type TemplateSyntax = {
  open: AST.Range;
  close: AST.Range;
};

export type OpenSyntax = {
  type: "open";
  value: string;
  range: AST.Range;
  isComment?: boolean;
};

export type CloseSyntax = {
  type: "close";
  value: string;
  range: AST.Range;
  isComment?: boolean;
};

export type TemplateSyntaxParserResult = {
  syntax: TemplateSyntax[];
};
