/**
 * @typedef {import('@eslint/core').File} File
 */

const { HTMLLanguage } = require("../../lib/languages/html-language");

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

describe("HTMLLanguage", () => {
  describe("visitorKeys", () => {
    it("should have visitorKeys property", () => {
      const language = new HTMLLanguage();
      expect(language.visitorKeys["Tag"]).toMatchObject([
        "openStart",
        "openEnd",
        "close",
        "children",
        "attributes",
      ]);
    });
  });

  describe("parse()", () => {
    it("should parse HTML", () => {
      const language = new HTMLLanguage();
      const file = createFile(`<div></div>`);
      const result = language.parse(file);
      expect(result.ok).toBe(true);
      // @ts-ignore
      expect(result.ast.type).toBe("Program");
      // @ts-ignore
      expect(result.ast.body[0].children[0].type).toBe("Tag");
    });

    it("should skip frontmatter", () => {
      const language = new HTMLLanguage();
      const file = createFile(`---
name: value
---
<div>
</div>
      `);
      const result = language.parse(file, {
        languageOptions: { frontmatter: true },
      });
      expect(result.ok).toBe(true);
      // @ts-ignore
      expect(result.ast.body[0].children[0].type).toBe("Tag");
    });

    it("should parse template syntax", () => {
      const language = new HTMLLanguage();
      const file = createFile(`<div>{{text}}</div>`);
      const result = language.parse(file, {
        languageOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      });
      expect(result.ok).toBe(true);
      // @ts-ignore
      const part = result.ast.body[0].children[0].children[0].parts[0];
      expect(part.open.type).toBe("OpenTemplate");
      expect(part.close.type).toBe("CloseTemplate");
    });
  });

  describe("validateLanguageOptions()", () => {
    it("should pass", () => {
      const language = new HTMLLanguage();
      // @ts-ignore
      expect(() => language.validateLanguageOptions()).not.toThrow();
      // @ts-ignore
      expect(() => language.validateLanguageOptions({})).not.toThrow();
      expect(() =>
        language.validateLanguageOptions({ frontmatter: true })
      ).not.toThrow();
      expect(() =>
        language.validateLanguageOptions({
          templateEngineSyntax: {
            "{{": "}}",
          },
        })
      ).not.toThrow();
    });

    it("should throw error when invalid option provided", () => {
      const language = new HTMLLanguage();
      expect(() =>
        language.validateLanguageOptions({
          // @ts-ignore
          frontmatter: "true",
        })
      ).toThrow();

      expect(() =>
        language.validateLanguageOptions({
          // @ts-ignore
          templateEngineSyntax: "",
        })
      ).toThrow();
    });
  });
  describe("createSourceCode()", () => {
    it("should create a HTMLSourceCode instance", () => {
      const file = createFile("<div></div>");
      const language = new HTMLLanguage();
      const parsed = language.parse(file);
      const sourceCode = language.createSourceCode(file, parsed);
      expect(sourceCode.constructor.name).toBe("HTMLSourceCode");
      expect(sourceCode.ast.type).toBe("Program");
    });
  });
});
