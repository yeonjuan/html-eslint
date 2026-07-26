/**
 * @import {
 *   Attribute,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {
 *   RuleModule,
 *   SuggestionReportDescriptor
 * } from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { hasTemplate } = require("./utils/node");
const {
  getBranchSegments,
  areInMutuallyExclusiveBranches,
} = require("./utils/branch-segments");

const MESSAGE_IDS = {
  DUPLICATE_ATTRS: "duplicateAttrs",
  REMOVE_ATTR: "removeAttr",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow duplicate attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-duplicate-attrs"),
    },

    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ATTRS]:
        "The attribute '{{attrName}}' is duplicated.",
      [MESSAGE_IDS.REMOVE_ATTR]:
        "Remove this duplicate '{{attrName}}' attribute.",
    },
  },

  create(context) {
    const branchSegments = getBranchSegments(context);

    /**
     * @param {Attribute} node
     * @returns {SuggestionReportDescriptor[]}
     */
    function getSuggestions(node) {
      return [
        {
          messageId: MESSAGE_IDS.REMOVE_ATTR,
          fix: (fixer) => fixer.removeRange(node.range),
          data: {
            attrName: node.key.value,
          },
        },
      ];
    }

    /** @param {Tag | StyleTag | ScriptTag} node */
    function check(node) {
      if (!Array.isArray(node.attributes)) return;

      // Maps a normalised attribute key to the list of attribute nodes for
      // that key that have NOT yet been reported as duplicates.
      //
      // Invariant: every pair of nodes in any list is mutually exclusive
      // (they live in different branches of the same template if-block).
      //
      // When a new occurrence arrives we check it against the whole stored
      // list.  If it is exclusive with ALL of them, the invariant still holds
      // and we add it without reporting.  If it is NOT exclusive with at least
      // one of them, it is a genuine runtime duplicate and we report it.
      //
      // This list-based approach correctly handles edge cases such as:
      //
      //   <span {%- if c1 -%}class="a"{%- else -%}class="b"{%- endif -%}
      //         {%- if c1 -%}class="c"{%- endif -%}>
      //
      // where class[a] and class[c] (both in the same branch) are real
      // duplicates even though class[a]/class[b] and class[b]/class[c] are
      // individually exclusive.
      /** @type {Map<string, Attribute[]>} */
      const attrsMap = new Map();

      node.attributes.forEach((attr) => {
        if (hasTemplate(attr.key)) {
          return;
        }
        const key = attr.key.value.toLowerCase();

        if (attrsMap.has(key)) {
          const prevList = /** @type {Attribute[]} */ (attrsMap.get(key));

          // Build the candidate full list and test pairwise exclusivity.
          const candidate = [...prevList, attr];
          if (areInMutuallyExclusiveBranches(candidate, branchSegments)) {
            // All pairs (including the new attr) are branch-exclusive: no
            // report, and add attr to the list to track further occurrences.
            prevList.push(attr);
          } else {
            context.report({
              node: attr,
              data: {
                attrName: attr.key.value,
              },
              messageId: MESSAGE_IDS.DUPLICATE_ATTRS,
              suggest: getSuggestions(attr),
            });
            // Do NOT add to prevList: a confirmed duplicate should not
            // suppress future occurrences via the invariant.
          }
        } else {
          attrsMap.set(key, [attr]);
        }
      });
    }

    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
