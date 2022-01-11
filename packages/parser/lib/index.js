const Parser = require("./parser");
const { visitorKeys } = require("./visitor-keys");
const PostProcessor = require("./postprocessor/postprocessor");

exports.parseForESLint = function parseForESLint(code) {
  const parser = new Parser({ sourceCodeLocationInfo: true });
  const postProcessor = new PostProcessor();
  const ast = parser.parse(code);
  const after = postProcessor.process(ast);
  return {
    ast: after,
    scopeManager: null,
    visitorKeys,
  };
};
