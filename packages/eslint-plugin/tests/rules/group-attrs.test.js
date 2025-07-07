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

    // Regex groups - valid cases (alphabetically sorted)
    {
      code: '<input data-x="1" data-y="2">',
      options: [{ groups: [["/^data-/"]] }],
    },
    {
      code: '<div aria-describedby="desc" aria-label="test">',
      options: [{ groups: [["/^aria-/"]] }],
    },
    {
      code: '<input data-min="5" data-max="10">',
      options: [{ groups: [["/^data-min$/", "/^data-max$/"]] }],
    },
    {
      code: '<div class="test" id="example" style="color: red">',
      options: [{ groups: [["class", "id", "style"]] }],
    },

    // First match precedence - data-x matches first group, aria-x matches second
    {
      code: '<input data-x="1" data-y="2">',
      options: [{ 
        groups: [
          ["data-x", "data-y"],
          ["data-y", "data-x"]
        ] 
      }],
    },
    {
      code: '<input data-y="2" data-x="1">',
      options: [{ 
        groups: [
          ["data-y", "data-x"],
          ["data-x", "data-y"]
        ] 
      }],
    },

    // Mixed string and regex patterns
    {
      code: '<input type="text" data-x="1" data-y="2">',
      options: [{ 
        groups: [
          ["type", "/^data-/"]
        ] 
      }],
    },
    // Order doesn't matter within data-*
    {
      code: '<input type="text" data-y="2" data-x="1">',
      options: [{ 
        groups: [
          ["type", "/^data-/"]
        ] 
      }],
    },
    // Order doesn't matter within data-*
    {
      code: '<input type="text" data-x="2" data-y="1">',
      options: [{ 
        groups: [
          ["type", "/^data-/"]
        ] 
      }],
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
            attrs: "left, top, right",
            separator: "width, height",
          },
        },
      ],
      output: '<div left="0" top="10" right="100" width="100" height="50">',
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

    // Regex groups - invalid cases (not grouped)
    {
      code: '<input data-x="1" type="text" data-y="2">',
      options: [{ groups: [["/^data-/"]] }],
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "data-x, data-y",
            separator: "type",
          },
        },
      ],
      output: '<input data-x="1" data-y="2" type="text">',
    },

    // Regex groups - wrong alphabetical order
    {
      code: '<input data-y="2" data-x="1">',
      options: [{ groups: [["/^data-/"]] }],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            attrs: "data-y, data-x",
            expectedOrder: "data-x, data-y",
          },
        },
      ],
      output: '<input data-x="1" data-y="2">',
    },

    // Regex groups - multiple attributes in wrong alphabetical order
    {
      code: '<div data-start="1" data-end="10" data-step="2">',
      options: [{ groups: [["/^data-/"]] }],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            attrs: "data-start, data-end, data-step",
            expectedOrder: "data-end, data-start, data-step",
          },
        },
      ],
      output: '<div data-end="10" data-start="1" data-step="2">',
    },

    // Regex groups - aria attributes in wrong alphabetical order
    {
      code: '<div aria-label="test" aria-describedby="desc">',
      options: [{ groups: [["/^aria-/"]] }],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            attrs: "aria-label, aria-describedby",
            expectedOrder: "aria-describedby, aria-label",
          },
        },
      ],
      output: '<div aria-describedby="desc" aria-label="test">',
    },


    // Mixed string and regex patterns - invalid
    {
      code: '<input type="text" class="test" data-x="1">',
      options: [{ 
        groups: [
          ["type", "/^data-/"]
        ] 
      }],
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "type, data-x",
            separator: "class",
          },
        },
      ],
      output: '<input type="text" data-x="1" class="test">',
    },
    // Mixed string and regex patterns - wrong order within group
    {
      code: '<input data-x="1" type="text" data-y="2">',
      options: [{ 
        groups: [
          ["type", "/^data-/"]
        ] 
      }],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            attrs: "data-x, type, data-y",
            expectedOrder: "type, data-x, data-y",
          },
        },
      ],
      output: '<input type="text" data-x="1" data-y="2">',
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
    // Regex groups in templates (alphabetically sorted)
    {
      code: 'html`<input data-x="\\${x}" data-y="\\${y}">`',
      options: [{ groups: [["/^data-/"]] }],
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
    // Regex groups in templates - invalid
    {
      code: 'html`<input data-x="\\${x}" type="text" data-y="\\${y}">`',
      options: [{ groups: [["/^data-/"]] }],
      errors: [
        {
          messageId: "notGrouped",
          data: {
            attrs: "data-x, data-y",
            separator: "type",
          },
        },
      ],
      output: 'html`<input data-x="\\${x}" data-y="\\${y}" type="text">`',
    },
  ],
});
