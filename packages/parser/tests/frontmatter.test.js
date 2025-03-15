const { parseFrontmatterContent } = require("../lib/frontmatter");

describe("frontmatter", () => {
  describe("has frontmatter", () => {
    it("should parse frontmatter with content", () => {
      const result = parseFrontmatterContent(`---
name: value
---
content`);
      expect(result.index).toBe(20);
      expect(result.line).toBe(4);
      expect(result.html).toBe("content");
    });

    it("should parse frontmatter with content (trailing slash)", () => {
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
  });

  //   it("should parse frontmatter without newline", () => {
  //     const result = parseFrontmatter(`---
  // name: value
  // ---`);
  //     expect(result.range).toMatchObject([0, 19]);
  //     expect(result.loc.start.line).toBe(1);
  //     expect(result.loc.start.column).toBe(0);
  //     expect(result.loc.end.line).toBe(3);
  //     expect(result.loc.end.column).toBe(3);
  //   });

  //   it("should parse frontmatter without newline trailing spaces", () => {
  //     const result = parseFrontmatter(`---
  // name: value
  // ---   `);
  //     expect(result.range).toMatchObject([0, 19]);
  //     expect(result.loc.start.line).toBe(1);
  //     expect(result.loc.start.column).toBe(0);
  //     expect(result.loc.end.line).toBe(3);
  //     expect(result.loc.end.column).toBe(3);
  //   });

  //   it("should parse frontmatter without newline", () => {
  //     const result = parseFrontmatter("---\r\nname: value\r\n---");
  //     expect(result.range).toMatchObject([0, 21]);
  //     expect(result.loc.start.line).toBe(1);
  //     expect(result.loc.start.column).toBe(0);
  //     expect(result.loc.end.line).toBe(3);
  //     expect(result.loc.end.column).toBe(3);
  //   });

  it("should return null", () => {
    const result = parseFrontmatterContent(`---
name: value ---`);
    expect(result).toBe(null);
  });

  it("should return null 2", () => {
    const result = parseFrontmatterContent(`---
name: value
---trailing`);
    expect(result).toBe(null);
  });
});
