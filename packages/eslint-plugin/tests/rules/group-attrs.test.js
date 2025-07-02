const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/group-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("group-attrs", rule, {
  valid: [
    // Basic valid cases
    {
      code: '<input min="5" max="10">',
    },
    {
      code: '<div width="100" height="200">',
    },
    {
      code: '<textarea minlength="5" maxlength="100">',
    },

    // Only one attribute from a group
    {
      code: '<input min="5">',
    },
    {
      code: '<input max="10">',
    },
    {
      code: '<div width="100">',
    },

    // No related attributes
    {
      code: '<input type="text" name="test">',
    },
    {
      code: '<div class="test" id="example">',
    },

    // Custom groups configuration
    {
      code: '<input data-start="1" data-end="10">',
      options: [{ groups: [["data-start", "data-end"]] }],
    },

    // Partial groups - only some attributes from a group present
    {
      code: '<div left="10" top="20">',
    },
    {
      code: '<div left="10" top="20" class="test">',
    },
    {
      code: '<input min="5" class="field">',
    },

    // Empty attributes
    {
      code: "<div></div>",
    },

    // Single attribute
    {
      code: '<input type="text">',
    },
  ],
  invalid: [
    // Basic min/max separation
    {
      code: '<input min="5" type="text" max="10">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "min, max",
            separator: "type",
          },
        },
      ],
      output: '<input min="5" max="10" type="text">',
    },

    // Wrong order within group
    {
      code: '<input max="10" min="5">',
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            attrs: "max, min",
            expectedOrder: "min, max",
          },
        },
      ],
      output: '<input min="5" max="10">',
    },

    // minlength/maxlength separation
    {
      code: '<textarea minlength="5" placeholder="Enter text" maxlength="100">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "minlength, maxlength",
            separator: "placeholder",
          },
        },
      ],
      output:
        '<textarea minlength="5" maxlength="100" placeholder="Enter text">',
    },

    // width/height separation
    {
      code: '<img width="100" src="test.jpg" height="200" alt="Test">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "width, height",
            separator: "src",
          },
        },
      ],
      output: '<img width="100" height="200" src="test.jpg" alt="Test">',
    },

    // Multiple separators
    {
      code: '<input min="5" type="text" name="test" max="10">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "min, max",
            separator: "type, name",
          },
        },
      ],
      output: '<input min="5" max="10" type="text" name="test">',
    },

    // aria attributes separation
    {
      code: '<div aria-labelledby="label1" class="test" aria-describedby="desc1">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "aria-labelledby, aria-describedby",
            separator: "class",
          },
        },
      ],
      output:
        '<div aria-labelledby="label1" aria-describedby="desc1" class="test">',
    },

    // Custom groups
    {
      code: '<input data-start="1" type="text" data-end="10">',
      options: [{ groups: [["data-start", "data-end"]] }],
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "data-start, data-end",
            separator: "type",
          },
        },
      ],
      output: '<input data-start="1" data-end="10" type="text">',
    },

    // Partial groups - only some attributes from a group, but they should still be together
    {
      code: '<div left="10" class="box" top="20">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "left, top",
            separator: "class",
          },
        },
      ],
      output: '<div left="10" top="20" class="box">',
    },

    // Partial groups with 3 out of 4 attributes present
    {
      code: '<div left="0" width="100" top="10" height="50" right="100">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "width, height",
            separator: "top",
          },
        },
      ],
      output: '<div left="0" width="100" height="50" top="10" right="100">',
    },

    // Multiple violations - only first one will be reported/fixed
    {
      code: '<input min="5" type="text" max="10" width="100" class="test" height="200">',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "min, max",
            separator: "type",
          },
        },
      ],
      output:
        '<input min="5" max="10" type="text" width="100" class="test" height="200">',
    },
  ],
});

templateRuleTester.run("[template] group-attrs", rule, {
  valid: [
    {
      code: 'html`<input min="\\${min}" max="\\${max}">`',
    },
    {
      code: 'html`<div width="100" height="200">`',
    },
  ],
  invalid: [
    {
      code: 'html`<input min="\\${min}" type="text" max="\\${max}">`',
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "min, max",
            separator: "type",
          },
        },
      ],
      output: 'html`<input min="\\${min}" max="\\${max}" type="text">`',
    },
  ],
});
