const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/sort-attrs");
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

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
    {
      code: `<span class="font-semibold text-emerald-500" {{ stimulus_controller('test') }}>Test</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    {
      code: `<span class="font-semibold text-emerald-500" {{ stimulus_controller('test') }}>Test</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Pattern tests
    {
      code: '<div id="foo" data-test="value" data-custom="attr" style="color:red" onclick="foo"></div>',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }, "style"],
        },
      ],
    },
    {
      code: '<input id="foo" aria-label="test" aria-describedby="desc" type="text" value="test" />',
      options: [
        {
          priority: ["id", { pattern: "aria-.*" }, "type"],
        },
      ],
    },
    {
      code: '<button id="btn" ng-click="handler" ng-if="visible" class="button" type="submit"></button>',
      options: [
        {
          priority: ["id", { pattern: "ng-.*" }, "class", "type"],
        },
      ],
    },
    {
      code: `
<button id="nice"
  <% if current_user.admin? %>
  class="btn-admin"
  <% end %>
  >
</button>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.ERB,
        },
      },
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
    {
      code: `
<button 
  style="color:black"
  id="nice"
  <% if current_user.admin? %>
  data-x="1"
  class="btn-admin"
  <% end %>
  >
</button>
      `,
      output: `
<button 
  id="nice"
  style="color:black"
  <% if current_user.admin? %>
  class="btn-admin"
  data-x="1"
  <% end %>
  >
</button>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.ERB,
        },
      },
      errors: [
        {
          messageId: "unsorted",
        },
        {
          messageId: "unsorted",
        },
      ],
    },
    // Pattern invalid tests
    {
      code: '<div style="color:red" data-test="value" id="foo" onclick="foo"></div>',
      output:
        '<div id="foo" data-test="value" style="color:red" onclick="foo"></div>',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }, "style"],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<div data-custom="attr" data-test="value" id="foo" style="color:red" onclick="foo"></div>',
      output:
        '<div id="foo" data-custom="attr" data-test="value" style="color:red" onclick="foo"></div>',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }, "style"],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<input type="text" aria-describedby="desc" id="foo" aria-label="test" value="test" />',
      output:
        '<input id="foo" aria-describedby="desc" aria-label="test" type="text" value="test" />',
      options: [
        {
          priority: ["id", { pattern: "aria-.*" }, "type"],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<button class="button" ng-if="visible" id="btn" ng-click="handler" type="submit"></button>',
      output:
        '<button id="btn" ng-if="visible" ng-click="handler" class="button" type="submit"></button>',
      options: [
        {
          priority: ["id", { pattern: "ng-.*" }, "class", "type"],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<div v-model="data" v-if="show" id="container" v-on:click="handler" class="wrapper"></div>',
      output:
        '<div id="container" v-model="data" v-if="show" v-on:click="handler" class="wrapper"></div>',
      options: [
        {
          priority: ["id", { pattern: "v-.*" }],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: '<div data-value="2" custom="test" data-id="1" id="foo" data-name="bar"></div>',
      output:
        '<div id="foo" data-value="2" data-id="1" data-name="bar" custom="test"></div>',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
  ],
});

templateRuleTester.run("[template] sort-attrs", rule, {
  valid: [
    {
      code: 'html`<input id="foo" type="checkbox" autocomplete="bar" checked />`',
    },
    {
      code: 'html`<div id="foo" data-test="value" data-custom="attr" style="color:red" onclick="foo"></div>`',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }, "style"],
        },
      ],
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
      code: 'html`<div style="color:red" data-test="value" id="foo" onclick="foo"></div>`',
      output:
        'html`<div id="foo" data-test="value" style="color:red" onclick="foo"></div>`',
      options: [
        {
          priority: ["id", { pattern: "data-.*" }, "style"],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
  ],
});
