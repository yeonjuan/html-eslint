import parser from "@html-eslint/parser";
import plugin from "@html-eslint/eslint-plugin";
import { Linter } from "@html-eslint/web-linter";

const PARSER_NAME = "@html-eslint/parser";

export const createLinter = () => {
  const linter = new Linter();
  const allRules = Object.entries(plugin.rules).reduce(
    (rules, [name, rule]) => ({
      ...rules,
      [`@html-eslint/${name}`]: rule,
    }),
    {}
  );

  linter.defineParser(PARSER_NAME, {
    parseForESLint(code, options) {
      return parser.parseForESLint(code, options);
    },
  });
  linter.defineRules(allRules);
  return {
    lint(code: string, rules: Partial<Linter.RulesRecord>) {
      const messages = linter.verify(code, {
        parser: PARSER_NAME,
        rules,
      });
      const { output } = linter.verifyAndFix(code, {
        parser: PARSER_NAME,
        rules,
      });
      return { messages, output };
    },
  };
};
