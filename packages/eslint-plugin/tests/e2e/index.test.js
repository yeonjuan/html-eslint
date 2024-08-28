const eslint = require(`eslint`);
const fs = require(`fs`);
const parser = require(`@html-eslint/parser`);
const plugin = require(`../../lib/index`);
const pluginRules = Object.fromEntries(
  Object.entries(plugin.rules).map(([name, rule]) => [
    `@html-eslint/${name}`,
    rule,
  ])
);

const testDirs = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter(entry => entry.isDirectory());

for (const testDir of testDirs) {
  const testDirPath = `${testDir.path}/${testDir.name}`;

  test(`e2e/` + testDir.name, () => {
    const configRules = require(`${testDirPath}/rules.js`);
    const config = {
      parser: `@html-eslint/parser`,
      rules: configRules,
    };

    const linter = new eslint.Linter();
    linter.defineParser(`@html-eslint/parser`, parser);
    linter.defineRules(pluginRules);

    const source = fs.readFileSync(`${testDirPath}/source.html`, { encoding: `utf8` });

    const outputPath = `${testDirPath}/fixed.html`;
    const shouldHaveErrors = fs.existsSync(outputPath);

    if (shouldHaveErrors) {
      const expected = fs.readFileSync(outputPath, { encoding: `utf8` });
      const result = linter.verifyAndFix(source, config);
      expect(JSON.stringify(result.messages, null, `\t`)).toEqual(`[]`);
      expect(result.output).toEqual(expected);
    } else {
      const result = linter.verify(source);
      expect(result.join(``)).toEqual(``);
    }
  });
}
