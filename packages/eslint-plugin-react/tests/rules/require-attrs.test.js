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
    // value: true — bare attribute and {true}
    {
      code: "<input disabled />",
      options: [{ tag: "input", attr: "disabled", value: true }],
    },
    {
      code: "<input disabled={true} />",
      options: [{ tag: "input", attr: "disabled", value: true }],
    },
    // value: false — {false}
    {
      code: "<input disabled={false} />",
      options: [{ tag: "input", attr: "disabled", value: false }],
    },
    // dynamic value — skip boolean comparison
    {
      code: "<input disabled={someVar} />",
      options: [{ tag: "input", attr: "disabled", value: true }],
    },
    // dynamic condition value cannot be resolved — skipped
    {
      code: "<input type={someVar} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "not-equal", value: "checkbox" }],
        },
      ],
    },
    // spread may provide the attr — unknown, so skipped
    {
      code: "<img {...props} />",
      options: [{ tag: "img", attr: "alt" }],
    },
    {
      code: "<img {...props} />",
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // spread after the attr may override its value — skipped
    {
      code: '<img alt="wrong" {...props} />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // only the last spread matters
    {
      code: '<img {...a} alt="wrong" {...b} />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // attr written after the last spread wins — value matches
    {
      code: '<img {...props} alt="text" />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // condition attr cannot be resolved through the spread — skipped
    {
      code: "<input {...props} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
    {
      code: "<input {...props} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "absent" }],
        },
      ],
    },
    {
      code: '<input type="checkbox" {...props} />',
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
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
    // value: true — missing attribute is fixed to the bare form
    {
      code: "<input />",
      options: [{ tag: "input", attr: "disabled", value: true }],
      output: "<input disabled />",
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'disabled' attribute on 'input' tag",
        },
      ],
    },
    // value: false — missing attribute is fixed to {false}
    {
      code: "<input />",
      options: [{ tag: "input", attr: "disabled", value: false }],
      output: "<input disabled={false} />",
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'disabled' attribute on 'input' tag",
        },
      ],
    },
    {
      code: "<input disabled={false} />",
      options: [{ tag: "input", attr: "disabled", value: true }],
      output: "<input disabled={true} />",
      errors: [
        {
          line: 1,
          column: 8,
          message: "Unexpected 'disabled' attribute value. 'true' is expected",
        },
      ],
    },
    {
      code: "<input disabled={true} />",
      options: [{ tag: "input", attr: "disabled", value: false }],
      output: "<input disabled={false} />",
      errors: [
        {
          line: 1,
          column: 8,
          message: "Unexpected 'disabled' attribute value. 'false' is expected",
        },
      ],
    },
    // bare attribute is true, so {false} is added
    {
      code: "<input disabled />",
      options: [{ tag: "input", attr: "disabled", value: false }],
      output: "<input disabled={false} />",
      errors: [
        {
          line: 1,
          column: 8,
          message: "Unexpected 'disabled' attribute value. 'false' is expected",
        },
      ],
    },
    // a string value is not a boolean — reported without a fix
    {
      code: '<input disabled="true" />',
      options: [{ tag: "input", attr: "disabled", value: true }],
      output: null,
      errors: [
        {
          line: 1,
          column: 8,
          message: "Unexpected 'disabled' attribute value. 'true' is expected",
        },
      ],
    },
    // a boolean value cannot be rewritten into a string — no fix
    {
      code: "<input disabled={true} />",
      options: [{ tag: "input", attr: "disabled", value: "x" }],
      output: null,
      errors: [
        {
          line: 1,
          column: 8,
          message: "Unexpected 'disabled' attribute value. 'x' is expected",
        },
      ],
    },
    // static condition value in an expression is resolved
    {
      code: '<input type={"checkbox"} />',
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
    // attr written after the last spread wins — value mismatch reported
    {
      code: '<img {...props} alt="wrong" />',
      options: [{ tag: "img", attr: "alt", value: "text" }],
      output: '<img {...props} alt="text" />',
      errors: [
        {
          line: 1,
          column: 17,
          message: "Unexpected 'alt' attribute value. 'text' is expected",
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
