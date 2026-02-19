const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-baseline");

const ruleTester = createRuleTester();

ruleTester.run("use-baseline", rule, {
  valid: [
    { code: `<slot></slot>` },
    { code: `<div id="foo"></div>` },
    { code: `<svg></svg>` },
    { code: `<custom-element popovertarget="mypopover"></custom-element>` },
    { code: `<meta httpEquiv="refresh" content="5" />` },
    { code: `<script type="module"></script>` },
    {
      code: `<slot></slot>`,
      options: [{ available: "widely" }],
    },
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      options: [{ available: "newly" }],
    },
    { code: `<input type="number" />` },
    { code: `<input type="unknown" />` },
    { code: `<input type="tel" />` },
    { code: `<a href="https://html-eslint.org"></a>` },
    { code: `<td></td>` },
    { code: `<td rowSpan={1}></td>` },
    { code: `<th rowSpan={2}></th>` },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          message: "Element '<slot>' is not a 2001 available baseline feature.",
          column: 1,
          endColumn: 7,
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
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      errors: [
        { messageId: "notBaselineElementAttribute" },
        { messageId: "notBaselineElementAttribute" },
      ],
      options: [{ available: "widely" }],
    },
    {
      code: `<template shadowRootMode="open"></template>`,
      errors: [
        {
          message:
            "Attribute 'shadowRootMode' on '<template>' is not a widely available baseline feature.",
          column: 11,
          endColumn: 25,
          line: 1,
        },
      ],
    },
    {
      code: `<div contentEditable="plaintext-only"></div>`,
      errors: [
        {
          message:
            "Attribute 'contentEditable=\"plaintext-only\"' is not a widely available baseline feature.",
          column: 22,
          endColumn: 38,
          line: 1,
        },
      ],
    },
    {
      code: `<script type="module"></script>`,
      errors: [
        {
          message:
            "Attribute 'type=\"module\"' on '<script>' is not a 2017 available baseline feature.",
          column: 14,
          endColumn: 22,
        },
      ],
      options: [{ available: 2017 }],
    },
    {
      code: `<style blocking="render"></style>`,
      errors: [
        {
          message:
            "Attribute 'blocking' on '<style>' is not a widely available baseline feature.",
          column: 8,
          endColumn: 16,
        },
      ],
      options: [{ available: "widely" }],
    },
    {
      code: `<input type="week" />`,
      errors: [
        {
          message:
            "Attribute 'type=\"week\"' on '<input>' is not a widely available baseline feature.",
          column: 13,
          endColumn: 19,
        },
      ],
    },
    {
      code: `<a href="sms:00000"></a>`,
      errors: [
        {
          message:
            "Attribute 'href=\"sms:00000\"' on '<a>' is not a widely available baseline feature.",
          column: 9,
          endColumn: 20,
        },
      ],
    },
    {
      code: `<td rowSpan={0}></td>`,
      errors: [
        {
          messageId: "notBaselineElementAttribute",
        },
      ],
    },
    {
      code: `<th rowSpan={0}></th>`,
      errors: [
        {
          messageId: "notBaselineElementAttribute",
        },
      ],
    },
  ],
});
