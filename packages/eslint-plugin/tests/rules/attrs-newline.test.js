const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/attrs-newline");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

const closeStyles = ["sameline", "newline"];

ruleTester.run("attrs-newline", rule, {
  valid: [
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p></p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 0,
        },
      ],
    })),
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p>
        <img />
      </p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 0,
        },
      ],
    })),
    {
      code: `
      <p
        class="foo">
        <img
          class="foo" />
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 0,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        >
        <img
          class="foo"
        />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 0,
        },
      ],
    },
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p class="foo">
        <img class="foo" />
      </p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 1,
        },
      ],
    })),
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p title="this
      is
      a
      long
      value">
        <img class="this
        is
        a
        long" />
      </p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 1,
        },
      ],
    })),
    {
      code: `
      <p
        class="foo"
        id="p">
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        id="p">
        <img
          class="foo"
          id="img" />
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        id="p"
        >
        <img
          class="foo"
          id="img"
        />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        data-newline
        id="p">
        <img
          class="foo"
          id="img" />
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        data-newline
        id="p"
        >
        <img
          class="foo"
          id="img"
        />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        data-newline
        id="p"
        title="this
        is
        a
        long
        value">
        <img
          class="foo"
          id="img" />
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <p
        class="foo"
        data-newline
        id="p"
        title="this
        is
        a
        long
        value"
        >
        <img
          class="foo"
          id="img"
        />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
    },
    {
      code: `
      <button
        type="button"
        class="app-button"
        data-property
      ></button>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 3,
        },
      ],
    },
  ],

  invalid: [
    {
      code: `
      <p class="foo">
        <img />
      </p>`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 0,
        },
      ],
      output: `
      <p
class="foo">
        <img />
      </p>`,
      errors: [{ messageId: "newlineMissing" }],
    },
    {
      code: `
      <p
        class="foo">
        <img />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 0,
        },
      ],
      output: `
      <p
class="foo"
>
        <img />
      </p>`,
      errors: [{ messageId: "closeStyleWrong" }],
    },
    {
      code: `
      <p
        class="foo" id="p">
        <img />
      </p>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
      output: `
      <p
class="foo"
id="p"
>
        <img />
      </p>`,
      errors: [{ messageId: "newlineMissing" }],
    },
  ],
});

templateRuleTester.run("[template] attrs-newline", rule, {
  valid: [
    {
      code: `html\`<div class="foo"></div>\``,
    },
    {
      code: `html\`
        <button
          type="button"
          class="app-button"
          data-property
        ></button>
      \``,
      options: [
        {
          ifAttrsMoreThan: 3,
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
html\`<div class="foo" style="background:red;"></div>\`;
`,
      output: `
html\`<div
class="foo"
style="background:red;"></div>\`;
`,
      options: [
        {
          closeStyle: "sameline",
          ifAttrsMoreThan: 1,
        },
      ],
      errors: [{ messageId: "newlineMissing" }],
    },
    {
      code: `
html\`<div class="foo" style="background:red;"></div>\`;
`,
      output: `
html\`<div
class="foo"
style="background:red;"
></div>\`;
`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
      errors: [{ messageId: "newlineMissing" }],
    },
    {
      code: `
const code = /*html*/\`<div class="foo" style="background:red;"></div>\`;
`,
      output: `
const code = /*html*/\`<div
class="foo"
style="background:red;"
></div>\`;
`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 1,
        },
      ],
      errors: [{ messageId: "newlineMissing" }],
    },
    {
      code: `html\`
    <div a b foo=\${"true"}>
    </div>
\``,
      output: `html\`
    <div
a
b
foo=\${"true"}
>
    </div>
\``,
      errors: [{ messageId: "newlineMissing" }],
    },
  ],
});
