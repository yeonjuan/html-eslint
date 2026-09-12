import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/require-attrs.js";

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
    // shorthand attribute — attr is present, no error
    {
      code: "<img {alt} />",
      options: [{ tag: "img", attr: "alt" }],
    },
    // shorthand attribute value is dynamic — skip value comparison
    {
      code: "<img {alt} />",
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // dynamic condition value cannot be resolved — skipped
    {
      code: "<input {type} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
    {
      code: "<input {type} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "not-equal", value: "checkbox" }],
        },
      ],
    },
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
      options: [{ tag: "img", attr: "alt", value: "text" }],
    },
    // spread after the attr may override its value — skipped
    {
      code: '<img alt="wrong" {...props} />',
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
          conditions: [{ attr: "type", kind: "absent" }],
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
    // shorthand attribute satisfies a `present` condition
    {
      code: "<input {type} />",
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "present" }],
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
