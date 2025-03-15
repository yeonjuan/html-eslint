const { parseFrontmatterContent } = require("../lib/frontmatter");

describe("frontmatter", () => {
  describe("frontmatter O", () => {
    it("should parse frontmatter with content", () => {
      const result = parseFrontmatterContent(`---
name: value
---
content`);
      expect(result.index).toBe(20);
      expect(result.line).toBe(4);
      expect(result.html).toBe("content");
    });

    it("should parse frontmatter with content (CRLF)", () => {
      const result = parseFrontmatterContent(
        "---\r\nname: value\r\n---\r\ncontent"
      );
      expect(result.index).toBe(23);
      expect(result.line).toBe(4);
      expect(result.html).toBe("content");
    });

    it("should parse frontmatter with trailing spaces", () => {
      const result = parseFrontmatterContent(`---
name: value
---   
content`);
      expect(result.index).toBe(23);
      expect(result.line).toBe(4);
      expect(result.html).toBe("content");
    });

    it("should parse frontmatter without content", () => {
      const result = parseFrontmatterContent(`---
name: value
---`);
      expect(result.index).toBe(19);
      expect(result.line).toBe(3);
      expect(result.html).toBe("");
    });

    it("should parse frontmatter with newline only", () => {
      const result = parseFrontmatterContent(`---
name: value
---
`);
      expect(result.index).toBe(20);
      expect(result.line).toBe(4);
      expect(result.html).toBe("");
    });

    it("should parse frontmatter after newline", () => {
      const result = parseFrontmatterContent(`
---
name: value
---
`);
      expect(result.index).toBe(21);
      expect(result.line).toBe(5);
      expect(result.html).toBe("");
    });

    it("should parse frontmatter after newlines", () => {
      const result = parseFrontmatterContent(`

---
name: value
---
`);
      expect(result.index).toBe(22);
      expect(result.line).toBe(6);
      expect(result.html).toBe("");
    });
  });

  describe("frontmatter X", () => {
    test.each([
      [
        `---
  name: value ---`,
      ],
      [
        `---
  name: value
---trailing`,
      ],
      [``],
      [`<html></html>`],
      [
        `content
---

---`,
      ],
    ])("should return null", (code) => {
      expect(parseFrontmatterContent(code)).toBe(null);
    });
  });
});
