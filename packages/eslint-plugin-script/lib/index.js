/**
 * @import {
 *   ESLint,
 *   Linter
 * } from "eslint"
 */

const { name, version } = require("../package.json");
const processor = require("./processor");
const { recommended } = require("./configs");

/**
 * @type {ESLint.Plugin & {
 *   configs: { recommended: Linter.Config };
 * }}
 */
const plugin = {
  meta: {
    name,
    version,
  },
  processors: {
    script: processor,
  },
  configs: {
    recommended,
  },
};

module.exports = plugin;
