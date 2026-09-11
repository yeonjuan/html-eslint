const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: '<img alt="text" />',
      options: [{ tag: "img", attr: "alt" }],
    },
    {
      code: '<svg viewBox="0 0 100 100"></svg>',
      options: [{ tag: "svg", attr: "viewBox", value: "0 0 100 100" }],
    },
    {
      code: "<div></div>",
      options: [{ tag: "img", attr: "alt" }],
    },
    // Custom elements with dashes should be ignored
    {
      code: '<custom-el data-x="1"></custom-el>',
      options: [{ tag: "custom-el", attr: "data-x" }],
    },
    // bound attribute — attr is present, no error
    {
      code: '<input [type]="inputType" />',
      options: [{ tag: "input", attr: "type" }],
    },
    // bound attribute — skip value comparison
    {
      code: '<img [alt]="someVar" />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // Condition not met: require skipped
    {
      code: '<input type="text" />',
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "<img />",
      options: [{ tag: "img", attr: "alt" }],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
      ],
    },
    {
      code: "<img />",
      options: [
        { tag: "img", attr: "alt", message: "Images require alt text" },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Images require alt text",
        },
      ],
    },
    // Condition met, attr missing
    {
      code: '<input type="checkbox" />',
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'aria-label' attribute on 'input' tag",
        },
      ],
    },
  ],
});
