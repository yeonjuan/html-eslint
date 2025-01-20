const fs = require("fs");
const path = require("path");

/**
 * @param {string[]} argv
 */
function addNewRule(argv) {
  const ruleName = getRuleName(argv);
  const docPath = path.resolve(__dirname, "../docs/rules", `${ruleName}.md`);
  const docTemplatePath = path.resolve(__dirname, "./templates/rule.md");
  const rulePath = path.resolve(
    __dirname,
    `../packages/eslint-plugin/lib/rules/${ruleName}.js`
  );
  const ruleTemplatePath = path.resolve(__dirname, "./templates/rule.js");
  const ruleTestPath = path.resolve(
    __dirname,
    `../packages/eslint-plugin/tests/rules/${ruleName}.test.js`
  );
  const ruleTestTemplatePath = path.resolve(
    __dirname,
    "./templates/rule.test.js"
  );

  if (!fs.existsSync(docPath)) {
    console.log(`> Create ${ruleName}.md (${docPath})`);
    fs.writeFileSync(
      docPath,
      initiateTemplate(docTemplatePath, ruleName),
      "utf-8"
    );
  } else {
    console.log(`> Skip. ${ruleName}.md already exists`);
  }

  if (!fs.existsSync(rulePath)) {
    console.log(`> Create ${ruleName}.js (${rulePath})`);
    fs.writeFileSync(
      rulePath,
      initiateTemplate(ruleTemplatePath, ruleName),
      "utf-8"
    );
  } else {
    console.log(`> Skip. ${ruleName}.js already exists`);
  }

  if (!fs.existsSync(ruleTestPath)) {
    console.log(`> Create ${ruleName}.test.js (${ruleTestPath})`);
    fs.writeFileSync(
      ruleTestPath,
      initiateTemplate(ruleTestTemplatePath, ruleName),
      "utf-8"
    );
  } else {
    console.log(`> Skip. ${ruleName}.test.js already exists`);
  }
  const indexJsPath = path.resolve(
    __dirname,
    `../packages/eslint-plugin/lib/rules/index.js`
  );
  const indexJs = fs.readFileSync(indexJsPath, "utf-8");
  const [first, ...rest] = ruleName.split("-");
  const camelCase = `${first}${rest.map((r) => r[0].toUpperCase() + r.slice(1)).join("")}`;

  if (!indexJs.includes(camelCase)) {
    console.log(`> Update index.js (${indexJsPath})`);
    const newIndexJs = indexJs
      .replace(
        "// import new rule here ↑",
        `const ${camelCase} = require("./${ruleName}");
// import new rule here ↑`
      )
      .replace(
        "// export new rule here ↑",
        `"${ruleName}": ${camelCase},
  // export new rule here ↑`
      );
    fs.writeFileSync(indexJsPath, newIndexJs, "utf-8");
  } else {
    console.log("> Skip updating index.js");
  }
}

/**
 * @param {string} templateFileName
 * @param {string} ruleName
 * @returns {string}
 */
function initiateTemplate(templateFileName, ruleName) {
  return fs
    .readFileSync(templateFileName, "utf-8")
    .replace(/\{ruleName\}/g, ruleName);
}

/**
 * @param {string[]} argv
 * @returns {string}
 */
function getRuleName(argv) {
  const ruleName = argv.slice(2)[0];
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

addNewRule(process.argv);
