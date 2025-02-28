const { parseForESLint } = require("./parser");
const meta = require("./meta");
const { NODE_TYPES } = require("./node-types");
const TEMPLATE_ENGINE_SYNTAX = require("./template-engine-syntax-preset");

module.exports = {
  TEMPLATE_ENGINE_SYNTAX,
  parseForESLint,
  NODE_TYPES,
  meta,
};
