export type RuleCategory = {
  BEST_PRACTICE: "Best Practice";
  SEO: "SEO";
  ACCESSIBILITY: "Accessibility";
  STYLE: "Style";
};

export type NodeTypes = {
  PROGRAM: "Program";
  TEXT: "text";
  TITLE: "Title";
  PRE: "Pre";
  MENU: "Menu";
  OL: "Ol";
  UL: "Ul";
  SCRIPT: "Script";
  XMP: "Xmp";
  META: "Meta";
  STYLE: "Style";
};

interface BaseNode {
  start: number;
  end: number;
  range: [number, number];
  loc: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
  };
}

export interface HTMLNode extends BaseNode {
  childNodes?: HTMLNode[];
  startTag?: BaseNode;
  endTag?: BaseNode;
  type: string;
  attrs?: AttrNode[];
}

export interface AttrNode extends BaseNode {
  name: string;
  value: string;
}

export interface Context {
  getSourceCode(): SourceCode;
  report(descriptor: ReportDescriptor): void;
}

interface ReportDescriptorOptionsBase {
  data?: { [key: string]: string };

  fix?:
    | null
    | ((fixer: RuleFixer) => null | Fix | IterableIterator<Fix> | Fix[]);
}

type SuggestionDescriptorMessage = { desc: string } | { messageId: string };
type SuggestionReportDescriptor = SuggestionDescriptorMessage &
  ReportDescriptorOptionsBase;

interface ReportDescriptorOptions extends ReportDescriptorOptionsBase {
  suggest?: SuggestionReportDescriptor[] | null;
}

type ReportDescriptor = ReportDescriptorMessage &
  ReportDescriptorLocation &
  ReportDescriptorOptions;
type ReportDescriptorMessage = { message: string } | { messageId: string };
type ReportDescriptorLocation =
  | { node: ESTree.Node }
  | { loc: AST.SourceLocation | { line: number; column: number } };

export interface SourceCode {
  lines: string[];
  getIndexFromLoc(location: Position): number;
}

export interface Position {
  line: number;
  column: number;
}
