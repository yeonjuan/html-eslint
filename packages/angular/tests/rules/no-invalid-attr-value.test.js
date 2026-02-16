const rule = require("../../lib/rules/no-invalid-attr-value.js");
const angularParser = require("@angular-eslint/template-parser");

const { RuleTester } = require("eslint");

const ruleTester = new RuleTester({
  languageOptions: {
    parser: angularParser,
  },
});

ruleTester.run("no-invalid-attr-value", rule, {
  valid: [
    // Valid attribute values
    {
      code: '<img src="image.jpg" alt="description" />',
    },
    {
      code: '<a href="https://example.com">Link</a>',
    },
    {
      code: '<input type="text" />',
    },
    {
      code: '<input type="email" />',
    },
    {
      code: '<button type="submit">Submit</button>',
    },
    // Angular expressions should be ignored
    {
      code: '<img [src]="imageUrl" alt="description" />',
    },
    {
      code: '<input [type]="inputType" />',
    },
    {
      code: '<a [href]="dynamicUrl">Link</a>',
    },
    // Event bindings
    {
      code: '<button (click)="onClick()">Click</button>',
    },
    // Two-way binding
    {
      code: '<input [(ngModel)]="value" />',
    },
    // Structural directives
    {
      code: '<div *ngIf="show">Content</div>',
    },
    // Template reference variables
    {
      code: '<input #myInput type="text" />',
    },
    // Allow list - custom invalid values that should be allowed
    {
      code: '<input type="custom" />',
      options: [
        {
          allow: [
            {
              tag: "input",
              attr: "type",
              valuePattern: "custom",
            },
          ],
        },
      ],
    },
    {
      code: '<input type="custom-123" />',
      options: [
        {
          allow: [
            {
              tag: "input",
              attr: "type",
              valuePattern: "custom-\\d+",
            },
          ],
        },
      ],
    },
    // Allow without pattern (allows any value)
    {
      code: '<div data-test="anything goes here"></div>',
      options: [
        {
          allow: [
            {
              tag: "div",
              attr: "data-test",
            },
          ],
        },
      ],
    },
  ],
  invalid: [
    // Invalid input type
    {
      code: '<input type="invalid-type" />',
      errors: [
        {
          message:
            "Invalid value 'invalid-type' for attribute 'type' on <input>. Value \"invalid-type\" is not a valid keyword. Expected one of: hidden, text, search, tel, url, email, password, date, month, week, time, datetime-local, number, range, color, checkbox, radio, file, submit, image, reset, button",
        },
      ],
    },
    // Invalid button type
    {
      code: '<button type="invalid">Click</button>',
      errors: [
        {
          message:
            "Invalid value 'invalid' for attribute 'type' on <button>. Value \"invalid\" is not a valid keyword. Expected one of: submit, reset, button",
        },
      ],
    },
    // Invalid form method
    {
      code: '<form method="invalid"></form>',
      errors: [
        {
          message:
            "Invalid value 'invalid' for attribute 'method' on <form>. Value \"invalid\" is not a valid keyword. Expected one of: get, post, dialog",
        },
      ],
    },
    // Invalid autocomplete
    {
      code: '<input autocomplete="invalid-value" />',
      errors: [
        {
          message:
            "Invalid value 'invalid-value' for attribute 'autocomplete' on <input>. Invalid autofill field name: \"invalid-value\". Must be one of the standard autofill field names.",
        },
      ],
    },
    // Allow list should not prevent other invalid values
    {
      code: '<input type="other-invalid" />',
      options: [
        {
          allow: [
            {
              tag: "input",
              attr: "type",
              valuePattern: "custom",
            },
          ],
        },
      ],
      errors: [
        {
          message:
            "Invalid value 'other-invalid' for attribute 'type' on <input>. Value \"other-invalid\" is not a valid keyword. Expected one of: hidden, text, search, tel, url, email, password, date, month, week, time, datetime-local, number, range, color, checkbox, radio, file, submit, image, reset, button",
        },
      ],
    },
  ],
});
