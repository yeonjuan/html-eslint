import ESTree from "estree";
import ESLint from "eslint";
import * as ESHtml from "es-html-parser";

type Fix = ESLint.Rule.Fix;
type Token = ESLint.AST.Token;

export type AnyNode = ESHtml.AnyNode | LineNode;

export type Range = ESLint.AST.Range;

export type Location = ESLint.AST.SourceLocation;

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

export interface AttributeKeyNode extends ESHtml.AttributeKeyNode {
  parent: AttributeNode;
}

export interface TextNode extends ESHtml.TextNode {
  parent: TagNode;
}

export interface TagNode extends ESHtml.TagNode {
  parent: TagNode | ProgramNode;
  openStart: OpenTagStartNode;
  close: CloseTagNode;
  children: Array<
    TextNode | TagNode | ScriptTagNode | StyleTagNode | CommentNode
  >;
}

export interface OpenTagStartNode extends ESHtml.OpenTagStartNode {
  parent: TagNode;
}

export interface OpenTagEndNode extends ESHtml.OpenTagEndNode {
  parent: TagNode;
}

export interface CloseTagNode extends ESHtml.CloseTagNode {
  parent: TagNode;
}

export interface AttributeNode extends ESHtml.AttributeNode {
  parent: TagNode;
}

export interface AttributeValueNode extends ESHtml.AttributeValueNode {
  parent: AttributeNode;
}

export interface AttributeValueWrapperEndNode
  extends ESHtml.AttributeValueWrapperEndNode {
  parent: AttributeNode;
}

export interface AttributeValueWrapperStartNode
  extends ESHtml.AttributeValueWrapperStartNode {
  parent: AttributeNode;
}

export interface ScriptTagNode extends ESHtml.ScriptTagNode {
  parent: ProgramNode | TagNode;
}

export interface OpenScriptTagStartNode extends ESHtml.OpenScriptTagStartNode {
  parent: ScriptTagNode;
}

export interface CloseScriptTagNode extends ESHtml.CloseScriptTagNode {
  parent: ScriptTagNode;
}

export interface OpenScriptTagEndNode extends ESHtml.OpenScriptTagEndNode {
  parent: ScriptTagNode;
}

export interface ScriptTagContentNode extends ESHtml.ScriptTagContentNode {
  parent: ScriptTagNode;
}

export interface StyleTagNode extends ESHtml.StyleTagNode {
  parent: TagNode | ProgramNode;
}

export interface OpenStyleTagStartNode extends ESHtml.OpenStyleTagStartNode {
  parent: StyleTagNode;
}

export interface OpenStyleTagEndNode extends ESHtml.OpenStyleTagEndNode {
  parent: StyleTagNode;
}

export interface StyleTagContentNode extends ESHtml.StyleTagContentNode {
  parent: StyleTagNode;
}

export interface CloseStyleTagNode extends ESHtml.CloseStyleTagNode {
  parent: StyleTagNode;
}

export interface CommentNode extends ESHtml.CommentNode {
  parent: ProgramNode | TagNode;
}

export interface CommentOpenNode extends ESHtml.CommentOpenNode {
  parent: CommentNode;
}

export interface CommentCloseNode extends ESHtml.CommentCloseNode {
  parent: CommentNode;
}

export interface CommentContentNode extends ESHtml.CommentContentNode {
  parent: CommentNode;
}

export interface DoctypeNode extends ESHtml.DoctypeNode {
  parent: ProgramNode;
}

export interface DoctypeOpenNode extends ESHtml.DoctypeOpenNode {
  parent: DoctypeNode;
}

export interface DoctypeCloseNode extends ESHtml.DoctypeCloseNode {
  parent: DoctypeNode;
}

export interface DoctypeAttributeNode extends ESHtml.DoctypeAttributeNode {
  parent: DoctypeNode;
}

export interface DoctypeAttributeValueNode
  extends ESHtml.DoctypeAttributeValueNode {
  parent: DoctypeNode;
}

export interface DoctypeAttributeWrapperStart
  extends ESHtml.DoctypeAttributeWrapperStartNode {
  parent: DoctypeNode;
}

export interface DoctypeAttributeWrapperEnd
  extends ESHtml.DoctypeAttributeWrapperEndNode {
  parent: DoctypeNode;
}

export interface LineNode extends BaseNode {
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

export interface Rule {
  create(context: Context): RuleListener;
  meta?: ESLint.Rule.RuleMetaData;
}

interface RuleFixer {
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

export interface Context extends Omit<ESLint.Rule.RuleContext, "report"> {
  report(descriptor: ReportDescriptor): void;
}
