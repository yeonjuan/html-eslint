const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-baseline");

const ruleTester = createRuleTester();

ruleTester.run("use-baseline", rule, {
  valid: [
    { code: `<div id="foo"></div>` },
    { code: `<svg></svg>` },
    { code: `<custom-element popovertarget="mypopover"></custom-element>` },
    { code: `<input type="number" />` },
    { code: `<input type="tel" />` },
    { code: `<a href="https://html-eslint.org"></a>` },
    { code: `<td></td>` },
    {
      code: `<div id="foo"></div>`,
      options: [{ available: "widely" }],
    },
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      options: [{ available: "newly" }],
    },
    // Dynamic binding is treated as expression - skips value check
    { code: `<input [type]="inputType" />` },
    // Custom elements are skipped
    { code: `<my-component [disabled]="true"></my-component>` },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          message: "Element '<slot>' is not a 2001 available baseline feature.",
          column: 1,
          endColumn: 14,
          line: 1,
        },
      ],
      options: [{ available: 2001 }],
    },
    {
      code: `<span slot="username">Jane Doe</span>`,
      errors: [
        {
          message: "Attribute 'slot' is not a 2019 available baseline feature.",
        },
      ],
      options: [{ available: 2019 }],
    },
  ],
});
