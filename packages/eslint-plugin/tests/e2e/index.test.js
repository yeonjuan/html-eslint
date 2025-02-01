const eslint = require(`eslint`);
const fs = require(`fs`);
const parser = require(`@html-eslint/parser`);
const path = require(`path`);
const plugin = require(`../../lib/index`);
const pluginRules = Object.fromEntries(
  Object.entries(plugin.rules).map(([name, rule]) => [
    `@html-eslint/${name}`,
    rule,
  ])
);

const testDirs = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((entry) => entry.isDirectory());

for (const testDir of testDirs) {
  const testName = testDir.name;
  const testPath = path.join(__dirname, testName);

  test(`e2e/` + testDir.name, () => {
    const configRules = require(path.join(testPath, `rules.js`));
    const config = {
      plugins: {
        "@html-eslint": require("@html-eslint/eslint-plugin"),
      },
      languageOptions: {
        parser: require(`@html-eslint/parser`),
      },
      rules: configRules,
    };

    const linter = new eslint.Linter();

    const source = fs.readFileSync(path.join(testPath, `source.html`), {
      encoding: `utf8`,
    });

    const outputPath = path.join(testPath, `fixed.html`);
    const shouldHaveErrors = fs.existsSync(outputPath);

    let messages;
    if (shouldHaveErrors) {
      const expected = fs.readFileSync(outputPath, { encoding: `utf8` });
      const result = linter.verifyAndFix(source, config);
      messages = result.messages;
      expect(result.output).toEqual(expected);
    } else {
      // If no `fixed.html`, assume the `source.html` should have no errors/warnings
      messages = linter.verify(source, config);
    }
    expect(JSON.stringify(messages, null, `\t`)).toEqual(`[]`); // Quick-and-dirty to check for and print any unfixed errors/warnings
  });
}
