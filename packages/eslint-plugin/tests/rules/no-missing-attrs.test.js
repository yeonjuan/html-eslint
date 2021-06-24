const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-missing-attrs");

const ruleTester = createRuleTester();

ruleTester.run("id-missing-attrs", rule, {
  valid: [
    {
      code: `<span translate>inside value</span>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
    {
      code: `<span notranslate>inside value</span>`,
    },
    {
      code: `<span>{{variable}}</span>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
    {
      code: `<span class="popup" popup>inside value</span>`,
      options: [{ exceptString: ["popup"] }],
    },
    {
      code: `<td data-cy="table">
        (
      </td>`,
      options: [
        { exceptString: ["translate", "notranslate"], specialCharacters: true },
      ],
    },
    {
      code: `<div class="order">
        <span translate="true">inside value</span>
      </div>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
  ],
  invalid: [
    {
      code: `<h1 id="header">inside value</h1>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
      errors: [
        {
          message: "Some attributes translate, notranslate are missing.",
        },
      ],
    },
    {
      code: `<h1>inside value</h1>`,
      options: [{ exceptString: ["popup"] }],
      errors: [
        {
          message: "Some attributes popup are missing.",
        },
      ],
    },
    {
      code: `<div class="order">
        <!-- comment -->
        <h2>inside value</h2>
      </div>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
      errors: [
        {
          message: "Some attributes translate, notranslate are missing.",
        },
      ],
    },
  ],
});
