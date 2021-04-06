"use strict";

const parserForEslint = require("../lib");

describe("parser", () => {
  const parser = {
    parse(code) {
      return parserForEslint.parseForESLint(code).ast;
    },
  };

  it("parse", () => {
    const code = "<html></html>";
    expect(() => parser.parse(code)).not.toThrow();
  });

  it("base", () => {
    const code = `
  <html>
  </html>`;
    expect(parser.parse(code)).toMatchSnapshot();
  });

  it("DOCTYPE", () => {
    const code = `
  <!DOCTYPE HTML>
  <html>
  </html>`;
    expect(parser.parse(code)).toMatchSnapshot();
  });

  it("attr", () => {
    const code = `
<div attr="foo">
</div>
`;
    expect(parser.parse(code)).toMatchSnapshot();
  });

  it("comment", () => {
    const code = `
<div>
<!-- comment -->
</div>
`;
    expect(parser.parse(code)).toMatchSnapshot();
  });

  it("comment multiline", () => {
    const code = `
<!--
  comment
-->
`;
    expect(parser.parse(code)).toMatchSnapshot();
  });

  it("no opening tag", () => {
    const code = `<!DOCTYPE html>
    <html lang="en">
    </head>
    <body>
    
      <table>
        <tr>
          <td>Table 1</td>
        </tr>
      </table>
    
      <table>
        <tr>
          <td>Table 2</td>
        </tr>
      </table>
    
    </body>
    </html>`;
    expect(parser.parse(code)).toMatchSnapshot();
  });
});
