const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-obsolete-tags");

// https://html.spec.whatwg.org/#non-conforming-features
const OBSOLETE_TAGS = [
  "applet",
  "acronym",
  "bgsound",
  "dir",
  "frame",
  "frameset",
  "noframes",
  "isindex",
  "keygen",
  "listing",
  "menuitem",
  "nextid",
  "noembed",
  "plaintext",
  "rb",
  "rtc",
  "strike",
  "xmp",
  "basefont",
  "big",
  "blink",
  "center",
  "font",
  "marquee",
  "multicol",
  "nobr",
  "spacer",
  "tt",
];

const ruleTester = createRuleTester();

ruleTester.run("no-obsolete-tags", rule, {
  valid: [
    {
      code: `
<div>
  <h1>Heading</h1>
  <p>Paragraph</p>
</div>
`,
    },
    {
      code: "<button>Click me</button>",
    },
    {
      code: '<input type="text" />',
    },
    {
      code: "<custom-center>Content</custom-center>",
    },
    {
      code: "<my-font>Text</my-font>",
    },
    {
      code: `@if (isLoggedIn) { <div>Welcome</div> }`,
    },
    {
      code: `@for (item of items; track item.id) { <li>{{ item.name }}</li> }`,
    },
    {
      code: `@switch (status) { @case ('active') { <span>Active</span> } }`,
    },
    {
      code: `@defer { <img src="hero.jpg" /> } @placeholder { <p>Loading...</p> }`,
    },
  ],
  invalid: [
    // Test all obsolete tags except frame (tested separately)
    ...OBSOLETE_TAGS.filter((tag) => tag !== "frame").map((tag) => ({
      code: `<${tag}></${tag}>`,
      errors: [
        {
          message: `Unexpected use of obsolete tag <${tag}>`,
          line: 1,
          column: 1,
        },
      ],
    })),
    {
      code: `
<frameset cols="25%,*,25%">
  <frame name="left" src="/html/intro"></frame>
</frameset>`,
      errors: [
        {
          messageId: "unexpected",
          data: { tag: "frameset" },
          line: 2,
          column: 1,
        },
        {
          messageId: "unexpected",
          data: { tag: "frame" },
          line: 3,
          column: 3,
        },
      ],
    },
    {
      code: '<font color="red">Text</font>',
      errors: [
        {
          message: "Unexpected use of obsolete tag <font>",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '<center align="middle">Content</center>',
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `@if (show) { <center>Content</center> }`,
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
          line: 1,
          column: 14,
        },
      ],
    },
    {
      code: `@for (item of items; track item.id) { <font>{{ item }}</font> }`,
      errors: [
        {
          message: "Unexpected use of obsolete tag <font>",
          line: 1,
          column: 39,
        },
      ],
    },
  ],
});
