const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: `<svg></svg>`,
    },
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
    },
    {
      code: `<svg viewBox></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
    {
      code: `<svg viewBox=""></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "",
        },
      ],
    },
    {
      code: `<img alt="image" src="/assets/image.png">`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<img alt="" src="/assets/image.png">`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<div></div>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<script></script>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<img/>`,
      options: [
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      output: '<img class="img"/>',
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'class' attribute on 'img' tag",
        },
      ],
    },
    {
      code: `<img class/>`,
      options: [
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      output: '<img class="img"/>',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Unexpected 'class' attribute value. 'img' is expected",
        },
      ],
    },
    {
      code: `<img class id="1"/>`,
      options: [
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      output: '<img class="img" id="1"/>',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Unexpected 'class' attribute value. 'img' is expected",
        },
      ],
    },
    {
      code: `<svg></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attribute on 'svg' tag",
        },
      ],
    },
    {
      code: `<svg></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      output: `<svg viewBox="0 0 100 100"></svg>`,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attribute on 'svg' tag",
        },
      ],
    },
    {
      code: `<svg class="foo"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      output: `<svg viewBox="0 0 100 100" class="foo"></svg>`,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attribute on 'svg' tag",
        },
      ],
    },
    {
      code: `<svg viewBox=""></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      output: `<svg viewBox="0 0 100 100"></svg>`,
      errors: [
        {
          line: 1,
          column: 6,
          endColumn: 16,
          message:
            "Unexpected 'viewBox' attribute value. '0 0 100 100' is expected",
        },
      ],
    },
    {
      code: `<svg viewBox></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      output: `<svg viewBox="0 0 100 100"></svg>`,
      errors: [
        {
          line: 1,
          column: 6,
          endColumn: 13,
          message:
            "Unexpected 'viewBox' attribute value. '0 0 100 100' is expected",
        },
      ],
    },
    {
      code: `<img/>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
      ],
    },
    {
      code: `<script></script>`,
      options: [
        {
          tag: "script",
          attr: "src",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'src' attribute on 'script' tag",
        },
      ],
    },
    {
      code: `<style type="txt/css"></style>`,
      options: [
        {
          tag: "style",
          attr: "type",
          value: "text/css",
        },
      ],
      output: `<style type="text/css"></style>`,
      errors: [
        {
          line: 1,
          column: 8,
          endColumn: 22,
          message: "Unexpected 'type' attribute value. 'text/css' is expected",
        },
      ],
    },
    {
      code: `<img class="image"/>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      output: `<img class="img"/>`,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
        {
          line: 1,
          column: 6,
          endColumn: 19,
          message: "Unexpected 'class' attribute value. 'img' is expected",
        },
      ],
    },
    // Test custom message option
    {
      code: `<img/>`,
      options: [
        {
          tag: "img",
          attr: "alt",
          message: "Image must have alt text for accessibility",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Image must have alt text for accessibility",
        },
      ],
    },
    {
      code: `<svg viewBox="wrong"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
          message: "SVG viewBox must be '0 0 100 100'",
        },
      ],
      output: `<svg viewBox="0 0 100 100"></svg>`,
      errors: [
        {
          line: 1,
          column: 6,
          endColumn: 21,
          message: "SVG viewBox must be '0 0 100 100'",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-attrs", rule, {
  valid: [
    {
      code: "html`<svg viewBox></svg>`",
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'html`<img class="image"/>`',
      options: [
        {
          tag: "img",
          attr: "alt",
        },
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      output: 'html`<img class="img"/>`',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Missing 'alt' attribute on 'img' tag",
        },
        {
          line: 1,
          column: 11,
          endColumn: 24,
          message: "Unexpected 'class' attribute value. 'img' is expected",
        },
      ],
    },
    // Test custom message option in template
    {
      code: "html`<div></div>`",
      options: [
        {
          tag: "div",
          attr: "role",
          message: "Div elements should have a role attribute",
        },
      ],
      errors: [
        {
          line: 1,
          column: 6,
          message: "Div elements should have a role attribute",
        },
      ],
    },
  ],
});

// Conditional require tests
ruleTester.run("[conditions] require-attrs", rule, {
  valid: [
    // Condition not met: require is skipped
    {
      code: `<input type="text" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
    // Condition met and require attr is present
    {
      code: `<input type="checkbox" aria-label="check me" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
    // kind: "present" — condition not met (attr absent)
    {
      code: `<img />`,
      options: [
        {
          tag: "img",
          attr: "alt",
          conditions: [{ attr: "src", kind: "present" }],
        },
      ],
    },
    // kind: "absent" — condition not met (attr present)
    {
      code: `<img src="/foo.png" />`,
      options: [
        {
          tag: "img",
          attr: "loading",
          conditions: [{ attr: "src", kind: "absent" }],
        },
      ],
    },
    // kind: "not-equal" — condition not met (value equals)
    {
      code: `<input type="text" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "not-equal", value: "text" }],
        },
      ],
    },
    // Multiple conditions — one not met (disabled is present, so "absent" fails), require skipped
    {
      code: `<input type="checkbox" disabled />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [
            { attr: "type", kind: "equal", value: "checkbox" },
            { attr: "disabled", kind: "absent" },
          ],
        },
      ],
    },
  ],
  invalid: [
    // Condition met, require attr missing — no value, no fix
    {
      code: `<input type="checkbox" />`,
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
    // Condition met, require attr missing — value provided, auto-fix inserts attr
    {
      code: `<input type="checkbox" />`,
      options: [
        {
          tag: "input",
          attr: "role",
          value: "checkbox",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
      output: `<input role="checkbox" type="checkbox" />`,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'role' attribute on 'input' tag",
        },
      ],
    },
    // kind: "present" — condition met, require missing — no fix
    {
      code: `<img src="/foo.png" />`,
      options: [
        {
          tag: "img",
          attr: "alt",
          conditions: [{ attr: "src", kind: "present" }],
        },
      ],
      output: null,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
      ],
    },
    // kind: "present" — condition met, value provided, auto-fix
    {
      code: `<img src="/foo.png" />`,
      options: [
        {
          tag: "img",
          attr: "alt",
          value: "",
          conditions: [{ attr: "src", kind: "present" }],
        },
      ],
      output: `<img alt="" src="/foo.png" />`,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attribute on 'img' tag",
        },
      ],
    },
    // kind: "absent" — condition met, require missing — no fix
    {
      code: `<img />`,
      options: [
        {
          tag: "img",
          attr: "aria-hidden",
          conditions: [{ attr: "src", kind: "absent" }],
        },
      ],
      output: null,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'aria-hidden' attribute on 'img' tag",
        },
      ],
    },
    // kind: "not-equal" — condition met, require missing — no fix
    {
      code: `<input type="checkbox" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "not-equal", value: "text" }],
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
    // All conditions met (AND logic), require missing — no fix
    {
      code: `<input type="checkbox" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [
            { attr: "type", kind: "equal", value: "checkbox" },
            { attr: "disabled", kind: "absent" },
          ],
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
    // Custom message — no fix
    {
      code: `<input type="checkbox" />`,
      options: [
        {
          tag: "input",
          attr: "aria-label",
          message: "Checkboxes must have an aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
      output: null,
      errors: [
        {
          line: 1,
          column: 1,
          message: "Checkboxes must have an aria-label",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template][conditions] require-attrs", rule, {
  valid: [
    // Condition not met: require skipped
    {
      code: 'html`<input type="text" />`',
      options: [
        {
          tag: "input",
          attr: "aria-label",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
    },
    // Condition met and require attr present
    {
      code: 'html`<input type="checkbox" aria-label="check me" />`',
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
    // Condition met, attr missing — no fix
    {
      code: 'html`<input type="checkbox" />`',
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
          column: 6,
          message: "Missing 'aria-label' attribute on 'input' tag",
        },
      ],
    },
    // Condition met, value provided — auto-fix
    {
      code: 'html`<input type="checkbox" />`',
      options: [
        {
          tag: "input",
          attr: "role",
          value: "checkbox",
          conditions: [{ attr: "type", kind: "equal", value: "checkbox" }],
        },
      ],
      output: 'html`<input role="checkbox" type="checkbox" />`',
      errors: [
        {
          line: 1,
          column: 6,
          message: "Missing 'role' attribute on 'input' tag",
        },
      ],
    },
  ],
});
