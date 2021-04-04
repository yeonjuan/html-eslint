const Parser = require("./parser");
const { visitorKeys } = require("./visitor-keys");

exports.parseForESLint = function parseForESLint(code) {
  const parser = new Parser({sourceCodeLocationInfo: true});
  const ast = parser.parse(code);
  return {
    ast,
    scopeManager: null,
    visitorKeys,
  };
};
