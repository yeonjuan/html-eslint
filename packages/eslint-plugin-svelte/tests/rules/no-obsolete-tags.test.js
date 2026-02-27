import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-obsolete-tags.js";

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
      code: `
<script>
  let count = 0;
</script>

<div>
  <p>{count}</p>
</div>
`,
    },
    {
      code: `
<style>
  p {
    color: red;
  }
</style>
`,
    },
    // Components with capitalized names should be ignored (Svelte components)
    {
      code: "<Center>Content</Center>",
    },
    {
      code: '<Font size="large">Text</Font>',
    },
    {
      code: "<Big>Large text</Big>",
    },
    // Custom elements with dashes should be ignored
    {
      code: "<custom-center>Content</custom-center>",
    },
    {
      code: "<my-font>Text</my-font>",
    },
  ],
  invalid: [
    // Test all obsolete tags except frame (tested separately)
    // keygen is a void element, so it cannot have a closing tag
    ...OBSOLETE_TAGS.filter((tag) => tag !== "frame" && tag !== "keygen").map(
      (tag) => ({
        code: `<${tag}></${tag}>`,
        errors: [
          {
            message: `Unexpected use of obsolete tag <${tag}>`,
            line: 1,
            column: 1,
          },
        ],
      })
    ),
    {
      code: "<keygen />",
      errors: [
        {
          message: "Unexpected use of obsolete tag <keygen>",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `
<frameset cols="25%,*,25%">
  <frame name="left" src="/html/intro" />
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
      code: "<center />",
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "<font />",
      errors: [
        {
          message: "Unexpected use of obsolete tag <font>",
          line: 1,
          column: 1,
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
      code: `
<div>
  <center>
    <p>Centered content</p>
  </center>
</div>
`,
      errors: [
        {
          message: "Unexpected use of obsolete tag <center>",
          line: 3,
          column: 3,
        },
      ],
    },
  ],
});
