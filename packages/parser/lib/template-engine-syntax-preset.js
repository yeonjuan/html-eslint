/** @import {SyntaxConfig} from "@html-eslint/template-syntax-parser" */

/** @type {SyntaxConfig} */
const HANDLEBAR = {
  "{{": "}}",
};

/** @type {SyntaxConfig} */
const TWIG = [
  { open: "{{", close: "}}" },
  { open: "{%", close: "%}" },
  { open: "{#", close: "#}", isComment: true },
];

/** @type {SyntaxConfig} */
const ERB = {
  "<%": "%>",
};

module.exports = {
  HANDLEBAR,
  TWIG,
  ERB,
};
