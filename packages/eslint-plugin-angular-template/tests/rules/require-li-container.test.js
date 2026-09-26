const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-li-container");

const ruleTester = createRuleTester();

ruleTester.run("require-li-container", rule, {
  valid: [
    {
      code: `
<ul>
  <li>item</li>
</ul>
`,
    },
    {
      code: `
<ol>
  <li>item</li>
</ol>
`,
    },
    {
      code: `
<menu>
  <li>item</li>
</menu>
`,
    },
    {
      code: `@for (item of items; track item.id) { <li>{{ item.name }}</li> }`,
    },
    {
      code: `
<ul>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  }
</ul>
`,
    },
    {
      // Angular components/directives (by convention, hyphenated selectors)
      // may render <ul>/<ol>/<menu> internally, so the real container
      // can't be verified statically.
      code: `
<app-custom-list>
  <li>item</li>
</app-custom-list>
`,
    },
    {
      code: `
<ng-container>
  <li>item</li>
</ng-container>
`,
    },
    {
      // <ng-template> content is deferred, not rendered in place, so the
      // real container can't be verified statically - same code path as
      // any other hyphenated (custom) element name.
      code: `
<ng-template>
  <li>item</li>
</ng-template>
`,
    },
    {
      // No enclosing element at all - the template root is <li> itself.
      code: `<li>item</li>`,
    },
    {
      code: `
@if (show) {
  <li>item</li>
}
`,
    },
  ],
  invalid: [
    {
      code: `
<div>
  <li>item</li>
</div>
`,
      errors: [
        {
          messageId: "invalid",
          line: 3,
          column: 3,
        },
      ],
    },
    {
      code: `
<div>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  }
</div>
`,
      errors: [
        {
          messageId: "invalid",
          line: 4,
          column: 5,
        },
      ],
    },
    {
      code: `
<div>
  @if (show) {
    <li>item</li>
  }
</div>
`,
      errors: [
        {
          messageId: "invalid",
          line: 4,
          column: 5,
        },
      ],
    },
    {
      // Nested control-flow blocks are skipped by the walk, which lands
      // on the enclosing <div>.
      code: `
<div>
  @for (item of items; track item.id) {
    @for (sub of item.subs; track sub.id) {
      <li>{{ sub.name }}</li>
    }
  }
</div>
`,
      errors: [
        {
          messageId: "invalid",
          line: 5,
          column: 7,
        },
      ],
    },
  ],
});
