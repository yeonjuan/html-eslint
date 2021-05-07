"use strict";

const parserForEslint = require("../lib");

describe("parser-template", () => {
  const parser = {
    parse(code) {
      return parserForEslint.parseForESLint(code).ast;
    },
  };

  it("template", () => {
    const code = `
    <html>
    <body>
      <template>
        <details>
        </details>
      </template>
    </body>
  </html>`;
    expect(parser.parse(code)).toMatchSnapshot();
  });
});
