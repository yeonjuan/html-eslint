const templateParser = require("../lib/template-parser");
const espree = require("espree");

const parseCode = (code) =>
  espree.parse(code, {
    range: true,
    loc: true,
    ecmaVersion: "latest",
  });

describe("parseTemplate", () => {
  test("simple", () => {
    const code = "`<div></div>`;";
    const ast = parseCode(code);
    const exp = ast.body[0].expression;

    expect(templateParser.parse(exp)).toMatchSnapshot();
  });

  test("newline", () => {
    const code = `\`<div>
</div>\`;`;
    const ast = parseCode(code);
    const exp = ast.body[0].expression;
    expect(templateParser.parse(exp)).toMatchSnapshot();
  });

  test("padding", () => {
    const code = `const html = \`<div>
</div>\`;`;
    const ast = parseCode(code);
    const exp = ast.body[0].declarations[0].init;
    expect(templateParser.parse(exp)).toMatchSnapshot();
  });
});
