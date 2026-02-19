const {
  resolve 
} = require("path");
const {
  readFileSync 
} = require("fs");
const rulesRecord = require("@html-eslint/eslint-plugin/lib/rules");
const reactRulesRecord = require('@html-eslint/eslint-plugin-react/lib/rules')

const rules = {
  ["Best Practice"]: [],
  SEO: [],
  Accessibility: [],
  Style: [],
};

Object.entries(rulesRecord).forEach(([rulename, rule]) => {
  rules[rule.meta.docs.category].push([
    rulename,
    "~/src/docs/rules/" + rulename + ".html",
  ]);
});

Object.keys(rules).forEach((category) => {
  rules[category].sort(([ruleNameA], [ruleNameB]) =>
    ruleNameA.localeCompare(ruleNameB)
  );
});

const version = JSON.parse(
  readFileSync(resolve(process.cwd(), "../eslint-plugin/package.json"), "utf-8")
).version;

const expressionsOption = {
  removeScriptLocals: true,
  locals: {
    version,
    navs: {
      project: [
        ["Getting Started", "~/src/docs/getting-started.html"],
        ["Disablling Rules", "~/src/docs/disabling-rules.html"],
      ],
      bestPractice: rules["Best Practice"],
      seo: rules["SEO"],
      accessibility: rules["Accessibility"],
      style: rules["Style"],
    },
    navsReact: Object.entries(reactRulesRecord).map(([rulename]) => {
      return [rulename, '~/src/docs/react/rules/' + rulename + ".html"]
    })
  },
};

module.exports = {
  plugins: {
    "posthtml-include": {
      root: "./src",
    },
    "posthtml-extend": {
      root: "./src",
      plugins: [
        require("posthtml-expressions")({
          ...expressionsOption,
        }),
      ],
    },
    "posthtml-expressions": {
      root: "./src",
      ...expressionsOption,
    },
    "posthtml-modules": {
      root: "./src",
      attributeAsLocals: true,
    },
  },
};
