/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { getRuleUrl } = require("./utils/rule");
const { HtmlEslintAdapter } = require("./utils/capo-adapter");
const { analyzeHeadWithOrdering, getWeight } = require("@rviscomi/capo.js");
const { getSourceCode } = require("./utils/source-code");

const MESSAGE_IDS = {
  WRONG_ORDER: "wrongOrder",
};

/**
 * @typedef {Object} IgnorePattern
 * @property {string} [tagPattern] - Regex pattern for tag (e.g., "script",
 *   "link")
 * @property {string} [attrKeyPattern] - Regex pattern for attribute key (e.g.,
 *   "rel", "src")
 * @property {string} [attrValuePattern] - Regex pattern for attribute value
 */

/**
 * @typedef {Object} RuleOptions
 * @property {IgnorePattern[]} [ignores] - Array of ignore pattern objects
 */

/** @type {RuleModule<[RuleOptions?]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce optimal ordering of elements in `<head>`",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("head-order"),
    },

    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          ignores: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tagPattern: {
                  type: "string",
                },
                attrKeyPattern: {
                  type: "string",
                },
                attrValuePattern: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.WRONG_ORDER]:
        "{{nextCategory}} element should come before {{currentCategory}} element for optimal performance",
    },
  },

  create(context) {
    const adapter = new HtmlEslintAdapter();
    const sourceCode = getSourceCode(context);
    /** @type {RuleOptions} */
    const options = context.options[0] || {};
    const ignorePatterns = (options.ignores || []).map((pattern) => ({
      tagRegex: pattern.tagPattern ? new RegExp(pattern.tagPattern, "u") : null,
      attrKeyRegex: pattern.attrKeyPattern
        ? new RegExp(pattern.attrKeyPattern, "u")
        : null,
      attrValueRegex: pattern.attrValuePattern
        ? new RegExp(pattern.attrValuePattern, "u")
        : null,
    }));

    /**
     * Check if a tag should be ignored based on ignore patterns
     *
     * @param {any} element - Element node to check
     * @returns {boolean} - True if the element should be ignored
     */
    function shouldIgnoreElement(element) {
      return ignorePatterns.some((pattern) => {
        /** @type {boolean[]} */
        const checks = [];

        if (pattern.tagRegex) {
          const tagName = adapter.getTagName(element);
          checks.push(pattern.tagRegex.test(tagName));
        }

        if (pattern.attrKeyRegex) {
          const attrNames = adapter.getAttributeNames(element);
          const attrKeyRegex = pattern.attrKeyRegex;
          checks.push(attrNames.some((name) => attrKeyRegex.test(name)));
        }

        if (pattern.attrValueRegex) {
          const attrNames = adapter.getAttributeNames(element);
          const attrValueRegex = pattern.attrValueRegex;
          const hasMatchingValue = attrNames.some((name) => {
            const value = adapter.getAttribute(element, name);
            return value !== null && attrValueRegex.test(value);
          });
          checks.push(hasMatchingValue);
        }

        // All specified patterns must match (AND condition)
        return checks.length > 0 && checks.every((check) => check === true);
      });
    }

    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }
        const analysis = analyzeHeadWithOrdering(node, adapter);

        if (analysis.orderingViolations.length === 0) {
          return;
        }

        const children = adapter.getChildren(node);

        // Filter violations to exclude ignored elements
        const filteredViolations = analysis.orderingViolations.filter(
          (violation) =>
            !shouldIgnoreElement(violation.nextElement) &&
            !shouldIgnoreElement(violation.currentElement)
        );

        for (const violation of filteredViolations) {
          context.report({
            node: violation.nextElement,
            messageId: MESSAGE_IDS.WRONG_ORDER,
            data: {
              nextCategory: violation.nextCategory,
              currentCategory: violation.currentCategory,
            },
            fix(fixer) {
              // Separate children into ignored and non-ignored
              const childrenWithIgnoreFlag = children.map((child) => ({
                element: child,
                ignored: shouldIgnoreElement(child),
                originalIndex: children.indexOf(child),
              }));

              // Get non-ignored children and sort them
              const nonIgnoredChildren = childrenWithIgnoreFlag
                .filter((item) => !item.ignored)
                .map((item) => item.element);

              const sortedNonIgnored = [...nonIgnoredChildren].sort((a, b) => {
                const weightA = getWeight(a, adapter);
                const weightB = getWeight(b, adapter);
                return weightB - weightA;
              });

              const fixes = [];

              // Only replace non-ignored children
              let sortedIndex = 0;
              for (let i = 0; i < children.length; i++) {
                const originalChild = children[i];

                if (!shouldIgnoreElement(originalChild)) {
                  const sortedChild = sortedNonIgnored[sortedIndex];
                  sortedIndex++;

                  if (originalChild !== sortedChild) {
                    const sortedText = sourceCode.getText(sortedChild);
                    fixes.push(fixer.replaceText(originalChild, sortedText));
                  }
                }
              }

              return fixes;
            },
          });
        }
      },
    };
  },
};
