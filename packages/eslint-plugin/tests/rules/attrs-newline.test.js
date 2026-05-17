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
    // skip option: tag in skip list is not enforced even if attrs exceed threshold
    {
      code: `<pre class="foo" id="bar" data-x="1"></pre>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // skip option: other tags still get enforced
    {
      code: `
      <pre class="foo" id="bar"></pre>
      <div
        class="foo"
        id="bar"
        >
      </div>`,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // inline option: inline tags are not enforced
    {
      code: `<p>The quick <span class="foo" data-foo="true">brown fox</span> jumps over the lazy dog.</p>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["span"],
        },
      ],
    },
    // inline option with $inline preset: all standard inline elements are excluded
    {
      code: `<p>Click <a class="link" href="/foo" target="_blank">here</a> for info.</p>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["$inline"],
        },
      ],
    },
    // $inline preset covers span as well
    {
      code: `<p>Hello <span class="hi" id="greeting" data-test="true">world</span></p>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["$inline"],
        },
      ],
    },
    // skip suppresses descendant elements too
    {
      code: `<pre class="foo" id="bar"><span class="baz" id="qux" data-x="1"></span></pre>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // skip suppresses deeply nested descendants
    {
      code: `<pre><div class="a" id="b"><span class="c" id="d" data-x="1"></span></div></pre>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // inline does NOT suppress descendants — tags outside the inline element are still enforced
    // (this is a valid case because the outer div has only 1 attr, under the threshold of 3)
    {
      code: `<div class="wrapper"><span class="a" id="b" data-x="1">text</span></div>`,
      options: [
        {
          ifAttrsMoreThan: 2,
          inline: ["span"],
        },
      ],
    },
    // maxLen: tag within max-len is not enforced
    {
      code: `<div class="foo" id="bar">`,
      options: [{ maxLen: 80, ifAttrsMoreThan: 10 }],
    },
    // maxLen: tag with no attributes is never enforced
    {
      code: `<a-very-long-element-name-that-exceeds-any-length></a-very-long-element-name-that-exceeds-any-length>`,
      options: [{ maxLen: 10 }],
    },
    // maxLen: already multiline tag is valid
    {
      code: `<div
  class="foo"
  id="bar"
>`,
      options: [{ maxLen: 20, ifAttrsMoreThan: 10 }],
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
    // maxLen: tag exceeding maxLen triggers newline requirement
    {
      code: `<div class="a-very-long-class-name" id="a-very-long-id">`,
      options: [{ maxLen: 40, ifAttrsMoreThan: 10 }],
      output: `<div
class="a-very-long-class-name"
id="a-very-long-id"
>`,
      errors: [{ messageId: "newlineMissing", line: 1, column: 1 }],
    },
    // maxLen: only one attribute but tag exceeds maxLen
    {
      code: `<div class="a-very-long-class-name-that-makes-this-tag-exceed-the-max-length">`,
      options: [{ maxLen: 40, ifAttrsMoreThan: 10 }],
      output: `<div
class="a-very-long-class-name-that-makes-this-tag-exceed-the-max-length"
>`,
      errors: [{ messageId: "newlineMissing", line: 1, column: 1 }],
    },
    // inline does NOT suppress descendants — child elements inside an inline tag are still enforced
    {
      code: `<span class="wrapper" id="w"><div class="a" id="b" data-x="1"></div></span>`,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["span"],
        },
      ],
      output: `<span class="wrapper" id="w"><div
class="a"
id="b"
data-x="1"
></div></span>`,
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
    // skip option: tag in skip list is not enforced
    {
      code: `html\`<pre class="foo" id="bar" data-x="1"></pre>\``,
      options: [
        {
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // skip option: other tags still get enforced
    {
      code: `html\`
        <pre class="foo" id="bar"></pre>
        <div
          class="foo"
          id="bar"
        >
        </div>
      \``,
      options: [
        {
          closeStyle: "newline",
          ifAttrsMoreThan: 0,
          skip: ["pre"],
        },
      ],
    },
    // inline option: inline tags are not enforced
    {
      code: `html\`<p>The quick <span class="foo" data-foo="true">brown fox</span> jumps over the lazy dog.</p>\``,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["span"],
        },
      ],
    },
    // inline option with $inline preset
    {
      code: `html\`<p>Click <a class="link" href="/foo" target="_blank">here</a> for info.</p>\``,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["$inline"],
        },
      ],
    },
    // skip suppresses descendant elements
    {
      code: `html\`<pre class="foo" id="bar"><span class="baz" id="qux" data-x="1"></span></pre>\``,
      options: [
        {
          ifAttrsMoreThan: 0,
          skip: ["pre"],
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
    // inline does NOT suppress descendants — child elements are still enforced
    {
      code: `html\`<span class="wrapper" id="w"><div class="a" id="b" data-x="1"></div></span>\``,
      output: `html\`<span class="wrapper" id="w"><div
class="a"
id="b"
data-x="1"
></div></span>\``,
      options: [
        {
          ifAttrsMoreThan: 0,
          inline: ["span"],
        },
      ],
      errors: [{ messageId: "newlineMissing" }],
    },
  ],
});
