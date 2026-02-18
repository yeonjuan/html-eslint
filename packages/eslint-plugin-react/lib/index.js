const rules = require("./rules");
const { name, version } = require("../package.json");

/** @import {ESLint} from "eslint" */

/** @type {ESLint.Plugin} */
const plugin = {
  meta: {
    name,
    version,
  },
  rules,
  configs: {},
};

module.exports = plugin;
