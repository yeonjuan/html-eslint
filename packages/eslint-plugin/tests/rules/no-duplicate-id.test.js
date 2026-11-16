const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-id");
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-duplicate-id", rule, {
  valid: [
    {
      code: `
<html>
<body>
  <div id = "foo"></div>
  <div id = "bar"></div>
</body>
</html>
`,
    },
    // Duplicates in mutually exclusive Twig if/else branches are not errors.
    {
      code: `
<p>
  {% if result %}
    <span id="status">yes</span>
  {% else %}
    <span id="status">no</span>
  {% endif %}
</p>
`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Original use case: four spans in four branches.
    {
      code: `
<p>
  {% if check_result is same as(null) %}
    <span id="acc_check_result"></span>
  {% elseif check_result is same as(false) %}
    <span id="acc_check_result" class="failure">Invalid</span>
  {% elseif check_result is same as(true) %}
    <span id="acc_check_result" class="success">Valid</span>
  {% else %}
    <span id="acc_check_result" class="failure">Wrong key</span>
  {% endif %}
</p>
`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Template content and declarative shadow roots are separate trees.
    {
      code: `
<div id="a"></div>
<template><div id="a"></div></template>
<div id="b"></div>
<div><template shadowrootmode="open"><div id="b"></div></template></div>
`,
    },
    // Each template has its own content tree.
    {
      code: `
<template><span id="item"></span></template>
<template><span id="item"></span></template>
`,
    },
    // A nested template is a separate tree from its parent template.
    {
      code: `
<template>
  <div id="x"></div>
  <template><div id="x"></div></template>
</template>
`,
    },
  ],
  invalid: [
    {
      code: `
<html>
<body>
  <div id = "foo"></div>
  <div id = "foo"></div>
</body>
</html>
`,
      errors: [
        {
          messageId: "duplicateId",
        },
        {
          message: "The id 'foo' is duplicated.",
        },
      ],
    },
    {
      code: `
<html>
<body>
  <div id = "foo"></div>
  <a id = "foo"></div>
</body>
</html>
`,

      errors: [
        {
          messageId: "duplicateId",
          line: 4,
        },
        {
          messageId: "duplicateId",
          line: 5,
        },
      ],
    },
    // Duplicates in two SEPARATE if-blocks can both render simultaneously
    // and must still be reported.
    {
      code: `
{% if c1 %}<div id="foo"></div>{% endif %}
{% if c2 %}<div id="foo"></div>{% endif %}
`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
      errors: [{ messageId: "duplicateId" }, { messageId: "duplicateId" }],
    },
    // Duplicates inside the same template are still reported.
    {
      code: `
<template>
  <div id="a"></div>
  <div id="a"></div>
</template>
`,
      errors: [
        { messageId: "duplicateId", line: 3 },
        { messageId: "duplicateId", line: 4 },
      ],
    },
    {
      code: `
<div><template shadowrootmode="open">
  <slot id="s"></slot>
  <div><span id="s"></span></div>
</template></div>
`,
      errors: [
        { messageId: "duplicateId", line: 3 },
        { messageId: "duplicateId", line: 4 },
      ],
    },
    // The id of the <template> element itself belongs to the outer tree.
    {
      code: `
<div id="t"></div>
<template id="t"><div id="t"></div></template>
`,
      errors: [
        { messageId: "duplicateId", line: 2 },
        { messageId: "duplicateId", line: 3, column: 15 },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-duplicate-id", rule, {
  valid: [
    {
      code: `
html\`<html>
<body>
  <div id = "foo"></div>
  <div id = "bar"></div>
</body>
</html>\`
`,
    },
    {
      code: `
html\`<div id="a"></div>
<template><div id="a"></div></template>\`
`,
    },
    {
      code: `const code = /* html */\`<html>
<body>
  <div id = "foo"></div>
  <div id = "bar"></div>
</body>
</html>\``,
    },
  ],
  invalid: [
    {
      code: `
html\`<html>
<body>
  <div id = "foo"></div>
  <a id = "foo"></div>
</body>
</html>\`
`,

      errors: [
        {
          messageId: "duplicateId",
          line: 4,
        },
        {
          messageId: "duplicateId",
          line: 5,
        },
      ],
    },
    {
      code: `
html\`<html>
<body>
  <div id = "\${foo}"></div>
  <a id = "\${foo}"></div>
</body>
</html>\`
`,

      errors: [
        {
          messageId: "duplicateId",
          line: 4,
        },
        {
          messageId: "duplicateId",
          line: 5,
        },
      ],
    },
    {
      code: `
/* html */\`<html>
<body>
  <div id = "\${foo}"></div>
  <a id = "\${foo}"></div>
</body>
</html>\`
`,

      errors: [
        {
          messageId: "duplicateId",
          line: 4,
        },
        {
          messageId: "duplicateId",
          line: 5,
        },
      ],
    },
  ],
});
