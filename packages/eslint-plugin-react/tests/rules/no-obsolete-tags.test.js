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
      code: "<Center>Content</Center>",
    },
    {
      code: '<Font size="large">Text</Font>',
    },
    {
      code: "<Big>Large text</Big>",
    },
    {
      code: "<custom-center>Content</custom-center>",
    },
    {
      code: "<my-font>Text</my-font>",
    },
  ],
  invalid: [
    // Test all obsolete tags except frame (tested separately)
    ...OBSOLETE_TAGS.filter((tag) => tag !== "frame").map((tag) => ({
      code: `<${tag}></${tag}>`,
      errors: [
        {
          message: `Unexpected use of obsolete tag <${tag}>`,
        },
      ],
    })),
    {
      code: `
<frameset cols="25%,*,25%">
  <frame name="left" src="/html/intro" />
</frameset>`,
      errors: [
        {
          messageId: "unexpected",
          data: { tag: "frameset" },
        },
        {
          messageId: "unexpected",
          data: { tag: "frame" },
        },
      ],
    },
    {
      code: "<center />",
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
        },
      ],
    },
    {
      code: "<font />",
      errors: [
        {
          message: "Unexpected use of obsolete tag <font>",
        },
      ],
    },
    {
      code: '<font color="red">Text</font>',
      errors: [
        {
          message: "Unexpected use of obsolete tag <font>",
        },
      ],
    },
    {
      code: '<center align="middle">Content</center>',
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
        },
      ],
    },
  ],
});
