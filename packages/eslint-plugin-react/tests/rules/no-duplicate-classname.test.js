const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-classname");

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-classname", rule, {
  valid: [
    {
      code: '<button className="foo"></button>',
    },
    {
      code: '<button className="foo bar"></button>',
    },
    {
      code: '<button className="foo bar baz"></button>',
    },
    {
      code: '<button className="foo foofoo"></button>',
    },
    {
      code: '<button className=""></button>',
    },
    {
      code: "<button className></button>",
    },
    {
      code: '<button id="foo foo"></button>',
    },
    {
      code: "<button className={someVar}></button>",
    },
    {
      code: '<Button className="foo"></Button>',
    },
    {
      code: '<custom-element className="foo"></custom-element>',
    },
    {
      code: "<Button className={`foo ${bar} baz`}/>",
    },
    {
      code: 'const x = clsx("foo")',
      options: [{ callees: ["clsx"] }],
    },
    {
      code: 'const x = cn("foo bar")',
      options: [{ callees: ["cn"] }],
    },
    {
      code: 'const x = classnames("foo bar")',
      options: [{ callees: ["clsx"] }],
    },
    {
      code: 'const x = classnames("foo", bar, "baz")',
      options: [{ callees: ["classnames"] }],
    },
  ],
  invalid: [
    // JSXAttribute with Literal
    {
      code: '<button className="foo foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 27,
        },
      ],
    },
    {
      code: '<button className="foo   foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: '<button className="foo bar foo"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: '<button className="foo foo bar"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: '<button className=" foo foo bar "></button>',
      output: '<button className=" foo bar "></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    // JSXAttribute with JSXExpressionContainer containing Literal
    {
      code: '<button className={"foo foo"}></button>',
      output: '<button className={"foo"}></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: '<button className={"foo bar foo"}></button>',
      output: '<button className={"foo bar"}></button>',
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    // JSXAttribute with JSXExpressionContainer containing TemplateLiteral
    {
      code: "<button className={`foo foo`}></button>",
      output: "<button className={`foo`}></button>",
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: "<button className={`foo bar foo`}></button>",
      output: "<button className={`foo bar`}></button>",
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    // CallExpression with callees option
    {
      code: 'const x = clsx("foo foo")',
      output: 'const x = clsx("foo")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: 'const x = cn("foo bar foo")',
      output: 'const x = cn("foo bar")',
      options: [{ callees: ["cn"] }],
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: 'const x = classnames("foo foo bar")',
      output: 'const x = classnames("foo bar")',
      options: [{ callees: ["classnames"] }],
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    // CallExpression with TemplateLiteral
    {
      code: "const x = clsx(`foo foo`)",
      output: "const x = clsx(`foo`)",
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    // CallExpression with LogicalExpression
    {
      code: 'const x = clsx(condition && "foo foo")',
      output: 'const x = clsx(condition && "foo")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: 'const x = clsx(condition ? "foo foo" : "bar bar")',
      output: 'const x = clsx(condition ? "foo" : "bar")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "duplicateClass",
          data: {
            class: "foo",
          },
        },
        {
          messageId: "duplicateClass",
          data: {
            class: "bar",
          },
        },
      ],
    },
  ],
});
