import type { Range } from "@html-eslint/types";

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
  open: Range;
  close: Range;
};

export type OpenSyntax = {
  type: "open";
  value: string;
  range: Range;
  isComment?: boolean;
};

export type CloseSyntax = {
  type: "close";
  value: string;
  range: Range;
  isComment?: boolean;
};

export type TemplateSyntaxParserResult = {
  syntax: TemplateSyntax[];
};
