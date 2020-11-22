const utils = require("../../lib/ast-converter/utils");

("use strict");

describe("utils", () => {
  describe("toType()", () => {
    test("Should normaliz nodeType", () => {
      expect(utils.toType("#text")).toBe("text");
    });

    test("Should convert `#document` to `Program`", () => {
      expect(utils.toType("#document")).toBe("Program");
    });
  });

  describe("toESLocation()", () => {
    test("Should convert `sourceCodeLocation` to es location format", () => {
      const sourceCodeLocation = {
        startLine: 5,
        startCol: 9,
        startOffset: 39,
        endLine: 5,
        endCol: 25,
        endOffset: 55,
      };
      expect(utils.toESLocation(sourceCodeLocation)).toEqual({
        range: [39, 55],
        start: 39,
        end: 55,
        loc: {
          start: {
            line: 5,
            column: 9,
          },
          end: {
            line: 5,
            column: 25,
          },
        },
      });
    });

    test("Shoud calculate location from childNodes", () => {
      const sourceCodeLocation = null;
      const childNodes = [
        {
          sourceCodeLocation: {
            startLine: 5,
            startCol: 9,
            startOffset: 39,
            endLine: 5,
            endCol: 25,
            endOffset: 55,
          },
        },
        {
          sourceCodeLocation: {
            startLine: 10,
            startCol: 18,
            startOffset: 78,
            endLine: 10,
            endCol: 50,
            endOffset: 110,
          },
        },
      ];
      expect(utils.toESLocation(sourceCodeLocation, childNodes)).toEqual({
        range: [39, 110],
        start: 39,
        end: 110,
        loc: {
          start: {
            line: 5,
            column: 9,
          },
          end: {
            line: 10,
            column: 50,
          },
        },
      });
    });
  });
});
