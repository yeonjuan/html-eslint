const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-entity");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-invalid-entity", rule, {
  valid: [
    { code: "<p>&lt; &gt; &amp; &nbsp;</p>" },
    { code: "<p>&#xD55C;</p>" },
  ],
  invalid: [
    {
      code: "<p>&nbsb;</p>", // Typo in entity name
      errors: [{ message: "Invalid HTML entity '&nbsb;' used." }],
    },
    {
      code: "<p>&unknown;</p>", // Undefined entity
      errors: [{ message: "Invalid HTML entity '&unknown;' used." }],
    },
    {
      code: "<p>&#zzzz;</p>", // Invalid numeric entity
      errors: [{ message: "Invalid HTML entity '&#zzzz;' used." }],
    },
    {
      code: "<p>&#x110000;</p>",
      errors: [{ message: "Invalid HTML entity '&#x110000;' used." }],
    },
  ],
});

templateRuleTester.run("[template] no-invalid-entity", rule, {
  valid: [],
  invalid: [],
});
