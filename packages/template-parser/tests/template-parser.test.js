const { NodeTypes } = require("es-html-parser");
const templateParser = require("../lib/template-parser");
const espree = require("espree");

const parseCode = (code) =>
  espree.parse(code, {
    range: true,
    loc: true,
    ecmaVersion: "latest",
  });

const visitors = {
  Tag: jest.fn(),
};

describe("parseTemplate", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("simple", () => {
    const code = "`<div></div>`;";
    const ast = parseCode(code);
    const exp = ast.body[0].expression;

    expect(templateParser.parse(exp, visitors));
    expect(visitors.Tag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.Tag,
        range: [1, 12],
      }),
    );
  });

  //   test("newline", () => {
  //     const code = `\`<div>
  // </div>\`;`;
  //     const ast = parseCode(code);
  //     const exp = ast.body[0].expression;
  //     expect(templateParser.parse(exp, visitors)).toMatchSnapshot();
  //   });

  //   test("padding", () => {
  //     const code = `const html = \`<div>
  // </div>\`;`;
  //     const ast = parseCode(code);
  //     const exp = ast.body[0].declarations[0].init;
  //     expect(templateParser.parse(exp, visitors)).toMatchSnapshot();
  //   });
});
