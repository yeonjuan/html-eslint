const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/classname-spacing");

const ruleTester = createRuleTester();

ruleTester.run("classname-spacing", rule, {
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
      code: '<button className=""></button>',
    },
    {
      code: "<button className></button>",
    },
    {
      code: '<button id=" foo "></button>',
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
      code: 'const x = classnames(" foo ")',
      options: [{ callees: ["clsx"] }],
    },
    {
      code: 'const x = classnames("foo", bar)',
      options: [{ callees: ["classnames"] }],
    },
  ],
  invalid: [
    {
      code: '<button className=" foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
    {
      code: '<button className="foo "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingEnd",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26,
        },
      ],
    },
    {
      code: '<button className=" foo "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
    {
      code: '<button className="  foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 22,
        },
      ],
    },
    {
      code: '<button className="foo  "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingEnd",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27,
        },
      ],
    },
    {
      code: '<button className="foo  bar"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25,
        },
      ],
    },
    {
      code: '<button className="foo   bar"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26,
        },
      ],
    },
    {
      code: '<button className="foo  bar  baz"></button>',
      output: '<button className="foo bar baz"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25,
        },
      ],
    },
    {
      code: '<button className="  foo  bar  "></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 22,
        },
      ],
    },
    {
      code: '<div className={" foo"}></div>',
      output: '<div className={"foo"}></div>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: "<div className={`foo `}></div>",
      output: "<div className={`foo`}></div>",
      errors: [
        {
          messageId: "extraSpacingEnd",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24,
        },
      ],
    },
    {
      code: "<div className={`foo  bar`}></div>",
      output: "<div className={`foo bar`}></div>",
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 23,
        },
      ],
    },
    {
      code: 'const x = clsx(" foo")',
      output: 'const x = clsx("foo")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 18,
        },
      ],
    },
    {
      code: 'const x = clsx("foo ")',
      output: 'const x = clsx("foo")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "extraSpacingEnd",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23,
        },
      ],
    },
    {
      code: 'const x = clsx("foo  bar")',
      output: 'const x = clsx("foo bar")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 22,
        },
      ],
    },
    {
      code: "const x = cn(`foo  bar`)",
      output: "const x = cn(`foo bar`)",
      options: [{ callees: ["cn"] }],
      errors: [
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 20,
        },
      ],
    },
    {
      code: 'const x = clsx(" foo", "bar  baz")',
      output: 'const x = clsx("foo", "bar baz")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 18,
        },
        {
          messageId: "extraSpacingBetween",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 30,
        },
      ],
    },
    {
      code: 'const x = clsx(condition && "bar  baz")',
      output: 'const x = clsx(condition && "bar baz")',
      options: [{ callees: ["clsx"] }],
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: '<div className={   "  foo " }></div>',
      output: '<div className={   "foo" }></div>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 23,
        },
      ],
    },
  ],
});
