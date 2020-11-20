"use strict";

const createParser = require("../lib/parser");

describe("parser", () => {
  let parser = null;

  beforeEach(() => {
    parser = createParser();
  });

  it("parse", () => {
    const code = "<html></html>";
    expect(() => parser.parse(code)).not.toThrow();
  });

  it("base", () => {
    const code = "<html></html>";
    expect(parser.parse(code)).toMatchSnapshot();
  });
});
