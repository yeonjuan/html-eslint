const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-open-graph-protocol");

const ruleTester = createRuleTester();

ruleTester.run("require-open-graph-protocol", rule, {
  valid: [
    {
      code: "<html></html>",
    },
    {
      code: `<html>
      <head>
        <meta property="og:url" content="title" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content="title" />
        <meta property="og:image" content="https://image.png" />
      </head>
      </html>`,
    },
  ],
  invalid: [
    {
      code: "<html><head></head></html>",
      errors: [
        {
          message:
            "Require use of meta tags for OGP. (og:title, og:type, og:url, og:image)",
          line: 1,
          column: 7,
        },
      ],
    },
    {
      // Error should be reported at the opening <head> tag only, not the entire head content
      code: `<html>
  <head>
    <meta property="og:title" content="title" />
  </head>
</html>`,
      errors: [
        {
          message:
            "Require use of meta tags for OGP. (og:type, og:url, og:image)",
          line: 2,
          column: 3,
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:title" content="title">
      </head>
      </html>`,
      errors: [
        {
          message:
            "Require use of meta tags for OGP. (og:type, og:url, og:image)",
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:title" content="title" />
        <meta property="og:image" content="https://image.png" />
      </head>
      </html>`,
      errors: [
        {
          message: "Require use of meta tags for OGP. (og:type, og:url)",
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:title" content="title" />
        <meta property="og:image" content="https://image.png" />
      </head>
      </html>`,
      options: [["description"]],
      errors: [
        {
          message: "Require use of meta tags for OGP. (og:description)",
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:title" content="title" />
        <meta property="og:image" content="https://image.png" />
      </head>
      </html>`,
      options: [["og:description", "og:video"]],
      errors: [
        {
          message:
            "Require use of meta tags for OGP. (og:description, og:video)",
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:url" content="title" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content="" />
        <meta property="og:image" />
      </head>
      </html>`,
      errors: [
        {
          messageId: "empty",
        },
        {
          messageId: "empty",
        },
      ],
    },
    {
      code: `<html>
      <head>
        <meta property="og:url" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content="" />
        <meta property="og:image" />
      </head>
      </html>`,
      options: [["title", "og:image"]],
      errors: [
        {
          messageId: "empty",
        },
        {
          messageId: "empty",
        },
      ],
    },
  ],
});
