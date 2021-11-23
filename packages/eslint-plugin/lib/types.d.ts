import ESTree from "estree";
import ESLint from "eslint";

type Fix = ESLint.Rule.Fix;
type Token = ESLint.AST.Token;
export type Range = ESLint.AST.Range;

interface RuleListener {
  [key: string]: (node: ElementNode) => void;
}

export interface Rule {
  create(context: Context): RuleListener;
  meta?: ESLint.Rule.RuleMetaData;
}

interface RuleFixer {
  insertTextAfter(nodeOrToken: AnyNode | Token, text: string): Fix;

  insertTextAfterRange(range: Range, text: string): Fix;

  insertTextBefore(nodeOrToken: AnyNode | Token, text: string): Fix;

  insertTextBeforeRange(range: Range, text: string): Fix;

  remove(nodeOrToken: AnyNode | Token): Fix;

  removeRange(range: Range): Fix;

  replaceText(nodeOrToken: AnyNode | Token, text: string): Fix;

  replaceTextRange(range: Range, text: string): Fix;
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
type ReportDescriptorLocation = {
  node?: BaseNode;
  loc?: ESLint.AST.SourceLocation;
  line?: number;
  column?: number;
};

export interface Context extends Omit<ESLint.Rule.RuleContext, "report"> {
  report(descriptor: ReportDescriptor): void;
}

export interface BaseNode {
  parent?: null | AnyNode;
  range: [number, number];
  start: number;
  end: number;
  loc: {
    start: ESTree.Position;
    end: ESTree.Position;
  };
  type?: string;
}

export interface TagNode extends BaseNode {
  type: undefined;
}

export interface TextLineNode extends BaseNode {
  textLine: string;
}

export interface TextNode extends BaseNode {
  type: "text";
  value: string;
  lineNodes: TextLineNode[];
}

export interface ElementNode extends BaseNode {
  type: string;
  tagName: string;
  attrs: AttrNode[];
  childNodes: ElementNode[];
  startTag?: TagNode;
  endTag?: TagNode;
  namespaceURI?: string;
}

export interface AttrNode extends BaseNode {
  name: string;
  value: string;
}

export interface CommentNode extends BaseNode {
  type: "comment";
  value: string;
  startTag?: TagNode;
  endTag?: TagNode;
  lineNodes: TextLineNode[];
}

export type AnyNode =
  | AttrNode
  | ElementNode
  | TextNode
  | TextLineNode
  | TagNode
  | CommentNode;
