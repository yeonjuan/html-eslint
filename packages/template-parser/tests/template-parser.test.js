const { NodeTypes } = require("es-html-parser");
const { SourceCode } = require("eslint");
const templateParser = require("../lib/template-parser");
const espree = require("espree");

/**
 * @param {string} code
 */
const parseCode = (code) =>
  espree.parse(code, {
    range: true,
    loc: true,
    ecmaVersion: "latest",
  });

/**
 *
 * @param {string} code
 * @param {*} ast
 * @returns
 */
const createSourceCode = (code, ast) =>
  new SourceCode({
    text: code,
    ast: {
      ...ast,
      tokens: [],
      comments: ast.comments ?? [],
      loc: ast.loc,
      range: ast.range,
    },
  });

/**
 * @type {any}
 */
const visitors = {
  Tag: jest.fn(),
  "Tag:exit": jest.fn(),
  OpenTagStart: jest.fn(),
  CloseTag: jest.fn(),
  AttributeValue: jest.fn(),
  Text: jest.fn(),
};

describe("parseTemplate", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("simple", () => {
    const code = "`<div></div>`;";
    const ast = parseCode(code);

    // @ts-ignore
    const exp = ast.body[0].expression;
    const sourcecode = createSourceCode(code, ast);
    expect(templateParser.parse(exp, sourcecode, visitors));
    expect(visitors.OpenTagStart).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.OpenTagStart,
        range: [1, 5],
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 5 },
        },
      })
    );
    expect(visitors.Tag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.Tag,
        range: [1, 12],
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 12 },
        },
      })
    );
    expect(visitors["Tag:exit"]).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.Tag,
        range: [1, 12],
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 12 },
        },
      })
    );
  });

  test("multiline", () => {
    const code = `\`<div>
  </div>\`;`;
    const ast = parseCode(code);

    // @ts-ignore
    const exp = ast.body[0].expression;
    const sourcecode = createSourceCode(code, ast);
    templateParser.parse(exp, sourcecode, visitors);
    expect(visitors.CloseTag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.CloseTag,
        range: [9, 15],
        loc: {
          start: { line: 2, column: 2 },
          end: { line: 2, column: 8 },
        },
      })
    );
  });

  test("with expression", () => {
    const code = `html\`<div
  id="\${ id }">
    \${text}
  </div>\`;`;
    const ast = parseCode(code);

    // @ts-ignore
    const exp = ast.body[0].expression.quasi;
    const sourcecode = createSourceCode(code, ast);
    templateParser.parse(exp, sourcecode, visitors);
    expect(visitors.AttributeValue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.AttributeValue,
        value: "${ id }",
      })
    );
    expect(visitors.Text).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NodeTypes.Text,
        value: `
    \${text}
  `,
      })
    );
  });
});
