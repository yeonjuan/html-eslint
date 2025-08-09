const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-ineffective-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-ineffective-attrs", rule, {
  valid: [
    // Valid input types for multiple attribute
    {
      code: '<input type="email" multiple>',
    },
    {
      code: '<input type="file" multiple>',
    },
    {
      code: "<select multiple></select>",
    },

    // Valid file input with accept
    {
      code: '<input type="file" accept=".jpg,.png">',
    },

    // Valid script with src and defer
    {
      code: '<script src="script.js" defer></script>',
    },

    // Valid script with src and async
    {
      code: '<script src="script.js" async></script>',
    },

    // Valid anchor with href and download
    {
      code: '<a href="file.pdf" download>Download</a>',
    },

    // Valid audio with controls and controlslist
    {
      code: '<audio controls controlslist="nodownload"></audio>',
    },

    // Valid video with controls and controlslist
    {
      code: '<video controls controlslist="nofullscreen"></video>',
    },
  ],
  invalid: [
    // Invalid multiple on text input
    {
      code: '<input type="text" multiple>',
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
      code: '<input type="checkbox" multiple>',
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
    // Invalid accept on non-file input
    {
      code: '<input type="text" accept=".jpg">',
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
    // Invalid defer on inline script
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
    // Invalid controlslist on audio without controls
    {
      code: '<audio controlslist="nodownload"></audio>',
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
    // Invalid controlslist on video without controls
    {
      code: '<video controlslist="nofullscreen"></video>',
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
  ],
});

templateRuleTester.run("[template] no-ineffective-attrs", rule, {
  valid: [
    // Valid input types for multiple attribute
    {
      code: `html\`<input type="email" multiple>\``,
    },
    {
      code: `html\`<input type="file" multiple>\``,
    },
    {
      code: `html\`<select multiple></select>\``,
    },

    // Valid file input with accept
    {
      code: `html\`<input type="file" accept=".jpg,.png">\``,
    },

    // Valid script with src and defer
    {
      code: `html\`<script src="script.js" defer></script>\``,
    },

    // Valid script with src and async
    {
      code: `html\`<script src="script.js" async></script>\``,
    },

    // Valid anchor with href and download
    {
      code: `html\`<a href="file.pdf" download>Download</a>\``,
    },

    // Valid audio with controls and controlslist
    {
      code: `html\`<audio controls controlslist="nodownload"></audio>\``,
    },

    // Valid video with controls and controlslist
    {
      code: `html\`<video controls controlslist="nofullscreen"></video>\``,
    },
  ],
  invalid: [
    // Invalid multiple on text input
    {
      code: 'html`<input type="text" multiple>`',
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
      code: `html\`<input type="checkbox" multiple>\``,
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
    // Invalid accept on non-file input
    {
      code: `html\`<input type="text" accept=".jpg">\``,
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
    // Invalid defer on inline script
    {
      code: `html\`<script defer></script>\``,
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
      code: `html\`<script async></script>\``,
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
      code: `html\`<a download>Download</a>\``,
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
    // Invalid controlslist on audio without controls
    {
      code: `html\`<audio controlslist="nodownload"></audio>\``,
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
    // Invalid controlslist on video without controls
    {
      code: `html\`<video controlslist="nofullscreen"></video>\``,
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
  ],
});
