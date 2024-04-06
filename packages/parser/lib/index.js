const { parseForESLint } = require("./parser");
const meta = require("./meta");
const { NODE_TYPES } = require("./node-types");

module.exports.parseForESLint = parseForESLint;
module.exports.NODE_TYPES = NODE_TYPES;

module.exports = {
  parseForESLint,
  NODE_TYPES,
  meta,
};
