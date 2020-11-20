const createParser = require("./parser");
const { visitorKeys } = require("./visitor-keys");

exports.parseForESLint = function parseForESLint(code) {
  const parser = createParser();
  const ast = parser.parse(code);
  return {
    ast,
    scopeManager: null,
    visitorKeys,
  };
};
