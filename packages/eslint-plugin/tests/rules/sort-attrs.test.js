const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/sort-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("sort-attrs", rule, {
  valid: [
    {
      code: '<div a="1"></div>',
    },
    {
      code: '<input autocomplete="foo" checked />',
    },
    {
      code: '<input id="foo" type="checkbox" autocomplete="bar" checked />',
    },
    {
      code: "<script type='module' src='https://scripts.js'></script>",
    },
    {
      code: '<style type="text/css" media="all and (max-width: 500px)"',
    },
  ],
  invalid: [
    {
      code: "<script src='https://scripts.js' type='module'></script>",
      output: "<script type='module' src='https://scripts.js'></script>",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<style media="all and (max-width: 500px)" type="text/css"></style>',
      output:
        '<style type="text/css" media="all and (max-width: 500px)"></style>',
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<input autocomplete="bar" checked id="foo" type="checkbox" />',
      output: '<input id="foo" type="checkbox" autocomplete="bar" checked />',
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: '<input checked autocomplete="foo" />',
      output: '<input autocomplete="foo" checked />',
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: '<div b="2" a="1"></div>',
      output: '<div a="1" b="2"></div>',
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: '<div b="2" a="1" c="3"></div>',
      output: '<div a="1" b="2" c="3"></div>',
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        <div
          b="2"
          a="1"
          c="3"
        >
        </div>
      `,
      output: `
        <div
          a="1"
          b="2"
          c="3"
        >
        </div>
      `,
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        <div
          b
          a="1"
          c
        >
        </div>
      `,
      output: `
        <div
          a="1"
          b
          c
        >
        </div>
      `,
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        <div
          b
               a="1"
            c
        >
        </div>
      `,
      output: `
        <div
          a="1"
               b
            c
        >
        </div>
      `,
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        <div
          b
          id="foo"
          a="1"
          c
        >
        </div>
      `,
      output: `
        <div
          id="foo"
          a="1"
          b
          c
        >
        </div>
      `,
      options: [
        {
          priority: ["id"],
        },
      ],
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        <div
          style="background:red"
          b
          id="foo"
          a="1"
          c
        >
        </div>
      `,
      output: `
        <div
          id="foo"
          style="background:red"
          a="1"
          b
          c
        >
        </div>
      `,
      options: [
        {
          priority: ["id", "style"],
        },
      ],
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] sort-attrs", rule, {
  valid: [
    {
      code: 'html`<input id="foo" type="checkbox" autocomplete="bar" checked />`',
    },
  ],
  invalid: [
    {
      code: `
        html\`<div
          style="background:red"
          b
          id="foo"
          a="1"
          c
        >
        </div>\`
      `,
      output: `
        html\`<div
          id="foo"
          style="background:red"
          a="1"
          b
          c
        >
        </div>\`
      `,
      options: [
        {
          priority: ["id", "style"],
        },
      ],
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: `
        html\`<div
          style="background:red"
          b
          id="\${foo}"
          a="1"
          c
        >
        </div>\`
      `,
      output: `
        html\`<div
          id="\${foo}"
          style="background:red"
          a="1"
          b
          c
        >
        </div>\`
      `,
      options: [
        {
          priority: ["id", "style"],
        },
      ],
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
    {
      code: 'html`<input ${some} id="foo" type="checkbox" autocomplete="bar" checked />`',
      output:
        'html`<input id="foo" type="checkbox" ${some} autocomplete="bar" checked />`',
      errors: [
        {
          messageId: "unsorted",
        },
      ],
    },
  ],
});
