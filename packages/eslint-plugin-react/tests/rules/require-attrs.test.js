const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: "<img alt='text' />",
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
    // Custom components (capitalized) should not be checked
    {
      code: "<MyComponent />",
      options: [{ tag: "MyComponent", attr: "alt" }],
    },
    // expression value — attr is present, no error
    {
      code: "<img alt={someVar} />",
      options: [{ tag: "img", attr: "alt" }],
    },
    // expression value — skip value comparison
    {
      code: "<img alt={someVar} />",
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // static string literal in expression — check value (matches)
    {
      code: '<img alt={"text"} />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // static template literal in expression — check value (matches)
    {
      code: "<img alt={`text`} />",
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // template expression mixed with static text — skip value comparison
    {
      code: "<img alt={`text${someVar}`} />",
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
      options: [{ tag: "img", attr: "alt", value: "" }],
      output: '<img alt="" />',
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
      ],
    },
    {
      code: '<img class="image" />',
      options: [{ tag: "img", attr: "class", value: "img" }],
      output: '<img class="img" />',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Unexpected 'class' attribute value. 'img' is expected",
        },
      ],
    },
    // static string literal in expression — check value (mismatch)
    {
      code: '<img alt={"wrong"} />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
      output: '<img alt={"text"} />',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Unexpected 'alt' attribute value. 'text' is expected",
        },
      ],
    },
    // static template literal in expression — check value (mismatch)
    {
      code: "<img alt={`wrong`} />",
      options: [{ tag: "img", attr: "alt", value: "text" }],
      output: "<img alt={`text`} />",
      errors: [
        {
          line: 1,
          column: 6,
          message: "Unexpected 'alt' attribute value. 'text' is expected",
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
      output: null,
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
