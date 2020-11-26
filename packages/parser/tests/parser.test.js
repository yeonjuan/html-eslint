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
});
