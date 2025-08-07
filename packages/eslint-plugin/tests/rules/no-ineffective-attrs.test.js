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
      code: '<select multiple></select>',
    },
    
    // Valid file input with accept
    {
      code: '<input type="file" accept=".jpg,.png">',
    },
    
    // Valid script with src and defer
    {
      code: '<script src="script.js" defer></script>',
    },
    
    // Valid textarea without value attribute
    {
      code: '<textarea>content</textarea>',
    },
    
    // Valid anchor with href and download
    {
      code: '<a href="file.pdf" download>Download</a>',
    },
    
    // Valid form with POST method and enctype
    {
      code: '<form method="post" enctype="multipart/form-data"></form>',
    },
  ],
  invalid: [
    // Invalid multiple on text input
    {
      code: '<input type="text" multiple>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "multiple" attribute has no effect on this input type.' },
        },
      ],
    },
    // Invalid multiple on checkbox
    {
      code: '<input type="checkbox" multiple>',
      errors: [
        {
          messageId: "ineffective", 
          data: { message: 'The "multiple" attribute has no effect on this input type.' },
        },
      ],
    },
    // Invalid accept on non-file input
    {
      code: '<input type="text" accept=".jpg">',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "accept" attribute has no effect unless input type is "file".' },
        },
      ],
    },
    // Invalid defer on inline script
    {
      code: '<script defer></script>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "defer" attribute has no effect on inline scripts.' },
        },
      ],
    },
    // Invalid value on textarea
    {
      code: '<textarea value="text">content</textarea>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "value" attribute has no effect on <textarea>. Use its content instead.' },
        },
      ],
    },
    // Invalid download without href
    {
      code: '<a download>Download</a>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "download" attribute has no effect without an "href".' },
        },
      ],
    },
    // Invalid enctype on GET form
    {
      code: '<form method="get" enctype="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "enctype" attribute is only relevant when method is "post".' },
        },
      ],
    },
    // Invalid enctype on default method form
    {
      code: '<form enctype="multipart/form-data"></form>',
      errors: [
        {
          messageId: "ineffective",
          data: { message: 'The "enctype" attribute is only relevant when method is "post".' },
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-ineffective-attrs", rule, {
  valid: [],
  invalid: [],
});
