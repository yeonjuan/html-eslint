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
    // Property binding ([property]="expr") - value is expression, skips value check
    { code: `<input [type]="inputType" />` },
    { code: `<button [disabled]="isDisabled">Click</button>` },
    { code: `<a [href]="url">Link</a>` },
    // Attribute binding ([attr.attr-key]="expr") - value is expression, skips value check
    { code: `<div [attr.aria-label]="label"></div>` },
    { code: `<span [attr.data-id]="itemId"></span>` },
    { code: `<input [attr.aria-describedby]="descId" />` },
    // Custom elements are skipped
    { code: `<my-component [disabled]="true"></my-component>` },

    {
      code: `@if (isLoggedIn) { <span>Welcome</span> } @else { <a href="/login">Login</a> }`,
    },
    {
      code: `@if (show) { <div class="container"><p>Hello</p></div> }`,
    },
    {
      code: `@for (item of items; track item.id) { <li>{{ item.name }}</li> } @empty { <p>No items</p> }`,
    },
    {
      code: `@switch (status) { @case ('active') { <span>Active</span> } @default { <span>Inactive</span> } }`,
    },
    {
      code: `@defer { <img src="hero.jpg" /> } @placeholder { <p>Loading...</p> }`,
    },
    {
      code: `@if (user) { <input [disabled]="!user.isAdmin" type="text" /> }`,
    },
    {
      code: `@for (item of items; track item.id) { <button (click)="select(item)">{{ item.label }}</button> }`,
    },
    {
      code: `@if (a) { @if (b) { <div><span>Nested</span></div> } }`,
    },
    {
      code: `@defer (on idle) { <section><h2>Deferred content</h2></section> } @loading { <p>Loading...</p> } @error { <p>Error occurred</p> }`,
    },
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
    {
      code: `@if (show) { <slot></slot> }`,
      errors: [
        {
          message: "Element '<slot>' is not a 2001 available baseline feature.",
        },
      ],
      options: [{ available: 2001 }],
    },
    {
      code: `@for (item of items; track item.id) { <slot>{{ item }}</slot> }`,
      errors: [
        {
          message: "Element '<slot>' is not a 2001 available baseline feature.",
        },
      ],
      options: [{ available: 2001 }],
    },
    {
      code: `@defer { <span slot="content">Deferred</span> }`,
      errors: [
        {
          message: "Attribute 'slot' is not a 2019 available baseline feature.",
        },
      ],
      options: [{ available: 2019 }],
    },
  ],
});
