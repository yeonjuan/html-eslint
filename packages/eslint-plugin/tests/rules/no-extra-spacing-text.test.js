const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-extra-spacing-text");

function errorsAt(...positions) {
  return positions.map((input) => {
    const [line, column, length] = input;
    if (input.length === 3) {
      return {
        messageId: `unexpected`,
        line,
        column,
        endLine: line,
        endColumn: column + length,
      };
    } else {
      const [line, column, endLine, endColumn] = input;
      return {
        messageId: `unexpected`,
        line,
        column,
        endLine,
        endColumn,
      };
    }
  });
}

const ruleTester = createRuleTester();

ruleTester.run("no-extra-spacing-text", rule, {
  valid: [
    {
      code: `<div> foo </div>`,
    },

    {
      code: `<div> foo bar </div>`,
    },

    {
      code: `
\t  <div>
    \t  <div>
      foo
          bar
    \t\t  </div>
\t  </div>
`,
    },

    {
      code: `<pre>   foo\t\t\tbar   </pre><script>   const   foo   =   'bar'   </script><style>   .foo   {   bar   }   </style>`,
      options: [
        {
          skip: [`pre`],
        },
      ],
    },

    {
      code: `
<div   foo   =   "bar">
  Only short whitespace here.

  <pre>    Any    kind    of   whitespace    here!    </pre>
</div>
`,
      options: [
        {
          skip: [`pre`],
        },
      ],
    },
  ],

  invalid: [
    {
      code: `foo   bar   `,
      output: `foo bar `,
      errors: errorsAt([1, 4, 3], [1, 10, 3]),
    },

    {
      code: `<div>\tfoo	\t</div>`,
      output: `<div> foo </div>`,
      errors: errorsAt([1, 6, 1], [1, 10, 2]),
    },

    {
      code: `<div>  foo   </div>`,
      output: `<div> foo </div>`,
      errors: errorsAt([1, 6, 2], [1, 11, 3]),
    },

    {
      code: `<div>foo \n</div>`,
      output: `<div>foo\n</div>`,
      errors: errorsAt([1, 9, 2, 1]),
    },

    {
      code: `<div>foo\t\n</div>`,
      output: `<div>foo\n</div>`,
      errors: errorsAt([1, 9, 2, 1]),
    },

    {
      code: `<div>\n\tfoo \n</div> \n<div>\n\tbar\t\n</div>`,
      output: `<div>\n\tfoo\n</div>\n<div>\n\tbar\n</div>`,
      errors: errorsAt([2, 5, 3, 1], [3, 7, 4, 1], [5, 5, 6, 1]),
    },

    {
      code: `
    <div>	\t\tfoo	\t\t</div>
`,
      output: `
    <div> foo </div>
`,
      errors: errorsAt([2, 10, 3], [2, 16, 3]),
    },

    {
      code: `
<div>
  foo     bar     
</div>
`,
      output: `
<div>
  foo bar
</div>
`,
      errors: errorsAt([3, 6, 5], [3, 14, 4, 1]),
    },

    {
      code: `\n\n    <div>   <a>   <!--   foo   bar   -->   </a>   </div>\n\n`,
      output: `\n\n    <div> <a> <!-- foo bar --> </a> </div>\n\n`,
      errors: errorsAt(
        [3, 10, 3],
        [3, 16, 3],
        [3, 23, 3],
        [3, 29, 3],
        [3, 35, 3],
        [3, 41, 3],
        [3, 48, 3]
      ),
    },
  ],
});
