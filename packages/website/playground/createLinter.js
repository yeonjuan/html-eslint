import ESLinter from "../node_modules/eslint/lib/linter/linter";
import parser from "@html-eslint/parser";
import plugin from "@html-eslint/plugin";
import { SCOPE } from "./constants";

const PARSER_NAME = `${SCOPE}/parser`;

const createLinter = () => {
  const linter = new ESLinter.Linter();
  const allRules = Object.entries(plugin.rules).reduce(
    (rules, [name, rule]) => ({
      ...rules,
      [`${SCOPE}/${name}`]: rule,
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
    lint(code, rules) {
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

export default createLinter;
