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
    {
      code: `<script type="module"></script>`,
    },
    {
      code: `<slot></slot>`,
      options: [
        {
          available: "widely",
        },
      ],
    },
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      options: [
        {
          available: "newly",
        },
      ],
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
      code: `<SLOT></SLOT>`,
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
          available: "widely",
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
    {
      // upper case
      code: `<div contenteditable="PLAINTEXT-ONLY"></div>`,
      errors: [
        {
          message:
            "Attribute 'contenteditable=\"PLAINTEXT-ONLY\"' is not a widely available baseline feature.",
          column: 6,
          endColumn: 38,
          line: 1,
        },
      ],
    },
    {
      // trailing space
      code: `<div contenteditable="PLAINTEXT-ONLY "></div>`,
      errors: [
        {
          message:
            "Attribute 'contenteditable=\"PLAINTEXT-ONLY \"' is not a widely available baseline feature.",
          column: 6,
          endColumn: 39,
          line: 1,
        },
      ],
    },
    {
      code: `<script type="module"></script>`,
      errors: [
        {
          message:
            "Attribute 'type=\"module\"' is not a 2017 available baseline feature.",
        },
      ],
      options: [
        {
          available: 2017,
        },
      ],
    },
    {
      code: `<style blocking="render"></script>`,
      errors: [
        {
          message:
            "Attribute 'blocking' is not a widely available baseline feature.",
        },
      ],
      options: [
        {
          available: "widely",
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
    {
      code: "html`<select size='${1}'></select>`;",
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
