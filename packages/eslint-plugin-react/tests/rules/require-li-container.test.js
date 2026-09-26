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
    {
      // Fragment is not a JSX element, so the walk finds no enclosing
      // element and the container can't be verified statically.
      code: `
<>
  <li>item</li>
</>
`,
    },
    {
      // <li> passed as a prop value, not as a child - the enclosing
      // JSXElement is the custom component itself, so it's lenient.
      code: `<List item={<li></li>} />`,
    },
    {
      // Explicit <Fragment> - same code path as a capitalized custom
      // component (name isn't statically resolvable to a real tag).
      code: `
<Fragment>
  <li>item</li>
</Fragment>
`,
    },
    {
      // Explicit <React.Fragment> - a JSXMemberExpression name, also
      // treated as an unresolvable custom element.
      code: `
<React.Fragment>
  <li>item</li>
</React.Fragment>
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
    {
      // Nested fragments are skipped by the walk, which lands on the
      // enclosing <div>.
      code: `
<div>
  <>
    <>
      <li>item</li>
    </>
  </>
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
