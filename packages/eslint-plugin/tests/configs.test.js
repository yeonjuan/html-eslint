const path = require("path");
const fs = require("fs");
const exportedRules = require("../lib/rules");

const RULES_DIR = path.resolve(__dirname, "../lib/rules");
const RULE_TESTS_DIR = path.resolve(__dirname, "./rules");
const RULE_DOCS_DIR = path.resolve(__dirname, "../../../docs/rules");
const RECOMMENDED_CONFIG = require("../lib/configs/recommended");

describe("rules", () => {
  const exportedRuleNames = Object.keys(exportedRules);

  test("all rules should be exported", () => {
    const files = fs.readdirSync(RULES_DIR);
    const ruleJsFilesWithoutExt = files
      .filter((file) => file.endsWith(".js"))
      .map((file) => file.replace(".js", ""))
      .filter((file) => file !== "index");

    expect(exportedRuleNames).toEqual(
      expect.arrayContaining(ruleJsFilesWithoutExt)
    );
  });

  test("all rules should have a corresponding test code", () => {
    const files = fs.readdirSync(RULE_TESTS_DIR);
    const ruleTestFilesWithoutExt = files
      .filter((file) => file.endsWith(".test.js"))
      .map((file) => file.replace(".test.js", ""));

    expect(exportedRuleNames).toEqual(
      expect.arrayContaining(ruleTestFilesWithoutExt)
    );
  });

  test("all rules should have a corresponding document", () => {
    const files = fs.readdirSync(RULE_DOCS_DIR);
    const docFilesWithoutExt = files
      .filter((file) => file.endsWith(".md"))
      .filter((file) => !file.includes("kr"))
      .map((file) => file.replace(".md", ""));

    expect(docFilesWithoutExt).toEqual(
      expect.arrayContaining(exportedRuleNames)
    );
  });
});

describe("configs", () => {
  test("all recommended rules should be included in the recommended config", () => {
    const recommendedRules = Object.entries(exportedRules)
      .filter(([, rule]) => {
        return rule.meta.docs.recommended;
      })
      .map(([name]) => `@html-eslint/${name}`);
    expect(Object.keys(RECOMMENDED_CONFIG.rules)).toEqual(
      expect.arrayContaining(recommendedRules)
    );
  });
});
