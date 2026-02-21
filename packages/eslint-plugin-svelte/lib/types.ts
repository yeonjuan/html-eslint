/** Type definitions for @html-eslint/eslint-plugin-svelte */

import type { Rule } from "eslint";

export type RuleModule<T extends readonly unknown[] = []> = Rule.RuleModule & {
  meta: Rule.RuleMetaData & {
    docs?: {
      description?: string;
      recommended?: boolean;
      category?: string;
      url?: string;
    };
  };
  create: (context: Rule.RuleContext) => Rule.RuleListener;
};
