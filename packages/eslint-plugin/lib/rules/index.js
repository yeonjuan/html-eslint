const requireLang = require("./require-lang");
const requireImgAlt = require("./require-img-alt");
const requireDoctype = require("./require-doctype");
const requireTitle = require("./require-title");
const noDuplicateId = require("./no-duplicate-id");
const noInlineStyles = require("./no-inline-styles");
const noMultipleH1 = require("./no-multiple-h1");

module.exports = {
  "require-lang": requireLang,
  "require-img-alt": requireImgAlt,
  "require-doctype": requireDoctype,
  "require-title": requireTitle,
  "no-duplicate-id": noDuplicateId,
  "no-inline-styles": noInlineStyles,
  "no-multiple-h1": noMultipleH1,
};
