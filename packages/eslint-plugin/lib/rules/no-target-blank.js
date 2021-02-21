const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow usage of unsafe `target='_blank'`",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected ...", // TODO Message
    },
  },

  create() {
    return {
      A(node) {
        /* eslint-disable */
        const target = NodeUtils.findAttr(node, "target");
        const href = NodeUtils.findAttr(node, 'href');
        const rel = NodeUtils.findAttr(node, 'rel');
        // TODO: report
      },
    };
  },
};
