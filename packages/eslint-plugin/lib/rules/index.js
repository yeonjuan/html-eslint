const requireLang = require("./require-lang");
const requireImgAlt = require("./require-img-alt");
const requireDoctype = require("./require-doctype");
const requireTitle = require("./require-title");
const noDuplicateId = require("./no-duplicate-id");
const noInlineStyles = require("./no-inline-styles");

module.exports = {
  "require-lang": requireLang,
  "require-img-alt": requireImgAlt,
  "require-doctype": requireDoctype,
  "require-title": requireTitle,
  "no-duplicate-id": noDuplicateId,
  "no-inline-styles": noInlineStyles,
};
