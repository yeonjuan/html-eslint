"use strict";

const parser = require("../lib");

describe("parser", () => {
  it("duplicate attributes", () => {
    const code = `<div foo="foo1" foo="foo2">   </div>`;
    expect(parser.parseForESLint(code).ast).toMatchSnapshot();
  });
});
