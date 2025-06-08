const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-entity");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-invalid-entity", rule, {
  valid: [
    { code: "<p>&lt; &gt; &amp; &nbsp;</p>" }, // Valid entities
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
  ],
});

templateRuleTester.run("[template] no-invalid-entity", rule, {
  valid: [],
  invalid: [],
});
