"use strict";

const parser = require("../lib");

describe("parser", () => {
  it("duplicate attributes", () => {
    const code = `
<html>
  <body>
    <img src="./image.png">
  </body>
</html>`;
    expect(parser.parseForESLint(code).ast).toMatchSnapshot();
  });
});
