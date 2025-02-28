const { parse } = require("../lib/template-syntax-parser");
/**
 * @typedef {import("@html-eslint/types").Range} Range
 * @typedef {import("../lib/types").TemplateSyntaxParserConfig} TemplateSyntaxParserConfig
 */

const HANDLEBAR = {
  syntax: {
    "{{{": "}}}",
    "{{": "}}",
  },
};
const ERB = {
  syntax: {
    "<%": " %>",
  },
};

describe("basic", () => {
  /**
   * @type {[string, TemplateSyntaxParserConfig, Range[]][]}
   */
  const TEST_CASES = [
    ["", HANDLEBAR, []],
    ["<div></div>", HANDLEBAR, []],
    ["{{  ", HANDLEBAR, []],
    ["{{value}}", HANDLEBAR, [[0, 9]]],
    [
      "{{value}} {{{value}}}",
      HANDLEBAR,
      [
        [0, 9],
        [10, 21],
      ],
    ],
    [
      "<div><% hello %></div><% hello %>",
      ERB,
      [
        [5, 16],
        [22, 33],
      ],
    ],
    [
      "<div>{{ {{ }} }}",
      {
        syntax: HANDLEBAR.syntax,
        skipRanges: [[8, 13]],
      },
      [[5, 16]],
    ],
  ];
  test.each(TEST_CASES)("parse(%s, %o)", (code, config, expected) => {
    expect(
      parse(code, config).syntax.map((s) => [s.open[0], s.close[1]])
    ).toStrictEqual(expected);
  });
});

describe("error", () => {
  test("nested", () => {
    expect(() => parse("{{{ {{ }} }}}", HANDLEBAR)).toThrowError();
  });
  test("unclosed", () => {
    expect(() => parse("{{{ {{", HANDLEBAR)).toThrowError();
  });
});
