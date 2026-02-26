const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../..");
const TEMPLATES_DIR = path.resolve(__dirname, "./templates");

/** @typedef {{ src: string; template: string; label: string }} FileEntry */

/**
 * @typedef {Object} PluginAdapter
 * @property {(ruleName: string) => FileEntry[]} getFileEntries
 * @property {(ruleName: string) => void} updateIndex
 */

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

/** @param {FileEntry[]} entries @param {string} ruleName */
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

/** @returns {PluginAdapter} */
function createHtmlAdapter() {
  const PLUGIN_DIR = path.join(ROOT_DIR, "packages/eslint-plugin");
  const DOCS_DIR = path.join(ROOT_DIR, "docs/rules");

  return {
    getFileEntries(ruleName) {
      return [
        {
          src: path.join(DOCS_DIR, `${ruleName}.md`),
          template: path.join(TEMPLATES_DIR, "html/rule.md"),
          label: `${ruleName}.md`,
        },
        {
          src: path.join(PLUGIN_DIR, `lib/rules/${ruleName}.js`),
          template: path.join(TEMPLATES_DIR, "html/rule.js"),
          label: `${ruleName}.js`,
        },
        {
          src: path.join(PLUGIN_DIR, `tests/rules/${ruleName}.test.js`),
          template: path.join(TEMPLATES_DIR, "html/rule.test.js"),
          label: `${ruleName}.test.js`,
        },
      ];
    },

    updateIndex(ruleName) {
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
    },
  };
}

/** @returns {PluginAdapter} */
function createReactAdapter() {
  const PLUGIN_DIR = path.join(ROOT_DIR, "packages/eslint-plugin-react");
  const DOCS_DIR = path.join(ROOT_DIR, "docs/react/rules");

  return {
    getFileEntries(ruleName) {
      return [
        {
          src: path.join(DOCS_DIR, `${ruleName}.md`),
          template: path.join(TEMPLATES_DIR, "react/rule.md"),
          label: `${ruleName}.md`,
        },
        {
          src: path.join(PLUGIN_DIR, `lib/rules/${ruleName}.js`),
          template: path.join(TEMPLATES_DIR, "react/rule.js"),
          label: `${ruleName}.js`,
        },
        {
          src: path.join(PLUGIN_DIR, `tests/rules/${ruleName}.test.js`),
          template: path.join(TEMPLATES_DIR, "react/rule.test.js"),
          label: `${ruleName}.test.js`,
        },
      ];
    },

    updateIndex(ruleName) {
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
    },
  };
}

const PLUGIN_ADAPTERS = {
  html: createHtmlAdapter,
  react: createReactAdapter,
};

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
        `  plugin-type: ${Object.keys(PLUGIN_ADAPTERS).join(" | ")}`
    );
  }

  if (!PLUGIN_ADAPTERS[pluginType]) {
    throw new Error(
      `Unknown plugin type: "${pluginType}". Must be one of: ${Object.keys(PLUGIN_ADAPTERS).join(", ")}`
    );
  }

  if (!/^[a-z-]+$/.test(ruleName)) {
    throw new Error("Wrong rule name format.");
  }

  return { pluginType, ruleName };
}

const { pluginType, ruleName } = getArgs(process.argv);
const adapter = PLUGIN_ADAPTERS[pluginType]();
createFiles(adapter.getFileEntries(ruleName), ruleName);
adapter.updateIndex(ruleName);
