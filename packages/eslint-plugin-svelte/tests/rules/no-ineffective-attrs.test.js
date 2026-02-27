import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-ineffective-attrs.js";

const ruleTester = createRuleTester();

ruleTester.run("no-ineffective-attrs", rule, {
  valid: [
    {
      code: '<input type="email" multiple />',
    },
    {
      code: '<input type="file" multiple />',
    },
    {
      code: "<select multiple></select>",
    },
    {
      code: '<input type="file" accept=".jpg,.png" />',
    },
    {
      code: '<input type="text" readonly />',
    },
    {
      code: '<input type="password" readonly />',
    },
    {
      code: '<script src="script.js" defer></script>',
    },
    {
      code: '<script src="script.js" async></script>',
    },
    {
      code: '<a href="file.pdf" download>Download</a>',
    },
    {
      code: '<a href="https://example.com" target="_blank">Open</a>',
    },
    {
      code: '<a href="/page" ping="/analytics">Link</a>',
    },
    {
      code: '<audio controls controlslist="nodownload"></audio>',
    },
    {
      code: '<video controls controlslist="nofullscreen"></video>',
    },
    {
      code: '<form method="post" enctype="multipart/form-data"></form>',
    },
    {
      code: '<button type="submit" formaction="/submit">Submit</button>',
    },
    {
      code: '<button type="submit" formmethod="post">Submit</button>',
    },
    {
      code: '<button type="submit" formenctype="multipart/form-data">Submit</button>',
    },
    {
      code: '<button type="submit" formnovalidate>Submit</button>',
    },
    {
      code: '<button type="submit" formtarget="_blank">Submit</button>',
    },
    {
      code: '<img src="map.jpg" usemap="#map" />',
    },
    {
      code: '<input type="number" min="0" max="100" />',
    },
    {
      code: '<input type="range" min="0" max="10" step="2" />',
    },
    {
      code: '<input type="date" min="2020-01-01" max="2025-12-31" />',
    },
    {
      code: '<input type="text" pattern="[0-9]+" />',
    },
    {
      code: '<input type="email" pattern=".+@example\\.com" />',
    },
    {
      code: '<input type="text" maxlength="10" minlength="3" />',
    },
    {
      code: '<input type="password" maxlength="20" />',
    },
    {
      code: '<input type="text" placeholder="Enter name" />',
    },
    {
      code: '<input type="number" placeholder="Enter age" />',
    },
    {
      code: '<input type="text" size="20" />',
    },
    {
      code: '<input type="email" size="40" />',
    },
    {
      code: '<input type="text" list="suggestions" />',
    },
    {
      code: '<input type="email" list="emails" />',
    },
    {
      code: '<Input type="checkbox" multiple />',
    },
    {
      code: '<custom-input type="text" multiple />',
    },
    {
      code: '<my-button type="button" formaction="/submit">Click</my-button>',
    },
    {
      code: "<input type={inputType} multiple />",
    },
  ],
  invalid: [
    {
      code: '<input type="text" multiple />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" multiple />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="password" multiple />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="text" accept=".jpg" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "accept" attribute has no effect unless input type is "file".',
          },
        },
      ],
    },
    {
      code: "<script defer></script>",
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 9,
          data: {
            message: 'The "defer" attribute has no effect on inline scripts.',
          },
        },
      ],
    },
    {
      code: "<script async></script>",
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 9,
          data: {
            message: 'The "async" attribute has no effect on inline scripts.',
          },
        },
      ],
    },
    {
      code: "<a download>Download</a>",
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 4,
          data: {
            message:
              'The "download" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<a target="_blank">Open</a>',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 4,
          data: {
            message: 'The "target" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<a ping="/analytics">Link</a>',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 4,
          data: {
            message: 'The "ping" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<audio controlslist="nodownload"></audio>',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 8,
          data: {
            message:
              'The "controlslist" attribute has no effect without "controls".',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" readonly />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="file" readonly />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="text" min="0" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "min" attribute only works with numeric, date, and time input types.',
          },
        },
      ],
    },
    {
      code: '<input type="text" max="100" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "max" attribute only works with numeric, date, and time input types.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" pattern="[0-9]+" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "pattern" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="number" maxlength="10" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 22,
          data: {
            message:
              'The "maxlength" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" placeholder="Enter value" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "placeholder" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" size="20" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message:
              'The "size" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" list="suggestions" />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 24,
          data: {
            message: 'The "list" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<form method="get" enctype="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "enctype" attribute only has effect when method is "post".',
          },
        },
      ],
    },
    {
      code: '<button type="button" formaction="/submit">Submit</button>',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 23,
          data: {
            message:
              'The "formaction" attribute only works with type="submit".',
          },
        },
      ],
    },
    {
      code: '<img src="map.jpg" usemap="#map" ismap />',
      errors: [
        {
          messageId: "ineffective",
          line: 1,
          column: 20,
          data: {
            message:
              'The "usemap" and "ismap" attributes cannot be used together.',
          },
        },
      ],
    },
  ],
});
