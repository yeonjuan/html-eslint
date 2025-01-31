export type TemplateSyntaxParserConfig = {
  skipRanges?: [number, number][];
  syntax: Record<string, string>;
};

export type TemplateSyntax = {
  open: string;
  close: string;
  range: Range;
};

export type OpenSyntax = {
  type: "open";
  value: string;
  range: Range;
};

export type CloseSyntax = {
  type: "close";
  value: string;
  range: Range;
};

export type TemplateSyntaxParserResult = {
  syntax: TemplateSyntax[];
};

export type Range = [number, number];
