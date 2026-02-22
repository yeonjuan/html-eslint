/** Type definitions for @html-eslint/eslint-plugin-svelte */

import type { Rule } from "eslint";
import { AST } from "svelte-eslint-parser";

export type SvelteAttribute = AST.SvelteAttribute;
export type SvelteLiteral = AST.SvelteLiteral;

export interface RuleModule {
  meta: Rule.RuleMetaData & {
    docs?: {
      description?: string;
      recommended?: boolean;
      category?: string;
      url?: string;
    };
  };
  create: (context: Rule.RuleContext) => RuleListener;
}
export type RuleListener = RuleListenerBaseSelectors &
  RuleListenerExitSelectors;

export type RuleFunction<T extends AST.SvelteNode = never> = (node: T) => void;

type RuleListenerExitSelectors = {
  [K in keyof RuleListenerBaseSelectors as `${K}:exit`]: RuleListenerBaseSelectors[K];
};

interface RuleListenerBaseSelectors {
  SvelteAttribute?: RuleFunction<SvelteAttribute>;
}
