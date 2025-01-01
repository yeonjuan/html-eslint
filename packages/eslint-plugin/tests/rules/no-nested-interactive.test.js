const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-nested-interactive");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-nested-interactive", rule, {
  valid: [
    {
      code: `<button></button>`,
    },
    {
      code: "<div><span></span></div>",
    },
    {
      code: `<div><button></button></div>`,
    },
    {
      code: `<a><button>click</button></a>`,
    },
    {
      code: "<button><audio></audio>",
    },
    {
      code: "<button><img src='foo.png'> click </button>",
    },
    {
      code: "<button><input type='hidden'> click </button>",
    },
    {
      code: "<label> text: <input type='text'></label>",
    },
  ],
  invalid: [
    {
      code: `<a href="/foo"><button> click </button></a>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            tag: "a",
          },
        },
      ],
    },
    {
      code: "<button><audio controls></audio></button>",
      errors: [
        {
          messageId: "unexpected",
          data: {
            tag: "button",
          },
        },
      ],
    },
    {
      code: "<button><img usemap='#vending'></button>",
      errors: [
        {
          messageId: "unexpected",
          data: {
            tag: "button",
          },
        },
      ],
    },
    {
      code: "<button><iframe src='https:...'></iframe></button>",
      errors: [
        {
          messageId: "unexpected",
          data: {
            tag: "button",
          },
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-nested-interactive", rule, {
  valid: [
    {
      code: `html\`<button></button>\``,
    },
    {
      code: `
html\`<button></button>\`;
html\`<a href="foo"></a>\`;`,
    },
  ],
  invalid: [
    {
      code: `html\`<a href="/foo"><button> click </button></a>\``,
      errors: [
        {
          messageId: "unexpected",
          data: {
            tag: "a",
          },
        },
      ],
    },
  ],
});
