const { parseForESLint } = require("./parser");
const meta = require("./meta");
const { NODE_TYPES } = require("./node-types");
const TEMPLATE_ENGINE_SYNTAX = require("./template-engine-syntax-preset");

module.exports.parseForESLint = parseForESLint;
module.exports.NODE_TYPES = NODE_TYPES;

module.exports = {
  TEMPLATE_ENGINE_SYNTAX,
  parseForESLint,
  NODE_TYPES,
  meta,
};
