/**
 * @typedef {import('@eslint/core').File} File
 */

const { HTMLLanguage } = require("../../lib/languages/html-language");
const { HTMLSourceCode } = require("../../lib/languages/html-source-code");

/**
 * @param {string} text
 * @returns {File}
 */
const createFile = (text) => {
  return {
    body: text,
    path: "test.html",
    physicalPath: "test.html",
    bom: false,
  };
};

/**
 * @param {string} text
 */
const createSourceCode = (text) => {
  const language = new HTMLLanguage();
  const file = createFile(text);
  const parsed = language.parse(file);
  const sourceCode = new HTMLSourceCode({
    text,
    ast: parsed.ast,
    comments: parsed.comments,
  });
  return sourceCode;
};

describe("HTMLSourceCode", () => {
  const code = `<!-- eslint-disable -->
<!-- eslint-disable @html-eslint/no-duplicate-attrs -->
<!-- eslint-disable-next-line -->
<!-- eslint-disable-line -->
<!-- eslint-enable -->
`;
  describe("getInlineConfigNodes()", () => {
    it("should return inline config nodes", () => {
      const sourceCode = createSourceCode(code);
      expect(sourceCode.getInlineConfigNodes().length).toBe(5);
    });
  });

  describe("getDisableDirectives", () => {
    it("should return directives", () => {
      const sourceCode = createSourceCode(code);
      expect(sourceCode.getDisableDirectives().directives.length).toBe(5);
      expect(sourceCode.getDisableDirectives().problems.length).toBe(0);
    });

    it("should return problems", () => {
      const code = `<!--
 eslint-disable-line
-->
        `;
      const sourceCode = createSourceCode(code);
      expect(sourceCode.getDisableDirectives().problems.length).toBe(1);
    });
  });

  describe("getParent()", () => {
    const code = `<div><span></span></div>`;
    const sourceCode = createSourceCode(code);
    // @ts-ignore
    const span = sourceCode.ast.body[0].children[0].children[0];
    sourceCode.traverse();
    // @ts-ignore
    expect(sourceCode.getParent(span).type).toBe("Tag");
    // @ts-ignore
    expect(sourceCode.getParent(span).name).toBe("div");
  });
});
