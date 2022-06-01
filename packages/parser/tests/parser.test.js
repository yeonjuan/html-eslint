"use strict";

const parserForEslint = require("../lib");

describe("parser", () => {
  const parser = {
    parse(code) {
      return parserForEslint.parseForESLint(code).ast;
    },
  };

  it("empty html - single line", () => {
    const code = `<html></html>`;
    const program = parser.parse(code);
    const [html] = program.childNodes;
  
    expect(html).toMatchPos({
      range: [0, 13],
      loc: [
        { line: 1, column: 0 },
        { line: 1, column: 13 }
      ]
    });

    expect(html.startTag).toMatchPos({
      range: [0, 6],
      loc: [
        {line: 1, column: 0 },
        {line: 1, column: 6 }
      ],
    });
  
    expect(html.endTag).toMatchPos({
      range: [6, 13],
      loc: [
        {line: 1, column: 6 },
        {line: 1, column: 13 }
      ],
    });
  });


  it("empty html - multiline", () => {
    const code = `<html>
</html>`;
    const program = parser.parse(code);
    const [html] = program.childNodes;
  
    expect(html).toMatchPos({
      range: [0, 14],
      loc: [
        { line: 1, column: 0 },
        { line: 2, column: 7 }
      ]
    });

    expect(html.startTag).toMatchPos({
      range: [0, 6],
      loc: [
        {line: 1, column: 0 },
        {line: 1, column: 6 }
      ],
    });
  
    expect(html.endTag).toMatchPos({
      range: [7, 14],
      loc: [
        {line: 2, column: 0 },
        {line: 2, column: 7 }
      ],
    });
  });

  it("div - multiline", () => {
    const code = `<div>
    content
</div>`;
    const program = parser.parse(code);
    const [div] = program.childNodes;
  
    expect(div).toMatchPos({
      range: [0, 24],
      loc: [
        { line: 1, column: 0 },
        { line: 3, column: 6 }
      ]
    });

    expect(div.startTag).toMatchPos({
      range: [0, 5],
      loc: [
        {line: 1, column: 0 },
        {line: 1, column: 5 }
      ],
    });
  
    expect(div.endTag).toMatchPos({
      range: [18, 24],
      loc: [
        {line: 3, column: 0 },
        {line: 3, column: 6 }
      ],
    });

    const [text] = div.childNodes;
    expect(text).toMatchPos({
      range: [5, 18],
      loc: [
        {line: 1, column: 5 },
        {line: 3, column: 0 }
      ]
    });
  
    const [,line] = text.lineNodes;
    expect(line).toMatchPos({
      range: [6, 17],
      loc: [
        { line: 2, column: 0 },
        { line: 2, column: 11 }
      ]
    })
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
