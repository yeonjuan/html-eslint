import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/use-baseline.js";

const ruleTester = createRuleTester();

ruleTester.run("use-baseline", rule, {
  valid: [
    { code: `<slot></slot>` },
    { code: `<div id="foo"></div>` },
    { code: `<svg></svg>` },
    { code: `<custom-element popovertarget="mypopover"></custom-element>` },
    { code: `<meta http-equiv="refresh" content="5" />` },
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
    { code: `<td rowspan="1"></td>` },
    { code: `<th rowspan="2"></th>` },
    // Svelte components should be skipped
    { code: `<CustomComponent popovertarget="mypopover"></CustomComponent>` },
    { code: `<my-component popovertarget="mypopover"></my-component>` },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          message: "Element '<slot>' is not a 2001 available baseline feature.",
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
      code: `<template shadowrootmode="open"></template>`,
      errors: [
        {
          message:
            "Attribute 'shadowrootmode' on '<template>' is not a widely available baseline feature.",
        },
      ],
    },
    {
      code: `<div contenteditable="plaintext-only"></div>`,
      errors: [
        {
          message:
            "Attribute 'contenteditable=\"plaintext-only\"' is not a widely available baseline feature.",
        },
      ],
    },
    {
      code: `<script type="module"></script>`,
      errors: [
        {
          message:
            "Attribute 'type=\"module\"' on '<script>' is not a 2017 available baseline feature.",
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
        },
      ],
    },
    {
      code: `<a href="sms:00000"></a>`,
      errors: [
        {
          message:
            "Attribute 'href=\"sms:00000\"' on '<a>' is not a widely available baseline feature.",
        },
      ],
    },
    {
      code: `<td rowspan="0"></td>`,
      errors: [
        {
          messageId: "notBaselineElementAttribute",
        },
      ],
    },
    {
      code: `<th rowspan="0"></th>`,
      errors: [
        {
          messageId: "notBaselineElementAttribute",
        },
      ],
    },
  ],
});
