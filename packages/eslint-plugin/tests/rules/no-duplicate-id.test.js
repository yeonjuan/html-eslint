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
