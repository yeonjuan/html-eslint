/** https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/utils/src/ts-eslint/Rule.ts */
import { TSESTree } from "@typescript-eslint/types";
import eslint from "eslint";

export type RuleFunction<T extends TSESTree.NodeOrTokenData = never> = (
  node: T
) => void;

type RuleListenerExitSelectors = {
  [K in keyof RuleListenerBaseSelectors as `${K}:exit`]: RuleListenerBaseSelectors[K];
};
interface RuleListenerBaseSelectors {
  AccessorProperty?: RuleFunction<TSESTree.AccessorProperty>;
  ArrayExpression?: RuleFunction<TSESTree.ArrayExpression>;
  ArrayPattern?: RuleFunction<TSESTree.ArrayPattern>;
  ArrowFunctionExpression?: RuleFunction<TSESTree.ArrowFunctionExpression>;
  AssignmentExpression?: RuleFunction<TSESTree.AssignmentExpression>;
  AssignmentPattern?: RuleFunction<TSESTree.AssignmentPattern>;
  AwaitExpression?: RuleFunction<TSESTree.AwaitExpression>;
  BinaryExpression?: RuleFunction<TSESTree.BinaryExpression>;
  BlockStatement?: RuleFunction<TSESTree.BlockStatement>;
  BreakStatement?: RuleFunction<TSESTree.BreakStatement>;
  CallExpression?: RuleFunction<TSESTree.CallExpression>;
  CatchClause?: RuleFunction<TSESTree.CatchClause>;
  ChainExpression?: RuleFunction<TSESTree.ChainExpression>;
  ClassBody?: RuleFunction<TSESTree.ClassBody>;
  ClassDeclaration?: RuleFunction<TSESTree.ClassDeclaration>;
  ClassExpression?: RuleFunction<TSESTree.ClassExpression>;
  ConditionalExpression?: RuleFunction<TSESTree.ConditionalExpression>;
  ContinueStatement?: RuleFunction<TSESTree.ContinueStatement>;
  DebuggerStatement?: RuleFunction<TSESTree.DebuggerStatement>;
  Decorator?: RuleFunction<TSESTree.Decorator>;
  DoWhileStatement?: RuleFunction<TSESTree.DoWhileStatement>;
  EmptyStatement?: RuleFunction<TSESTree.EmptyStatement>;
  ExportAllDeclaration?: RuleFunction<TSESTree.ExportAllDeclaration>;
  ExportDefaultDeclaration?: RuleFunction<TSESTree.ExportDefaultDeclaration>;
  ExportNamedDeclaration?: RuleFunction<TSESTree.ExportNamedDeclaration>;
  ExportSpecifier?: RuleFunction<TSESTree.ExportSpecifier>;
  ExpressionStatement?: RuleFunction<TSESTree.ExpressionStatement>;
  ForInStatement?: RuleFunction<TSESTree.ForInStatement>;
  ForOfStatement?: RuleFunction<TSESTree.ForOfStatement>;
  ForStatement?: RuleFunction<TSESTree.ForStatement>;
  FunctionDeclaration?: RuleFunction<TSESTree.FunctionDeclaration>;
  FunctionExpression?: RuleFunction<TSESTree.FunctionExpression>;
  Identifier?: RuleFunction<TSESTree.Identifier>;
  IfStatement?: RuleFunction<TSESTree.IfStatement>;
  ImportAttribute?: RuleFunction<TSESTree.ImportAttribute>;
  ImportDeclaration?: RuleFunction<TSESTree.ImportDeclaration>;
  ImportDefaultSpecifier?: RuleFunction<TSESTree.ImportDefaultSpecifier>;
  ImportExpression?: RuleFunction<TSESTree.ImportExpression>;
  ImportNamespaceSpecifier?: RuleFunction<TSESTree.ImportNamespaceSpecifier>;
  ImportSpecifier?: RuleFunction<TSESTree.ImportSpecifier>;
  JSXAttribute?: RuleFunction<TSESTree.JSXAttribute>;
  JSXClosingElement?: RuleFunction<TSESTree.JSXClosingElement>;
  JSXClosingFragment?: RuleFunction<TSESTree.JSXClosingFragment>;
  JSXElement?: RuleFunction<TSESTree.JSXElement>;
  JSXEmptyExpression?: RuleFunction<TSESTree.JSXEmptyExpression>;
  JSXExpressionContainer?: RuleFunction<TSESTree.JSXExpressionContainer>;
  JSXFragment?: RuleFunction<TSESTree.JSXFragment>;
  JSXIdentifier?: RuleFunction<TSESTree.JSXIdentifier>;
  JSXMemberExpression?: RuleFunction<TSESTree.JSXMemberExpression>;
  JSXNamespacedName?: RuleFunction<TSESTree.JSXNamespacedName>;
  JSXOpeningElement?: RuleFunction<TSESTree.JSXOpeningElement>;
  JSXOpeningFragment?: RuleFunction<TSESTree.JSXOpeningFragment>;
  JSXSpreadAttribute?: RuleFunction<TSESTree.JSXSpreadAttribute>;
  JSXSpreadChild?: RuleFunction<TSESTree.JSXSpreadChild>;
  JSXText?: RuleFunction<TSESTree.JSXText>;
  LabeledStatement?: RuleFunction<TSESTree.LabeledStatement>;
  Literal?: RuleFunction<TSESTree.Literal>;
  LogicalExpression?: RuleFunction<TSESTree.LogicalExpression>;
  MemberExpression?: RuleFunction<TSESTree.MemberExpression>;
  MetaProperty?: RuleFunction<TSESTree.MetaProperty>;
  MethodDefinition?: RuleFunction<TSESTree.MethodDefinition>;
  NewExpression?: RuleFunction<TSESTree.NewExpression>;
  ObjectExpression?: RuleFunction<TSESTree.ObjectExpression>;
  ObjectPattern?: RuleFunction<TSESTree.ObjectPattern>;
  PrivateIdentifier?: RuleFunction<TSESTree.PrivateIdentifier>;
  Program?: RuleFunction<TSESTree.Program>;
  Property?: RuleFunction<TSESTree.Property>;
  PropertyDefinition?: RuleFunction<TSESTree.PropertyDefinition>;
  RestElement?: RuleFunction<TSESTree.RestElement>;
  ReturnStatement?: RuleFunction<TSESTree.ReturnStatement>;
  SequenceExpression?: RuleFunction<TSESTree.SequenceExpression>;
  SpreadElement?: RuleFunction<TSESTree.SpreadElement>;
  StaticBlock?: RuleFunction<TSESTree.StaticBlock>;
  Super?: RuleFunction<TSESTree.Super>;
  SwitchCase?: RuleFunction<TSESTree.SwitchCase>;
  SwitchStatement?: RuleFunction<TSESTree.SwitchStatement>;
  TaggedTemplateExpression?: RuleFunction<TSESTree.TaggedTemplateExpression>;
  TemplateElement?: RuleFunction<TSESTree.TemplateElement>;
  TemplateLiteral?: RuleFunction<TSESTree.TemplateLiteral>;
  ThisExpression?: RuleFunction<TSESTree.ThisExpression>;
  ThrowStatement?: RuleFunction<TSESTree.ThrowStatement>;
  TryStatement?: RuleFunction<TSESTree.TryStatement>;
  UnaryExpression?: RuleFunction<TSESTree.UnaryExpression>;
  UpdateExpression?: RuleFunction<TSESTree.UpdateExpression>;
  VariableDeclaration?: RuleFunction<TSESTree.VariableDeclaration>;
  VariableDeclarator?: RuleFunction<TSESTree.VariableDeclarator>;
  WhileStatement?: RuleFunction<TSESTree.WhileStatement>;
  WithStatement?: RuleFunction<TSESTree.WithStatement>;
  YieldExpression?: RuleFunction<TSESTree.YieldExpression>;
}

export type RuleListener = RuleListenerBaseSelectors &
  RuleListenerExitSelectors;

interface RuleFix {
  range: eslint.AST.Range;
  text: string;
}

export interface RuleFixer {
  insertTextAfter(nodeOrToken: TSESTree.BaseNode, text: string): RuleFix;

  insertTextAfterRange(range: eslint.AST.Range, text: string): RuleFix;

  insertTextBefore(nodeOrToken: TSESTree.BaseNode, text: string): RuleFix;

  insertTextBeforeRange(range: eslint.AST.Range, text: string): RuleFix;

  remove(nodeOrToken: TSESTree.BaseNode): RuleFix;

  removeRange(range: eslint.AST.Range): RuleFix;

  replaceText(nodeOrToken: TSESTree.BaseNode, text: string): RuleFix;

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
  node?: TSESTree.BaseNode;
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
