import ESTree from "estree";
import ESLint from "eslint";
import {
  AnyNode,
  AttributeKeyNode,
  DocumentNode,
  TagNode,
  TextNode,
  OpenTagStartNode,
  OpenTagEndNode,
  CloseTagNode,
  AttributeNode,
  AttributeValueNode,
  AttributeValueWrapperEndNode,
  AttributeValueWrapperStartNode,
  ScriptTagNode,
  OpenScriptTagStartNode,
  CloseScriptTagNode,
  OpenScriptTagEndNode,
  ScriptTagContentNode,
  StyleTagNode,
  OpenStyleTagStartNode,
  OpenStyleTagEndNode,
  StyleTagContentNode,
  CloseStyleTagNode,
  CommentNode,
  CommentStartNode,
  CommentEndNode,
  CommentContentNode,
  DoctypeNode,
  DoctypeStartNode,
  DoctypeEndNode,
  DoctypeAttributeNode,
  DoctypeAttributeValueNode,
  DoctypeAttributeWrapperStart,
  DoctypeAttributeWrapperEnd,
} from "es-html-parser";

export { AnyNode };

type Fix = ESLint.Rule.Fix;
type Token = ESLint.AST.Token;

export type Range = ESLint.AST.Range;

export interface BaseNode {
  parent?: null | AnyNode;
  range: [number, number];
  loc: {
    start: ESTree.Position;
    end: ESTree.Position;
  };
  type?: string;
}

interface ProgramNode extends Omit<DocumentNode, "type"> {
  type: "Program";
}

interface RuleListener {
  Program?: (node: ProgramNode) => void;
  AttributeKey?: (node: AttributeKeyNode) => void;
  Text?: (node: TextNode) => void;
  Tag?: (node: TagNode) => void;
  OpenTagStart?: (node: OpenTagStartNode) => void;
  OpenTagEnd?: (node: OpenTagEndNode) => void;
  CloseTag?: (node: CloseTagNode) => void;
  Attribute?: (node: AttributeNode) => void;
  AttributeValue?: (node: AttributeValueNode) => void;
  AttributeValueWrapperEnd?: (node: AttributeValueWrapperEndNode) => void;
  AttributeValueWrapperStart?: (node: AttributeValueWrapperStartNode) => void;
  ScriptTag?: (node: ScriptTagNode) => void;
  OpenScriptTagStart?: (node: OpenScriptTagStartNode) => void;
  CloseScriptTag?: (node: CloseScriptTagNode) => void;
  OpenScriptTagEnd?: (node: OpenScriptTagEndNode) => void;
  ScriptTagContent?: (node: ScriptTagContentNode) => void;
  StyleTag?: (node: StyleTagNode) => void;
  OpenStyleTagStart?: (node: OpenStyleTagStartNode) => void;
  OpenStyleTagEnd?: (node: OpenStyleTagEndNode) => void;
  StyleTagContent?: (node: StyleTagContentNode) => void;
  CloseStyleTag?: (node: CloseStyleTagNode) => void;
  Comment?: (node: CommentNode) => void;
  CommentStart?: (node: CommentStartNode) => void;
  CommentEnd?: (node: CommentEndNode) => void;
  CommentContent?: (node: CommentContentNode) => void;
  Doctype?: (node: DoctypeNode) => void;
  DoctypeStart?: (node: DoctypeStartNode) => void;
  DoctypeEnd?: (node: DoctypeEndNode) => void;
  DoctypeAttribute?: (node: DoctypeAttributeNode) => void;
  DoctypeAttributeValue?: (node: DoctypeAttributeValueNode) => void;
  DoctypeAttributeWrapperStart?: (node: DoctypeAttributeWrapperStart) => void;
  DoctypeAttributeWrapperEnd?: (node: DoctypeAttributeWrapperEnd) => void;
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
