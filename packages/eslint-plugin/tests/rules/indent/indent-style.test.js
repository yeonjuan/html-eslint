const { wrongIndentErrors } = require("./helpers");
const createRuleTester = require("../../rule-tester");
const rule = require("../../../lib/rules/indent");

const ruleTester = createRuleTester();

ruleTester.run("indent-style", rule, {
  valid: [
    // {
    //   code: `<button class="foo"></button>`,
    // },
  ],
  invalid: [
    {
      code: `<html>
  <style>
.foo {}
  </style>
</html>`,
      output: `<html>
  <style>
    .foo {}
  </style>
</html>`,
      errors: wrongIndentErrors(1),
      options: [2],
    },
    {
      code: `<html>
  <style>
.foo .bar {}
  </style>
</html>`,
      output: `<html>
  <style>
    .foo .bar {}
  </style>
</html>`,
      errors: wrongIndentErrors(1),
      options: [2],
    },
    {
      code: `<html>
  <style>
#foo {}
  </style>
</html>`,
      output: `<html>
  <style>
    #foo {}
  </style>
</html>`,
      errors: wrongIndentErrors(1),
      options: [2],
    },
    {
      code: `<html>
  <style>
h1
~ 
p {}
  </style>
</html>`,
      output: `<html>
  <style>
    h1
    ~ 
    p {}
  </style>
</html>`,
      errors: wrongIndentErrors(3),
      options: [2],
    },
    {
      code: `<html>
  <style>
.foo
.bar {}
  </style>
</html>`,
      output: `<html>
  <style>
    .foo
    .bar {}
  </style>
</html>`,
      errors: wrongIndentErrors(2),
      options: [2],
    },
    {
      code: `<html>
  <style>
    p {
background: red;
    }
  </style>
</html>`,
      output: `<html>
  <style>
    p {
      background: red;
    }
  </style>
</html>`,
      errors: wrongIndentErrors(1),
      options: [2],
    },
  ],
});
