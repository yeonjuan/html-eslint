const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-baseline");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("use-baseline", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
    {
      code: `<div id="foo"></div>`,
    },
    {
      code: `<svg></svg>`,
    },
    {
      code: `<custom-element popovertarget="mypopover"></custom-element>`,
    },
    {
      code: `<meta http-equiv="refresh" content="5">`,
    },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          message: "Element 'slot' is not a 2001 available baseline feature.",
          column: 1,
          endColumn: 6,
          line: 1,
        },
      ],
      options: [
        {
          available: 2001,
        },
      ],
    },
    {
      code: `<span slot="username">Jane Doe</span>`,
      errors: [
        {
          message: "Attribute 'slot' is not a 2019 available baseline feature.",
        },
      ],
      options: [
        {
          available: 2019,
        },
      ],
    },
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      errors: [
        {
          messageId: "notBaselineAttribute",
        },
        {
          messageId: "notBaselineAttribute",
        },
      ],
      options: [
        {
          available: 2019,
        },
      ],
    },
    {
      code: `<template shadowrootmode="open"></template>`,
      errors: [
        {
          message:
            "Attribute 'shadowrootmode' is not a widely available baseline feature.",
          column: 11,
          endColumn: 25,
          line: 1,
        },
      ],
    },
    {
      code: `<div contenteditable="plaintext-only"></div>`,
      errors: [
        {
          message:
            "Attribute 'contenteditable=\"plaintext-only\"' is not a widely available baseline feature.",
          column: 6,
          endColumn: 38,
          line: 1,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] use-baseline", rule, {
  valid: [
    {
      code: "html`<option></option>`;",
    },
  ],
  invalid: [
    {
      code: "html`<select size='2'></select>`;",
      errors: [
        {
          message:
            "Attribute 'size' is not a widely available baseline feature.",
          column: 14,
          endColumn: 18,
          line: 1,
        },
      ],
    },
  ],
});
