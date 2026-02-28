const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../..");
const TEMPLATES_DIR = path.resolve(__dirname, "./templates");

/** @typedef {{ src: string; template: string; label: string }} FileEntry */

/**
 * @typedef {Object} PluginConfig
 * @property {string} pluginDir
 * @property {string} docsDir
 * @property {string} templatesDir
 */

/** @type {Record<string, PluginConfig>} */
const PLUGIN_CONFIGS = {
  html: {
    pluginDir: path.join(ROOT_DIR, "packages/eslint-plugin"),
    docsDir: path.join(ROOT_DIR, "docs/rules"),
    templatesDir: path.join(TEMPLATES_DIR, "html"),
  },
  react: {
    pluginDir: path.join(ROOT_DIR, "packages/eslint-plugin-react"),
    docsDir: path.join(ROOT_DIR, "docs/react/rules"),
    templatesDir: path.join(TEMPLATES_DIR, "react"),
  },
  svelte: {
    pluginDir: path.join(ROOT_DIR, "packages/eslint-plugin-svelte"),
    docsDir: path.join(ROOT_DIR, "docs/svelte/rules"),
    templatesDir: path.join(TEMPLATES_DIR, "svelte"),
  },
};

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

/**
 * @param {PluginConfig} config
 * @param {string} ruleName
 * @returns {FileEntry[]}
 */
function getFileEntries(config, ruleName) {
  return [
    {
      src: path.join(config.docsDir, `${ruleName}.md`),
      template: path.join(config.templatesDir, "rule.md"),
      label: `${ruleName}.md`,
    },
    {
      src: path.join(config.pluginDir, `lib/rules/${ruleName}.js`),
      template: path.join(config.templatesDir, "rule.js"),
      label: `${ruleName}.js`,
    },
    {
      src: path.join(config.pluginDir, `tests/rules/${ruleName}.test.js`),
      template: path.join(config.templatesDir, "rule.test.js"),
      label: `${ruleName}.test.js`,
    },
  ];
}

/**
 * @param {FileEntry[]} entries
 * @param {string} ruleName
 */
function createFiles(entries, ruleName) {
  for (const { src, template, label } of entries) {
    if (fs.existsSync(src)) {
      console.log(`> Skip. ${label} already exists`);
      continue;
    }
    console.log(`> Create ${label} (${src})`);
    fs.writeFileSync(src, renderTemplate(template, ruleName), "utf-8");
  }
}

/**
 * @param {PluginConfig} config
 * @param {string} ruleName
 */
function updateIndex(config, ruleName) {
  const indexPath = path.join(config.pluginDir, "lib/rules/index.js");
  const camelCase = toCamelCase(ruleName);
  const content = fs.readFileSync(indexPath, "utf-8");

  if (content.includes(camelCase)) {
    console.log("> Skip updating index.js");
    return;
  }

  console.log(`> Update index.js (${indexPath})`);

  // Detect if the file uses ESM or CommonJS
  const isESM =
    content.includes("import ") && content.includes("export default");

  let updated;
  if (isESM) {
    // ESM format
    updated = content
      .replace(
        "// import new rule here ↑",
        `import ${camelCase} from "./${ruleName}.js";\n// import new rule here ↑`
      )
      .replace(
        "// export new rule here ↑",
        `"${ruleName}": ${camelCase},\n  // export new rule here ↑`
      );
  } else {
    // CommonJS format
    updated = content
      .replace(
        "// import new rule here ↑",
        `const ${camelCase} = require("./${ruleName}");\n// import new rule here ↑`
      )
      .replace(
        "// export new rule here ↑",
        `"${ruleName}": ${camelCase},\n  // export new rule here ↑`
      );
  }

  fs.writeFileSync(indexPath, updated, "utf-8");
}

/**
 * @param {string[]} argv
 * @returns {{ pluginType: string; ruleName: string }}
 */
function getArgs(argv) {
  const pluginType = argv[2];
  const ruleName = argv[3];

  if (!pluginType || !ruleName) {
    throw new Error(
      `Usage: ${argv[0]} ${argv[1]} <plugin-type> <rule-name>\n` +
        `  plugin-type: ${Object.keys(PLUGIN_CONFIGS).join(" | ")}`
    );
  }

  if (!PLUGIN_CONFIGS[pluginType]) {
    throw new Error(
      `Unknown plugin type: "${pluginType}". Must be one of: ${Object.keys(PLUGIN_CONFIGS).join(", ")}`
    );
  }

  if (!/^[a-z-]+$/.test(ruleName)) {
    throw new Error("Wrong rule name format.");
  }

  return { pluginType, ruleName };
}

const { pluginType, ruleName } = getArgs(process.argv);
const config = PLUGIN_CONFIGS[pluginType];
createFiles(getFileEntries(config, ruleName), ruleName);
updateIndex(config, ruleName);
