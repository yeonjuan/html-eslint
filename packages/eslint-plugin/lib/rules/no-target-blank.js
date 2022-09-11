/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
};

/**
 * @type {Rule}
 */
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
      [MESSAGE_IDS.MISSING]: 'Missing `rel="noreferrer"` attribute in a tag.',
    },
  },

  create(context) {
    /**
     * Checks whether a link is an external link or not.
     * @param {string} link A link to check
     * @returns {boolean}
     */
    function isExternalLink(link) {
      return /^(?:\w+:|\/\/)/.test(link);
    }
    return {
      Tag(node) {
        if (node.name !== "a") {
          return;
        }
        /* eslint-disable */
        const target = NodeUtils.findAttr(node, "target");
        if (target && target.value && target.value.value === "_blank") {
          const href = NodeUtils.findAttr(node, "href");
          if (href && href.value && isExternalLink(href.value.value)) {
            const rel = NodeUtils.findAttr(node, "rel");
            if (!rel || !rel.value || !rel.value.value.includes("noreferrer")) {
              context.report({
                node: target,
                messageId: MESSAGE_IDS.MISSING,
              });
            }
          }
        }
      },
    };
  },
};
