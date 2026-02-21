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
  ],
  invalid: [
    {
      code: '<button className=" foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 20,
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
          column: 24,
          endLine: 1,
          endColumn: 25,
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
          column: 19,
          endLine: 1,
          endColumn: 20,
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
          column: 19,
          endLine: 1,
          endColumn: 21,
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
          column: 24,
          endLine: 1,
          endColumn: 26,
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
          column: 22,
          endLine: 1,
          endColumn: 24,
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
          column: 22,
          endLine: 1,
          endColumn: 25,
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
          column: 22,
          endLine: 1,
          endColumn: 24,
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
          column: 19,
          endLine: 1,
          endColumn: 21,
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
          column: 16,
          endLine: 1,
          endColumn: 17,
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
          column: 19,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
  ],
});
