/** Rule tester for @html-eslint/eslint-plugin-svelte */

import { RuleTester as ESLintRuleTester } from "eslint";
import * as svelteParser from "svelte-eslint-parser";

class RuleTester extends ESLintRuleTester {
  constructor(options) {
    super(options);
  }

  run(name, rule, tests) {
    super.run(name, rule, tests);
  }
}

export default function createRuleTester() {
  return new RuleTester({
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
  });
}
