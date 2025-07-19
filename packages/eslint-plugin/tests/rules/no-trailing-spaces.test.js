const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-trailing-spaces");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-tailing-spaces", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: "<div></div>\n",
    },
    {
      code: "<div></div>\r\n",
    },
    {
      code: "<div>\n  text\n  </div>\n",
    },
  ],
  invalid: [
    {
      code: "<div></div>  ",
      output: "<div></div>",
      errors: [
        {
          messageId: "trailingSpace",
          column: 12,
          endColumn: 14,
          line: 1,
        },
      ],
    },
    {
      code: "<div></div>  \n",
      output: "<div></div>\n",
      errors: [
        {
          messageId: "trailingSpace",
          column: 12,
          endColumn: 14,
          line: 1,
        },
      ],
    },
    {
      code: "<div>  \n  text\n  </div>",
      output: "<div>\n  text\n  </div>",
      errors: [
        {
          messageId: "trailingSpace",
          column: 6,
          endColumn: 8,
          line: 1,
        },
      ],
    },
    {
      code: `<div>${"  "}
    text
</div>${"  "}
`,
      output: `<div>
    text
</div>
`,
      errors: [
        {
          messageId: "trailingSpace",
        },
        {
          messageId: "trailingSpace",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-tailing-spaces", rule, {
  valid: [
    {
      code: `html\`<div>
      \${(() => {
        return ""      \t\t
      })()}
</div>\``,
    },
    {
      code: `html\`<div>
      \${(() => {
    
      })()      }
</div>\``,
    },
    {
      code: `  
html\`<div>
</div>\``,
    },
    {
      code: `  
/* html */\`<div>
</div>\``,
    },
  ],
  invalid: [
    {
      code: `  
html\`<div>  
</div>\``,
      output: `  
html\`<div>
</div>\``,
      errors: [
        {
          messageId: "trailingSpace",
        },
      ],
    },
    {
      code: "html`<div>  \n  text\n  </div>`",
      output: "html`<div>\n  text\n  </div>`",
      errors: [
        {
          messageId: "trailingSpace",
          line: 1,
          column: 11,
          endColumn: 13,
        },
      ],
    },
    {
      code: "html`<div>\n  text\n  </div>   `",
      output: "html`<div>\n  text\n  </div>`",
      errors: [
        {
          messageId: "trailingSpace",
          line: 3,
          column: 9,
          endColumn: 12,
        },
      ],
    },
    {
      code: `html\`<div id=\${foo}   
>
text
</div>\``,
      output: `html\`<div id=\${foo}
>
text
</div>\``,
      errors: [
        {
          messageId: "trailingSpace",
          line: 1,
          column: 20,
          endColumn: 23,
        },
      ],
    },
    {
      code: `
html\`<div id=\${foo}   
>
text
</div>\``,
      output: `
html\`<div id=\${foo}
>
text
</div>\``,
      errors: [
        {
          messageId: "trailingSpace",
          line: 2,
          column: 20,
          endColumn: 23,
        },
      ],
    },
    {
      code: `
/* html */\`<div id=\${foo}   
>
text
</div>\``,
      output: `
/* html */\`<div id=\${foo}
>
text
</div>\``,
      errors: [
        {
          messageId: "trailingSpace",
          line: 2,
          column: 26,
          endColumn: 29,
        },
      ],
    },
  ],
});
