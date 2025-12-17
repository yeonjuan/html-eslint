/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");

/** @type {RuleModule} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "FILL ME",
      recommended: false,
      category: RULE_CATEGORY.BEST_PRACTICE,
    },
  },
  fixable: null,
  schema: [],
  create() {},
};
