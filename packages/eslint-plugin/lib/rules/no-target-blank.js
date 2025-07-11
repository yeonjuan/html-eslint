/**
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missing",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow usage of unsafe `target='_blank'`",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-target-blank"),
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
    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "a") {
          return;
        }

        const target = findAttr(node, "target");
        if (target && target.value && target.value.value === "_blank") {
          const href = findAttr(node, "href");
          if (href && href.value && isExternalLink(href.value.value)) {
            const rel = findAttr(node, "rel");
            if (rel && rel.value && rel.value.parts.length) {
              return;
            }

            if (!rel || !rel.value || !rel.value.value.includes("noreferrer")) {
              context.report({
                node: target,
                messageId: MESSAGE_IDS.MISSING,
              });
            }
          }
        }
      },
    });
  },
};
