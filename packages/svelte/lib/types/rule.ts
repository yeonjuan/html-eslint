import { AST } from "svelte-eslint-parser";
import eslint from "eslint";
import * as estree from "estree";

export interface SvelteRuleListener {
  SvelteAttribute?: (node: AST.SvelteAttribute) => void;
  SvelteElement?: (node: AST.SvelteElement) => void;
}

interface RuleFix {
  range: eslint.AST.Range;
  text: string;
}

export interface RuleFixer {
  insertTextAfter(nodeOrToken: AST.SvelteNode, text: string): RuleFix;

  insertTextAfterRange(range: eslint.AST.Range, text: string): RuleFix;

  insertTextBefore(nodeOrToken: AST.SvelteNode, text: string): RuleFix;

  insertTextBeforeRange(range: eslint.AST.Range, text: string): RuleFix;

  remove(nodeOrToken: AST.SvelteNode): RuleFix;

  removeRange(range: eslint.AST.Range): RuleFix;

  replaceText(nodeOrToken: AST.SvelteNode, text: string): RuleFix;

  replaceTextRange(range: eslint.AST.Range, text: string): RuleFix;
}

export type ReportFixFunction = (
  fixer: RuleFixer
) => IterableIterator<RuleFix> | readonly RuleFix[] | RuleFix | null;

type SuggestionDescriptorMessage = { messageId: string };
interface ReportDescriptorOptionsBase {
  data?: { [key: string]: string };
  fix?: null | ReportFixFunction;
}
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

export interface RuleModule<Options extends unknown[]> {
  create(context: Context<Options>): SvelteRuleListener;
  meta: eslint.Rule.RuleMetaData;
}
