const fs = require("fs");
const path = require("path");

const PLUGIN_DIR = path.resolve(__dirname, "../../packages/eslint-plugin");
const TEMPLATES_DIR = path.resolve(__dirname, "./templates");
const DOCS_DIR = path.resolve(__dirname, "../../docs/rules");

/** @typedef {{ src: string; template: string; label: string }} FileEntry */

/** @param {string} ruleName @returns {FileEntry[]} */
function getFileEntries(ruleName) {
  return [
    {
      src: path.join(DOCS_DIR, `${ruleName}.md`),
      template: path.join(TEMPLATES_DIR, "rule.md"),
      label: `${ruleName}.md`,
    },
    {
      src: path.join(PLUGIN_DIR, `lib/rules/${ruleName}.js`),
      template: path.join(TEMPLATES_DIR, "rule.js"),
      label: `${ruleName}.js`,
    },
    {
      src: path.join(PLUGIN_DIR, `tests/rules/${ruleName}.test.js`),
      template: path.join(TEMPLATES_DIR, "rule.test.js"),
      label: `${ruleName}.test.js`,
    },
  ];
}

/** @param {string} ruleName @returns {string} */
function toCamelCase(ruleName) {
  const [first, ...rest] = ruleName.split("-");
  return `${first}${rest.map((r) => r[0].toUpperCase() + r.slice(1)).join("")}`;
}

/**
 * @param {string} templatePath
 * @param {string} ruleName
 * @returns {string}
 */
function renderTemplate(templatePath, ruleName) {
  return fs
    .readFileSync(templatePath, "utf-8")
    .replace(/\{ruleName\}/g, ruleName);
}

/** @param {string} ruleName */
function createFiles(ruleName) {
  for (const { src, template, label } of getFileEntries(ruleName)) {
    if (fs.existsSync(src)) {
      console.log(`> Skip. ${label} already exists`);
      continue;
    }
    console.log(`> Create ${label} (${src})`);
    fs.writeFileSync(src, renderTemplate(template, ruleName), "utf-8");
  }
}

/** @param {string} ruleName */
function updateIndex(ruleName) {
  const indexPath = path.join(PLUGIN_DIR, "lib/rules/index.js");
  const camelCase = toCamelCase(ruleName);
  const content = fs.readFileSync(indexPath, "utf-8");

  if (content.includes(camelCase)) {
    console.log("> Skip updating index.js");
    return;
  }

  console.log(`> Update index.js (${indexPath})`);
  const updated = content
    .replace(
      "// import new rule here ↑",
      `const ${camelCase} = require("./${ruleName}");\n// import new rule here ↑`
    )
    .replace(
      "// export new rule here ↑",
      `"${ruleName}": ${camelCase},\n  // export new rule here ↑`
    );
  fs.writeFileSync(indexPath, updated, "utf-8");
}

/** @param {string[]} argv @returns {string} */
function getRuleName(argv) {
  const ruleName = argv[2];
  if (!ruleName) {
    throw new Error(
      `Unexpected empty rule name. Run ${argv[0]} ${argv[1]} <rule-name>`
    );
  }
  if (!/^[a-z-]+$/.test(ruleName)) {
    throw new Error("Wrong rule name format.");
  }
  return ruleName;
}

const ruleName = getRuleName(process.argv);
createFiles(ruleName);
updateIndex(ruleName);
