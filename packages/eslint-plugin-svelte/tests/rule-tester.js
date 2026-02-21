/** Rule tester for @html-eslint/eslint-plugin-svelte */

import { RuleTester as ESLintRuleTester } from "eslint";

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
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
  });
}
