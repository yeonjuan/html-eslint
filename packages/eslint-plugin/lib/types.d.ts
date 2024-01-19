import ESTree from "estree";
import ESLint from "eslint";
import * as ESHtml from "es-html-parser";

type Fix = ESLint.Rule.Fix;
type Token = ESLint.AST.Token;

type AnyNode = ESHtml.AnyNode | LineNode;

export type Range = ESLint.AST.Range;

type Location = ESLint.AST.SourceLocation;

export interface BaseNode {
  range: [number, number];
  loc: {
    start: ESTree.Position;
    end: ESTree.Position;
  };
}

export interface ProgramNode
  extends Omit<ESHtml.DocumentNode, "type" | "children"> {
  type: "Program";
  body: ESHtml.DocumentNode["children"];
}

interface AttributeKeyNode extends ESHtml.AttributeKeyNode {
  parent: AttributeNode;
}

interface TextNode extends ESHtml.TextNode {
  parent: TagNode;
}

export interface TagNode extends ESHtml.TagNode {
  attributes: AttributeNode[];
  parent: TagNode | ProgramNode;
  openStart: OpenTagStartNode;
  openEnd: OpenTagEndNode;
  close: CloseTagNode;
  children: Array<
    TextNode | TagNode | ScriptTagNode | StyleTagNode | CommentNode
  >;
}

interface OpenTagStartNode extends ESHtml.OpenTagStartNode {
  parent: TagNode;
}

interface OpenTagEndNode extends ESHtml.OpenTagEndNode {
  parent: TagNode;
}

interface CloseTagNode extends ESHtml.CloseTagNode {
  parent: TagNode;
}

interface AttributeNode extends ESHtml.AttributeNode {
  key: AttributeKeyNode;
  value?: AttributeValueNode;
  parent: TagNode | StyleTagNode | ScriptTagNode;
}

interface AttributeValueNode extends ESHtml.AttributeValueNode {
  parent: AttributeNode;
}

interface AttributeValueWrapperEndNode
  extends ESHtml.AttributeValueWrapperEndNode {
  parent: AttributeNode;
}

interface AttributeValueWrapperStartNode
  extends ESHtml.AttributeValueWrapperStartNode {
  parent: AttributeNode;
}

export interface ScriptTagNode extends ESHtml.ScriptTagNode {
  attributes: AttributeNode[];
  parent: ProgramNode | TagNode;
  openStart: OpenScriptTagStartNode;
  openEnd: OpenScriptTagEndNode;
}

interface OpenScriptTagStartNode extends ESHtml.OpenScriptTagStartNode {
  parent: ScriptTagNode;
}

interface CloseScriptTagNode extends ESHtml.CloseScriptTagNode {
  parent: ScriptTagNode;
}

interface OpenScriptTagEndNode extends ESHtml.OpenScriptTagEndNode {
  parent: ScriptTagNode;
}

interface ScriptTagContentNode extends ESHtml.ScriptTagContentNode {
  parent: ScriptTagNode;
}

export interface StyleTagNode extends ESHtml.StyleTagNode {
  attributes: AttributeNode[];
  parent: TagNode | ProgramNode;
  openStart: OpenStyleTagStartNode;
  openEnd: OpenStyleTagEndNode;
}

interface OpenStyleTagStartNode extends ESHtml.OpenStyleTagStartNode {
  parent: StyleTagNode;
}

interface OpenStyleTagEndNode extends ESHtml.OpenStyleTagEndNode {
  parent: StyleTagNode;
}

interface StyleTagContentNode extends ESHtml.StyleTagContentNode {
  parent: StyleTagNode;
}

interface CloseStyleTagNode extends ESHtml.CloseStyleTagNode {
  parent: StyleTagNode;
}

interface CommentNode extends ESHtml.CommentNode {
  parent: ProgramNode | TagNode;
}

interface CommentOpenNode extends ESHtml.CommentOpenNode {
  parent: CommentNode;
}

interface CommentCloseNode extends ESHtml.CommentCloseNode {
  parent: CommentNode;
}

interface CommentContentNode extends ESHtml.CommentContentNode {
  parent: CommentNode;
}

interface DoctypeNode extends ESHtml.DoctypeNode {
  parent: ProgramNode;
}

interface DoctypeOpenNode extends ESHtml.DoctypeOpenNode {
  parent: DoctypeNode;
}

interface DoctypeCloseNode extends ESHtml.DoctypeCloseNode {
  parent: DoctypeNode;
}

interface DoctypeAttributeNode extends ESHtml.DoctypeAttributeNode {
  parent: DoctypeNode;
}

interface DoctypeAttributeValueNode extends ESHtml.DoctypeAttributeValueNode {
  parent: DoctypeNode;
}

interface DoctypeAttributeWrapperStart
  extends ESHtml.DoctypeAttributeWrapperStartNode {
  parent: DoctypeNode;
}

interface DoctypeAttributeWrapperEnd
  extends ESHtml.DoctypeAttributeWrapperEndNode {
  parent: DoctypeNode;
}

interface LineNode extends BaseNode {
  type: "Line";
  value: string;
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
  CommentOpen?: (node: CommentOpenNode) => void;
  CommentClose?: (node: CommentCloseNode) => void;
  CommentContent?: (node: CommentContentNode) => void;
  Doctype?: (node: DoctypeNode) => void;
  DoctypeOpen: (node: DoctypeOpenNode) => void;
  DoctypeClose?: (node: DoctypeCloseNode) => void;
  DoctypeAttribute?: (node: DoctypeAttributeNode) => void;
  DoctypeAttributeValue?: (node: DoctypeAttributeValueNode) => void;
  DoctypeAttributeWrapperStart?: (node: DoctypeAttributeWrapperStart) => void;
  DoctypeAttributeWrapperEnd?: (node: DoctypeAttributeWrapperEnd) => void;
}

export interface RuleModule extends ESLint.Rule.RuleModule {
  create(context: Context): RuleListener;
  meta?: ESLint.Rule.RuleMetaData;
}

export interface RuleFixer {
  insertTextAfter(nodeOrToken: BaseNode | Token, text: string): Fix;

  insertTextAfterRange(range: Range, text: string): Fix;

  insertTextBefore(nodeOrToken: BaseNode | Token, text: string): Fix;

  insertTextBeforeRange(range: Range, text: string): Fix;

  remove(nodeOrToken: BaseNode | Token): Fix;

  removeRange(range: Range): Fix;

  replaceText(nodeOrToken: BaseNode | Token, text: string): Fix;

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

interface Context extends Omit<ESLint.Rule.RuleContext, "report"> {
  report(descriptor: ReportDescriptor): void;
}

export type ChildType<T extends BaseNode> = T extends ProgramNode
  ? T["body"][number]
  : T extends TagNode
  ? T["children"][number]
  : never;
