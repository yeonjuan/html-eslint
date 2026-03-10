const parser = require("@html-eslint/parser");
const { HTMLTextAdapter } = require("../../lib/adapters/text");

/**
 * @param {string} code
 * @returns {import("@html-eslint/types").Text}
 */
function parseText(code) {
  const { ast } = parser.parseForESLint(code, {});
  // @ts-ignore
  const document = ast.body[0];
  // @ts-ignore
  const tag = document.children[0];
  return tag.children[0];
}

describe("HTMLTextAdapter", () => {
  describe("getValue", () => {
    it("should trim leading and trailing whitespace", () => {
      const textNode = parseText("<div>  hello world  </div>");
      const adapter = new HTMLTextAdapter(textNode);

      expect(adapter.getValue()).toBe("hello world");
    });

    it("should trim leading and trailing newlines", () => {
      const textNode = parseText("<div>\n  hello\n</div>");
      const adapter = new HTMLTextAdapter(textNode);

      expect(adapter.getValue()).toBe("hello");
    });

    it("should handle text with no whitespace", () => {
      const textNode = parseText("<div>hello</div>");
      const adapter = new HTMLTextAdapter(textNode);

      expect(adapter.getValue()).toBe("hello");
    });

    it("should return empty string for whitespace-only text", () => {
      const textNode = parseText("<div>   </div>");
      const adapter = new HTMLTextAdapter(textNode);

      expect(adapter.getValue()).toBe("");
    });
  });

  describe("getRange", () => {
    it("should return range of trimmed text", () => {
      const textNode = parseText("<div>  hello  </div>");
      const adapter = new HTMLTextAdapter(textNode);

      const range = adapter.getRange();

      expect(range).toEqual([7, 12]);
    });

    it("should handle text with newlines", () => {
      const textNode = parseText("<div>\n  hello\n</div>");
      const adapter = new HTMLTextAdapter(textNode);

      const range = adapter.getRange();

      expect(range).toEqual([8, 13]);
    });

    it("should handle text with no whitespace", () => {
      const textNode = parseText("<div>hello</div>");
      const adapter = new HTMLTextAdapter(textNode);

      const range = adapter.getRange();

      expect(range).toEqual([5, 10]);
    });

    it("should return same position for empty text", () => {
      const textNode = parseText("<div>   </div>");
      const adapter = new HTMLTextAdapter(textNode);

      const range = adapter.getRange();

      expect(range).toEqual([5, 5]);
    });
  });

  describe("getLocation", () => {
    it("should return location of trimmed text on single line", () => {
      const textNode = parseText("<div>  hello  </div>");
      const adapter = new HTMLTextAdapter(textNode);

      const loc = adapter.getLocation();

      expect(loc).toEqual({
        start: { line: 1, column: 7 },
        end: { line: 1, column: 12 },
      });
    });

    it("should return location of trimmed text with newlines", () => {
      const textNode = parseText("<div>\n  hello\n</div>");
      const adapter = new HTMLTextAdapter(textNode);

      const loc = adapter.getLocation();

      expect(loc).toEqual({
        start: { line: 2, column: 2 },
        end: { line: 2, column: 7 },
      });
    });

    it("should handle text with no whitespace", () => {
      const textNode = parseText("<div>hello</div>");
      const adapter = new HTMLTextAdapter(textNode);

      const loc = adapter.getLocation();

      expect(loc).toEqual({
        start: { line: 1, column: 5 },
        end: { line: 1, column: 10 },
      });
    });

    it("should return same position for empty text", () => {
      const textNode = parseText("<div>   </div>");
      const adapter = new HTMLTextAdapter(textNode);

      const loc = adapter.getLocation();

      expect(loc).toEqual({
        start: { line: 1, column: 5 },
        end: { line: 1, column: 5 },
      });
    });

    it("should handle multiline text with trimming", () => {
      const textNode = parseText("<div>\n  hello\n  world\n</div>");
      const adapter = new HTMLTextAdapter(textNode);

      const loc = adapter.getLocation();

      expect(loc.start).toEqual({ line: 2, column: 2 });
      expect(loc.end).toEqual({ line: 3, column: 7 });
    });
  });
});
