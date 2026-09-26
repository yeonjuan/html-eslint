import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/require-li-container.js";

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
      code: `
<ul>
  {#each items as item}
    <li>{item.label}</li>
  {/each}
</ul>
`,
    },
    {
      // Svelte components may render <ul>/<ol>/<menu> internally, so the
      // real container can't be verified statically.
      code: `
<CustomList>
  <li>item</li>
</CustomList>
`,
    },
    {
      code: `
<svelte:component this={Tag}>
  <li>item</li>
</svelte:component>
`,
    },
    {
      // No enclosing element at all - the component root is <li> itself.
      code: `<li>item</li>`,
    },
    {
      code: `
{#if show}
  <li>item</li>
{/if}
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
  {#each items as item}
    <li>{item.label}</li>
  {/each}
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
  {#if show}
    <li>item</li>
  {/if}
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
      // Nested {#each} blocks are skipped by the walk, which lands on
      // the enclosing <div>.
      code: `
<div>
  {#each items as item}
    {#each item.subs as sub}
      <li>{sub.label}</li>
    {/each}
  {/each}
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
