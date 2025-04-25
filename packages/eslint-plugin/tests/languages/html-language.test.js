const { HTMLLanguage } = require("../../lib/languages/html-language");

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
      const result = language.parse({
        body: `<div></div>`,
        path: "test.html",
      });
      expect(result.ok).toBe(true);
      expect(result.ast.type).toBe("Program");
      expect(result.ast.body[0].children[0].type).toBe("Tag");
    });

    it("should skip frontmatter", () => {
      const language = new HTMLLanguage();
      const result = language.parse(
        {
          body: `---
  name: value
---
<div>
</div>
`,
          path: "text.html",
        },
        { languageOptions: { frontmatter: true } }
      );
      expect(result.ok).toBe(true);
      expect(result.ast.body[0].children[0].type).toBe("Tag");
    });

    it("should parse template syntax", () => {
      const language = new HTMLLanguage();
      const result = language.parse(
        {
          body: `<div>{{text}}</div>`,
          path: "text.html",
        },
        {
          languageOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        }
      );
      expect(result.ok).toBe(true);
      const part = result.ast.body[0].children[0].children[0].parts[0];
      expect(part.open.type).toBe("OpenTemplate");
      expect(part.close.type).toBe("CloseTemplate");
    });
  });

  describe("validateLanguageOptions()", () => {
    it("should pass", () => {
      const language = new HTMLLanguage();
      expect(() => language.validateLanguageOptions()).not.toThrow();
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
          frontmatter: "true",
        })
      ).toThrow();

      expect(() =>
        language.validateLanguageOptions({
          templateEngineSyntax: "",
        })
      ).toThrow();
    });
  });
  describe("createSourceCode()", () => {
    it("shoud create a HTMLSourceCode instance", () => {
      const file = { body: "<div></div>", path: "test.html" };
      const language = new HTMLLanguage();
      const parsed = language.parse(file);
      const sourceCode = language.createSourceCode(file, parsed);
      expect(sourceCode.constructor.name).toBe("HTMLSourceCode");
      expect(sourceCode.ast.type).toBe("Program");
    });
  });
});
