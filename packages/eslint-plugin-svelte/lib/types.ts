/** Type definitions for @html-eslint/eslint-plugin-svelte */
import type { TSESTree } from "@typescript-eslint/types";
import eslint from "eslint";
import { AST } from "svelte-eslint-parser";

/** Utility type to convert node type enum to string literal */
type NodeWithStringType<T extends TSESTree.Node> = Omit<T, "type"> & {
  type: `${T["type"]}`;
};
export type NodeOrToken = TSESTree.NodeOrTokenData;
export type SvelteAttribute = AST.SvelteAttribute;
export type SvelteLiteral = AST.SvelteLiteral;
export type SvelteElement = AST.SvelteElement;
export type SvelteScriptElement = AST.SvelteScriptElement;
export type SvelteStyleElement = AST.SvelteStyleElement;
export type ArrayExpression = NodeWithStringType<TSESTree.ArrayExpression>;

export type Node = AST.SvelteNode | TSESTree.Node;

export interface RuleModule {
  meta: eslint.Rule.RuleMetaData;
  create: (context: eslint.Rule.RuleContext) => RuleListener;
}
export type RuleListener = RuleListenerBaseSelectors &
  RuleListenerExitSelectors;

export type RuleFunction<T extends AST.SvelteNode | NodeOrToken = never> = (
  node: T
) => void;

type RuleListenerExitSelectors = {
  [K in keyof RuleListenerBaseSelectors as `${K}:exit`]: RuleListenerBaseSelectors[K];
};

interface RuleListenerBaseSelectors {
  SvelteAttribute?: RuleFunction<SvelteAttribute>;
  ArrayExpression?: RuleFunction<ArrayExpression>;
  SvelteElement?: RuleFunction<SvelteElement>;
  SvelteScriptElement?: RuleFunction<SvelteScriptElement>;
  SvelteStyleElement?: RuleFunction<SvelteStyleElement>;
}
