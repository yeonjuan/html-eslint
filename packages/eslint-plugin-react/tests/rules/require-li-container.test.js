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
      code: `
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.label}</li>
  ))}
</ul>
`,
    },
    {
      // Custom components may render <ul>/<ol>/<menu> internally, so the
      // real container can't be verified statically.
      code: `
<CustomList>
  <li>item</li>
</CustomList>
`,
    },
    {
      code: `
<foo.Bar>
  <li>item</li>
</foo.Bar>
`,
    },
    {
      // No enclosing JSX element - this is meant to be composed into a
      // list from outside (e.g. via children).
      code: `
function ListItem({ children }) {
  return <li>{children}</li>;
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
  {items.map((item) => (
    <li key={item.id}>{item.label}</li>
  ))}
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
  <>{show && <li>item</li>}</>
</div>
`,
      errors: [
        {
          messageId: "invalid",
          line: 3,
          column: 14,
        },
      ],
    },
  ],
});
