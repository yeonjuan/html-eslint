const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-lang");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-lang", rule, {
  valid: [
    {
      code: `
<html lang="ko">
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<html>
</html>
`,

      errors: [
        {
          messageId: "missing",
          line: 2,
          column: 1,
          endColumn: 7,
          endLine: 2,
        },
      ],
    },
    {
      code: `
<html lang="">
</html>
`,

      errors: [
        {
          messageId: "empty",
        },
      ],
    },
    {
      code: `
<html lang="  ">
</html>
`,

      errors: [
        {
          messageId: "empty",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-lang", rule, {
  valid: [
    {
      code: `html\`<html lang="ko"></html>\``,
    },
    {
      code: `html\`<html lang="\${lang}"></html>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<html></html>\``,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
  ],
});
