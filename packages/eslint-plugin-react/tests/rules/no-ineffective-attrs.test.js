const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-ineffective-attrs");

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
      code: '<input type="text" readOnly />',
    },
    {
      code: '<input type="text" readonly />',
    },

    {
      code: '<input type="password" readOnly />',
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
      code: '<audio controls controlsList="nodownload"></audio>',
    },
    {
      code: '<audio controls controlslist="nodownload"></audio>',
    },

    {
      code: '<video controls controlsList="nofullscreen"></video>',
    },

    {
      code: '<form method="post" encType="multipart/form-data"></form>',
    },
    {
      code: '<form method="post" enctype="multipart/form-data"></form>',
    },

    {
      code: '<button type="submit" formAction="/submit">Submit</button>',
    },
    {
      code: '<button type="submit" formMethod="post">Submit</button>',
    },
    {
      code: '<button type="submit" formEncType="multipart/form-data">Submit</button>',
    },
    {
      code: '<button type="submit" formNoValidate>Submit</button>',
    },
    {
      code: '<button type="submit" formTarget="_blank">Submit</button>',
    },

    // Valid img with usemap without ismap (React camelCase)
    {
      code: '<img src="map.jpg" useMap="#map" />',
    },
    {
      code: '<img src="map.jpg" usemap="#map" />',
    },

    {
      code: '<area href="/page" download />',
    },
    {
      code: '<area href="/page" ping="/analytics" />',
    },
    {
      code: '<area href="/page" target="_blank" />',
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
      code: '<input type="datetime-local" min="2020-01-01T00:00" />',
    },
    {
      code: '<input type="month" min="2020-01" />',
    },
    {
      code: '<input type="time" min="09:00" max="17:00" />',
    },
    {
      code: '<input type="week" min="2020-W01" />',
    },

    {
      code: '<input type="text" pattern="[0-9]+" />',
    },
    {
      code: '<input type="search" pattern="[A-Za-z]+" />',
    },
    {
      code: '<input type="url" pattern="https://.*" />',
    },
    {
      code: '<input type="tel" pattern="[0-9]{3}-[0-9]{4}" />',
    },
    {
      code: '<input type="email" pattern=".+@example\\.com" />',
    },
    {
      code: '<input type="password" pattern=".{8,}" />',
    },

    {
      code: '<input type="text" maxLength="10" minLength="3" />',
    },
    {
      code: '<input type="search" maxLength="50" />',
    },
    {
      code: '<input type="url" minLength="5" />',
    },
    {
      code: '<input type="tel" maxLength="15" />',
    },
    {
      code: '<input type="email" maxLength="100" />',
    },
    {
      code: '<input type="password" maxLength="20" />',
    },

    // Valid inputs with placeholder
    {
      code: '<input type="text" placeholder="Enter name" />',
    },
    {
      code: '<input type="number" placeholder="Enter age" />',
    },
    {
      code: '<input type="search" placeholder="Search..." />',
    },
    {
      code: '<input type="url" placeholder="https://example.com" />',
    },
    {
      code: '<input type="tel" placeholder="123-456-7890" />',
    },
    {
      code: '<input type="email" placeholder="user@example.com" />',
    },
    {
      code: '<input type="password" placeholder="Password" />',
    },
    {
      code: '<input type="text" size="20" />',
    },
    {
      code: '<input type="search" size="30" />',
    },
    {
      code: '<input type="url" size="50" />',
    },
    {
      code: '<input type="tel" size="15" />',
    },
    {
      code: '<input type="email" size="40" />',
    },
    {
      code: '<input type="password" size="20" />',
    },

    // Valid inputs with list
    {
      code: '<input type="text" list="suggestions" />',
    },
    {
      code: '<input type="email" list="emails" />',
    },
    {
      code: '<input type="number" list="numbers" />',
    },
    {
      code: "<input type={inputType} multiple />",
    },
    {
      code: '<script defer={shouldDefer}>alert("hi")</script>',
    },
    {
      code: '<input type="text" accept={acceptValue} />',
    },
    {
      code: '<form method={formMethod} encType="multipart/form-data"></form>',
    },
    {
      code: '<button type={buttonType} formAction="/submit">Submit</button>',
    },
    {
      code: '<link rel={relValue} sizes="16x16" />',
    },
    {
      code: '<Input type="checkbox" multiple />',
    },
    {
      code: '<Script defer>console.log("hi")</Script>',
    },
    {
      code: '<Button type="button" formAction="/submit">Click</Button>',
    },
    {
      code: '<MyButton type="button" formAction="/submit">Click</MyButton>',
    },

    // Custom elements with hyphens are ignored
    {
      code: '<custom-input type="text" multiple />',
    },
    {
      code: '<my-button type="button" formAction="/submit">Click</my-button>',
    },
  ],
  invalid: [
    // Invalid multiple on text input
    {
      code: '<input type="text" multiple />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    // Invalid multiple on checkbox
    {
      code: '<input type="checkbox" multiple />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    // Invalid multiple on password
    {
      code: '<input type="password" multiple />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="radio" multiple />',
      errors: [
        {
          messageId: "ineffective",
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
          data: {
            message:
              'The "accept" attribute has no effect unless input type is "file".',
          },
        },
      ],
    },
    {
      code: '<input type="number" accept=".png" />',
      errors: [
        {
          messageId: "ineffective",
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
          data: {
            message: 'The "defer" attribute has no effect on inline scripts.',
          },
        },
      ],
    },
    {
      code: '<script defer>console.log("hello")</script>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "defer" attribute has no effect on inline scripts.',
          },
        },
      ],
    },

    // Invalid async on inline script
    {
      code: "<script async></script>",
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "async" attribute has no effect on inline scripts.',
          },
        },
      ],
    },
    {
      code: '<script async>console.log("hello")</script>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "async" attribute has no effect on inline scripts.',
          },
        },
      ],
    },

    // Invalid download without href
    {
      code: "<a download>Download</a>",
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "download" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<a download="file.pdf">Download</a>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "download" attribute has no effect without an "href".',
          },
        },
      ],
    },

    // Invalid target without href
    {
      code: '<a target="_blank">Open</a>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "target" attribute has no effect without an "href".',
          },
        },
      ],
    },

    // Invalid ping without href
    {
      code: '<a ping="/analytics">Link</a>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "ping" attribute has no effect without an "href".',
          },
        },
      ],
    },

    {
      code: '<audio controlsList="nodownload"></audio>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "controlslist" attribute has no effect without "controls".',
          },
        },
      ],
    },
    {
      code: '<video controlsList="nofullscreen"></video>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "controlslist" attribute has no effect without "controls".',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" readOnly />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" readonly />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },

    // Invalid readonly on radio input
    {
      code: '<input type="radio" readOnly />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },

    // Invalid readonly on file input
    {
      code: '<input type="file" readOnly />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },

    // Invalid readonly on range input
    {
      code: '<input type="range" readOnly />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "readonly" attribute has no effect on this input type.',
          },
        },
      ],
    },

    // Invalid readonly on color input
    {
      code: '<input type="color" readOnly />',
      errors: [
        {
          messageId: "ineffective",
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
          data: {
            message:
              'The "max" attribute only works with numeric, date, and time input types.',
          },
        },
      ],
    },
    {
      code: '<input type="password" step="5" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "step" attribute only works with numeric, date, and time input types.',
          },
        },
      ],
    },

    // Invalid pattern on non-text input
    {
      code: '<input type="checkbox" pattern="[0-9]+" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "pattern" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="number" pattern="[0-9]+" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "pattern" attribute only works with text-based input types.',
          },
        },
      ],
    },

    // Invalid maxlength/minlength on non-text input (React camelCase)
    {
      code: '<input type="number" maxLength="10" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "maxlength" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="radio" minLength="5" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "minlength" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" maxLength="10" />',
      errors: [
        {
          messageId: "ineffective",
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
          data: {
            message:
              'The "placeholder" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="radio" placeholder="Select" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "placeholder" attribute has no effect on this input type.',
          },
        },
      ],
    },

    // Invalid size on non-text input
    {
      code: '<input type="checkbox" size="20" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "size" attribute only works with text-based input types.',
          },
        },
      ],
    },
    {
      code: '<input type="number" size="10" />',
      errors: [
        {
          messageId: "ineffective",
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
          data: {
            message: 'The "list" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="radio" list="options" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "list" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<input type="file" list="files" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "list" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: '<form method="get" encType="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "enctype" attribute only has effect when method is "post".',
          },
        },
      ],
    },
    {
      code: '<form method="get" enctype="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "enctype" attribute only has effect when method is "post".',
          },
        },
      ],
    },
    {
      code: '<form encType="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "enctype" attribute only has effect when method is "post".',
          },
        },
      ],
    },
    {
      code: '<button type="button" formAction="/submit">Submit</button>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "formaction" attribute only works with type="submit".',
          },
        },
      ],
    },
    {
      code: '<button type="reset" formMethod="post">Reset</button>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "formmethod" attribute only works with type="submit".',
          },
        },
      ],
    },
    {
      code: '<button type="button" formEncType="multipart/form-data">Button</button>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "formenctype" attribute only works with type="submit".',
          },
        },
      ],
    },
    {
      code: '<button type="button" formNoValidate>Button</button>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "formnovalidate" attribute only works with type="submit".',
          },
        },
      ],
    },
    {
      code: '<button type="reset" formTarget="_blank">Reset</button>',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "formtarget" attribute only works with type="submit".',
          },
        },
      ],
    },

    {
      code: '<img src="map.jpg" useMap="#map" isMap />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "usemap" and "ismap" attributes cannot be used together.',
          },
        },
      ],
    },
    {
      code: '<img src="map.jpg" usemap="#map" ismap />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "usemap" and "ismap" attributes cannot be used together.',
          },
        },
      ],
    },
    {
      code: "<area download />",
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "download" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<area ping="/analytics" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "ping" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<area target="_blank" />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message: 'The "target" attribute has no effect without an "href".',
          },
        },
      ],
    },
    {
      code: '<input type={"text"} multiple />',
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
    {
      code: "<input type={`checkbox`} multiple />",
      errors: [
        {
          messageId: "ineffective",
          data: {
            message:
              'The "multiple" attribute has no effect on this input type.',
          },
        },
      ],
    },
  ],
});
