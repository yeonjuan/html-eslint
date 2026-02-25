import eslint from "eslint";

/**
 * Angular template AST node types from @angular-eslint/template-parser Based on
 *
 * @angular/compiler template AST
 */

export interface AngularSourceSpan {
  start: { offset: number; line: number; col: number };
  end: { offset: number; line: number; col: number };
  fullStart?: { offset: number; line: number; col: number };
  details?: string | null;
  toString(): string;
}

export interface AngularNode {
  type: string;
  loc?: eslint.AST.SourceLocation;
  range?: [number, number];
  parent?: AngularNode;
}

export interface AngularTextAttribute extends AngularNode {
  type: "TextAttribute";
  name: string;
  value: string;
  keySpan?: AngularSourceSpan;
  valueSpan?: AngularSourceSpan;
}

export interface AngularBoundAttribute extends AngularNode {
  type: "BoundAttribute";
  name: string;
  value: unknown;
  keySpan?: AngularSourceSpan;
  valueSpan?: AngularSourceSpan;
}

export interface AngularElement extends AngularNode {
  type: "Element$1";
  name: string;
  attributes: AngularTextAttribute[];
  inputs: AngularBoundAttribute[];
  outputs: AngularBoundEvent[];
  children: AngularNode[];
  references: AngularNode[];
}

export interface AngularBoundEvent extends AngularNode {
  type: "BoundEvent";
  name: string;
}

export type RuleFunction<T extends AngularNode = never> = (node: T) => void;

type RuleListenerExitSelectors = {
  [K in keyof RuleListenerBaseSelectors as `${K}:exit`]: RuleListenerBaseSelectors[K];
};

interface RuleListenerBaseSelectors {
  Element?: RuleFunction<AngularElement>;
  TextAttribute?: RuleFunction<AngularTextAttribute>;
  BoundAttribute?: RuleFunction<AngularBoundAttribute>;
  BoundEvent?: RuleFunction<AngularBoundEvent>;
  [key: string]: RuleFunction<any> | undefined;
}

export type RuleListener = RuleListenerBaseSelectors &
  RuleListenerExitSelectors;

interface RuleFix {
  range: eslint.AST.Range;
  text: string;
}

export interface RuleFixer {
  insertTextAfter(nodeOrToken: AngularNode, text: string): RuleFix;
  insertTextAfterRange(range: eslint.AST.Range, text: string): RuleFix;
  insertTextBefore(nodeOrToken: AngularNode, text: string): RuleFix;
  insertTextBeforeRange(range: eslint.AST.Range, text: string): RuleFix;
  remove(nodeOrToken: AngularNode): RuleFix;
  removeRange(range: eslint.AST.Range): RuleFix;
  replaceText(nodeOrToken: AngularNode, text: string): RuleFix;
  replaceTextRange(range: eslint.AST.Range, text: string): RuleFix;
}

export type ReportFixFunction = (
  fixer: RuleFixer
) => IterableIterator<RuleFix> | readonly RuleFix[] | RuleFix | null;

interface ReportDescriptorOptionsBase {
  data?: { [key: string]: string };
  fix?: null | ReportFixFunction;
}

type ReportDescriptor = ReportDescriptorMessage &
  ReportDescriptorLocation &
  ReportDescriptorOptionsBase;
type ReportDescriptorMessage = { message: string } | { messageId: string };
type ReportDescriptorLocation = {
  node?: AngularNode;
  loc?: eslint.AST.SourceLocation;
  line?: number;
  column?: number;
};

export interface Context<Options extends unknown[]> extends Omit<
  eslint.Rule.RuleContext,
  "report"
> {
  report(descriptor: ReportDescriptor): void;
  options: Options;
}

export interface RuleModule<Options extends unknown[]> {
  create(context: Context<Options>): RuleListener;
  meta: eslint.Rule.RuleMetaData;
}
