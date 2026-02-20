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
      code: '<button className={someVar}></button>',
    },
    {
      code: '<Button className="foo"></Button>',
    },
    {
      code: '<custom-element className="foo"></custom-element>',
    },
  ],
  invalid: [
    {
      code: '<button className=" foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: '<button className="foo "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingEnd",
        },
      ],
    },
    {
      code: '<button className=" foo "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: '<button className="  foo"></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: '<button className="foo  "></button>',
      output: '<button className="foo"></button>',
      errors: [
        {
          messageId: "extraSpacingEnd",
        },
      ],
    },
    {
      code: '<button className="foo  bar"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: '<button className="foo   bar"></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: '<button className="foo  bar  baz"></button>',
      output: '<button className="foo bar baz"></button>',
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: '<button className="  foo  bar  "></button>',
      output: '<button className="foo bar"></button>',
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: '<div className={" foo"}></div>',
      output: '<div className={"foo"}></div>',
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: '<div className={`foo `}></div>',
      output: '<div className={`foo`}></div>',
      errors: [
        {
          messageId: "extraSpacingEnd",
        },
      ],
    },
    {
      code: '<div className={`foo  bar`}></div>',
      output: '<div className={`foo bar`}></div>',
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
  ],
});
