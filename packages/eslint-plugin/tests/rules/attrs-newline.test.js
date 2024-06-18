const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/attrs-newline");

const ruleTester = createRuleTester();

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
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p class="foo"
        >
        <img />
      </p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 1,
        },
      ],
      output: `
      <p class="foo">
        <img />
      </p>`,
      errors: [{ messageId: "newlineUnexpected" }],
    })),
    ...closeStyles.map((closeStyle) => ({
      code: `
      <p
        class="foo"
        id="p">
        <img />
      </p>`,
      options: [
        {
          closeStyle,
          ifAttrsMoreThan: 2,
        },
      ],
      output: `
      <p class="foo" id="p">
        <img />
      </p>`,
      errors: [{ messageId: "newlineUnexpected" }],
    })),
  ],
});
