const path = require("path");
const fs = require("fs");
const ALL_RULES = require("../../packages/eslint-plugin/lib/rules");
const { RULE_CATEGORY } = require("../../packages/eslint-plugin/lib/constants");

const WEBSITE_DIR = path.resolve(__dirname, "../");
const RULE_DOCS_DIR = path.resolve(__dirname, "../../docs/rules");
const ALL_RULES_DOC_PATH = path.resolve(__dirname, "../../docs/all-rules.md");

const RULE_META = Object.entries(ALL_RULES).map(([name, { meta }]) => ({
  name,
  meta,
}));

function genSideBarsJson() {
  function createSubCatory(label, ids) {
    return {
      type: "subcategory",
      label,
      ids,
    };
  }

  const BASE = {
    docs: {
      "Getting Started": ["getting-started", "cli"],
      "Disabling with inline comments": ["disable-rules-with-inline-comments"],
      Rules: ["all-rules"],
    },
  };
  const ruleDocIds = {
    [RULE_CATEGORY.SEO]: [],
    [RULE_CATEGORY.STYLE]: [],
    [RULE_CATEGORY.BEST_PRACTICE]: [],
    [RULE_CATEGORY.ACCESSIBILITY]: [],
  };

  RULE_META.forEach(({ name, meta }) =>
    ruleDocIds[meta.docs.category].push(`rules/${name}`)
  );

  BASE.docs.Rules.push(
    ...Object.entries(ruleDocIds).map(([label, ids]) =>
      createSubCatory(label, ids)
    )
  );

  const sidebarsJson = JSON.stringify(BASE);

  fs.writeFileSync(path.resolve(WEBSITE_DIR, "sidebars.json"), sidebarsJson);
}

function prependDocMeta() {
  const docPaths = fs
    .readdirSync(RULE_DOCS_DIR)
    .map((name) => path.resolve(RULE_DOCS_DIR, name));

  docPaths.forEach((docPath) => {
    const file = fs.readFileSync(docPath).toString();
    const name = path.parse(docPath).name;

    if (!file.startsWith("---")) {
      fs.writeFileSync(
        docPath,
        `---\nid: ${name}\ntitle: "@html-eslint/${name}"\n---\n\n${file}`
      );
    }
  });
}

function genAllRules() {
  function createAllRulesContent({ bestPractice, SEO, accessibility, styles }) {
    return `---
id: all-rules
title: All Rules
---

- 🔧 - Meaning the rule can fix problems aotomatically by running eslint \`--fix\` options.
- ⭐ - Meaning the rule is recommended.

### Best Pracice

${bestPractice}

### SEO

${SEO}

### Accessibility

${accessibility}

### Styles

${styles}
`;
  }

  function createTableRowContent({ name, meta }) {
    return `| [@html-eslint/${name}](rules/${name}) | ${
      meta.docs.description
    } | ${meta.docs.recommended ? "⭐" : ""}${meta.fixable ? "🔧" : ""} |`;
  }

  function createTable(rows) {
    return `| rule | description |  |
| :--- | :---| :--- |
${rows}`;
  }

  const bestPractice = RULE_META.filter(
    ({ meta }) => meta.docs.category === RULE_CATEGORY.BEST_PRACTICE
  )
    .map(createTableRowContent)
    .join("\n");
  const SEO = RULE_META.filter(
    ({ meta }) => meta.docs.category === RULE_CATEGORY.SEO
  )
    .map(createTableRowContent)
    .join("\n");
  const accessibility = RULE_META.filter(
    ({ meta }) => meta.docs.category === RULE_CATEGORY.ACCESSIBILITY
  )
    .map(createTableRowContent)
    .join("\n");
  const styles = RULE_META.filter(
    ({ meta }) => meta.docs.category === RULE_CATEGORY.STYLE
  )
    .map(createTableRowContent)
    .join("\n");

  fs.writeFileSync(
    ALL_RULES_DOC_PATH,
    createAllRulesContent({
      bestPractice: createTable(bestPractice),
      SEO: createTable(SEO),
      accessibility: createTable(accessibility),
      styles: createTable(styles),
    })
  );
}

genSideBarsJson();
genAllRules();
prependDocMeta();
