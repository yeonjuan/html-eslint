export type TemplateSyntaxParserConfig = {
  skipRanges?: [number, number][];
  syntax: Record<string, string>;
};

export type TemplateSyntax = {
  open: Range;
  close: Range;
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
