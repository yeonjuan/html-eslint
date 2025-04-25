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

describe("HTMLSourceCode", () => {
  describe("getInlineConfigNodes()", () => {
    it("should return inline config nodes", () => {
      const language = new HTMLLanguage();
      const text = `<!-- eslint-disable -->
<!-- eslint-disable @html-eslint/no-duplicate-attrs -->
<!-- eslint-disable-next-line -->
<!-- eslint-disable-line -->
<!-- eslint-enable -->
`;
      const file = createFile(text);
      const parsed = language.parse(file);
      const sourceCode = new HTMLSourceCode({
        text,
        ast: parsed.ast,
        comments: parsed.comments,
      });
      expect(sourceCode.getInlineConfigNodes().length).toBe(5);
    });
  });
});
