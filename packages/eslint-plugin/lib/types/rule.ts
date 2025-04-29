import eslint from "eslint";
import * as AST from "@html-eslint/types";
import * as estree from "estree";
import { Line } from "./ast";

type AnyNodeAndLine = AST.AnyNode | Line;

type PostFix<T, S extends string> = {
  [K in keyof T as `${K & string}${S}`]: T[K];
};

interface BaseRuleListener {
  Document?: (node: AST.Document) => void;
  AttributeKey?: (node: AST.AttributeKey) => void;
  Text?: (node: AST.Text) => void;
  Tag?: (node: AST.Tag) => void;
  OpenTagStart?: (node: AST.OpenTagStart) => void;
  OpenTagEnd?: (node: AST.OpenTagEnd) => void;
  CloseTag?: (node: AST.CloseTag) => void;
  Attribute?: (node: AST.Attribute) => void;
  AttributeValue?: (node: AST.AttributeValue) => void;
  AttributeValueWrapperEnd?: (node: AST.AttributeValueWrapperEnd) => void;
  AttributeValueWrapperStart?: (node: AST.AttributeValueWrapperStart) => void;
  ScriptTag?: (node: AST.ScriptTag) => void;
  OpenScriptTagStart?: (node: AST.OpenScriptTagStart) => void;
  CloseScriptTag?: (node: AST.CloseScriptTag) => void;
  OpenScriptTagEnd?: (node: AST.OpenScriptTagEnd) => void;
  ScriptTagContent?: (node: AST.ScriptTagContent) => void;
  StyleTag?: (node: AST.StyleTag) => void;
  OpenStyleTagStart?: (node: AST.OpenStyleTagStart) => void;
  OpenStyleTagEnd?: (node: AST.OpenStyleTagEnd) => void;
  StyleTagContent?: (node: AST.StyleTagContent) => void;
  CloseStyleTag?: (node: AST.CloseStyleTag) => void;
  Comment?: (node: AST.Comment) => void;
  CommentOpen?: (node: AST.CommentOpen) => void;
  CommentClose?: (node: AST.CommentClose) => void;
  CommentContent?: (node: AST.CommentContent) => void;
  Doctype?: (node: AST.Doctype) => void;
  DoctypeOpen?: (node: AST.DoctypeOpen) => void;
  DoctypeClose?: (node: AST.DoctypeClose) => void;
  DoctypeAttribute?: (node: AST.DoctypeAttribute) => void;
  DoctypeAttributeValue?: (node: AST.DoctypeAttributeValue) => void;
  DoctypeAttributeWrapperStart?: (
    node: AST.DoctypeAttributeWrapperStart
  ) => void;
  DoctypeAttributeWrapperEnd?: (node: AST.DoctypeAttributeWrapperEnd) => void;
  TaggedTemplateExpression?: (node: AST.TaggedTemplateExpression) => void;
  TemplateLiteral?: (node: AST.TemplateLiteral) => void;
}

interface RuleFix {
  range: eslint.AST.Range;
  text: string;
}

export interface RuleFixer {
  insertTextAfter(nodeOrToken: AnyNodeAndLine, text: string): RuleFix;

  insertTextAfterRange(range: eslint.AST.Range, text: string): RuleFix;

  insertTextBefore(nodeOrToken: AnyNodeAndLine, text: string): RuleFix;

  insertTextBeforeRange(range: eslint.AST.Range, text: string): RuleFix;

  remove(nodeOrToken: AnyNodeAndLine): RuleFix;

  removeRange(range: eslint.AST.Range): RuleFix;

  replaceText(nodeOrToken: AnyNodeAndLine, text: string): RuleFix;

  replaceTextRange(range: eslint.AST.Range, text: string): RuleFix;
}

export type ReportFixFunction = (
  fixer: RuleFixer
) => IterableIterator<RuleFix> | readonly RuleFix[] | RuleFix | null;

interface ReportDescriptorOptionsBase {
  data?: { [key: string]: string };
  fix?: null | ReportFixFunction;
}

type SuggestionDescriptorMessage = { messageId: string };
export type SuggestionReportDescriptor = SuggestionDescriptorMessage &
  ReportDescriptorOptionsBase;

interface ReportDescriptorOptions extends ReportDescriptorOptionsBase {
  suggest?: SuggestionReportDescriptor[] | null;
}

type ReportDescriptor = ReportDescriptorMessage &
  ReportDescriptorLocation &
  ReportDescriptorOptions;
type ReportDescriptorMessage = { message: string } | { messageId: string };
type ReportDescriptorLocation = {
  node?: estree.BaseNode;
  loc?: eslint.AST.SourceLocation;
  line?: number;
  column?: number;
};

export interface Context<Options extends unknown[]>
  extends Omit<eslint.Rule.RuleContext, "report"> {
  report(descriptor: ReportDescriptor): void;
  options: Options;
}

export type RuleListener = BaseRuleListener &
  PostFix<BaseRuleListener, ":exit">;

export interface RuleModule<Options extends unknown[]> {
  create(context: Context<Options>): RuleListener;
  meta: eslint.Rule.RuleMetaData;
}
