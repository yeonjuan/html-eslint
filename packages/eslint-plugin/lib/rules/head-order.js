/**
 * @import {
 *   RuleFixer,
 *   RuleModule
 * } from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { getRuleUrl } = require("./utils/rule");
const { HtmlEslintAdapter } = require("./utils/capo-adapter");
const {
  analyzeHeadWithOrdering,
  getWeight,
  isMeta,
  isMetaCSP,
} = require("@rviscomi/capo.js");
const { getSourceCode } = require("./utils/source-code");
const { parseTemplateLiteral } = require("./utils/template-literal");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { NODE_TYPES } = require("@html-eslint/parser");

const MESSAGE_IDS = {
  WRONG_ORDER: "wrongOrder",
  WRONG_META_ORDER: "wrongMetaOrder",
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
 * @property {boolean} [enforceMetaOrder] - Enforce the order of META elements:
 *   Content-Security-Policy, charset, viewport, base, then the rest
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
          enforceMetaOrder: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.WRONG_ORDER]:
        "{{nextCategory}} element should come before {{currentCategory}} element for optimal performance",
      [MESSAGE_IDS.WRONG_META_ORDER]:
        "{{next}} should come before {{current}} for optimal performance",
    },
  },

  create(context) {
    const adapter = new HtmlEslintAdapter();
    const sourceCode = getSourceCode(context);
    /** @type {RuleOptions} */
    const options = context.options[0] || {};
    const enforceMetaOrder = options.enforceMetaOrder === true;
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
     * Check if a tag should be ignored based on ignore patterns or if it's a
     * comment
     *
     * @param {any} element - Element node to check
     * @returns {boolean} - True if the element should be ignored
     */
    function shouldIgnoreElement(element) {
      // Ignore HTML comments
      if (element.type === NODE_TYPES.Comment) {
        return true;
      }

      return ignorePatterns.some(
        ({ tagRegex, attrKeyRegex, attrValueRegex }) => {
          /** @type {boolean[]} */
          const checks = [];

          if (tagRegex) {
            const tagName = adapter.getTagName(element);
            checks.push(tagRegex.test(tagName));
          }

          if (attrKeyRegex) {
            const attrNames = adapter.getAttributeNames(element);
            checks.push(attrNames.some((name) => attrKeyRegex.test(name)));
          }

          if (attrValueRegex) {
            const attrNames = adapter.getAttributeNames(element);
            const hasMatchingValue = attrNames.some((name) => {
              const value = adapter.getAttribute(element, name);
              return value !== null && attrValueRegex.test(value);
            });
            checks.push(hasMatchingValue);
          }

          // All specified patterns must match (AND condition)
          return checks.length > 0 && checks.every((check) => check === true);
        }
      );
    }

    /**
     * @param {any} element - Element node
     * @returns {number} - Position of a META element within its category, 0
     *   when `enforceMetaOrder` is off
     */
    function getMetaWeight(element) {
      if (!enforceMetaOrder || !isMeta(element, adapter)) {
        return 0;
      }
      if (isMetaCSP(element, adapter)) {
        return 4;
      }
      const httpEquiv = adapter.getAttribute(element, "http-equiv");
      if (
        adapter.hasAttribute(element, "charset") ||
        (httpEquiv && httpEquiv.toLowerCase() === "content-type")
      ) {
        return 3;
      }
      const name = adapter.getAttribute(element, "name");
      if (name && name.toLowerCase() === "viewport") {
        return 2;
      }
      if (adapter.getTagName(element) === "base") {
        return 1;
      }
      return 0;
    }

    /**
     * @param {any} element - META element node
     * @returns {string} - Short description like `<meta charset>` or `<base>`
     */
    function getMetaLabel(element) {
      const tagName = adapter.getTagName(element);
      if (tagName !== "meta") {
        return `<${tagName}>`;
      }
      if (
        !isMetaCSP(element, adapter) &&
        adapter.hasAttribute(element, "charset")
      ) {
        return "<meta charset>";
      }
      for (const attrName of ["http-equiv", "name"]) {
        const value = adapter.getAttribute(element, attrName);
        if (value) {
          return `<meta ${attrName}="${value}">`;
        }
      }
      return "<meta>";
    }

    /**
     * Find consecutive META elements that are in the wrong order
     *
     * @param {any[]} children - Non-ignored children of the head tag
     * @returns {{ currentElement: any; nextElement: any }[]}
     */
    function getMetaOrderingViolations(children) {
      const metaElements = children.filter((child) => isMeta(child, adapter));
      const violations = [];
      for (let i = 0; i < metaElements.length - 1; i++) {
        const currentElement = metaElements[i];
        const nextElement = metaElements[i + 1];
        if (getMetaWeight(currentElement) < getMetaWeight(nextElement)) {
          violations.push({ currentElement, nextElement });
        }
      }
      return violations;
    }

    /**
     * Process a head tag node and report violations
     *
     * @param {any} node - Head tag node to process
     */
    function processHeadTag(node) {
      if (node.name !== "head") {
        return;
      }
      const analysis = analyzeHeadWithOrdering(node, adapter);
      const children = adapter.getChildren(node);
      const nonIgnoredChildren = children.filter(
        (child) => !shouldIgnoreElement(child)
      );

      // Filter violations to exclude ignored elements
      const filteredViolations = analysis.orderingViolations.filter(
        (violation) =>
          !shouldIgnoreElement(violation.nextElement) &&
          !shouldIgnoreElement(violation.currentElement)
      );
      const metaViolations = getMetaOrderingViolations(nonIgnoredChildren);

      if (filteredViolations.length === 0 && metaViolations.length === 0) {
        return;
      }

      /** @param {RuleFixer} fixer */
      function fix(fixer) {
        const sortedNonIgnored = [...nonIgnoredChildren].sort((a, b) => {
          const weightA = getWeight(a, adapter);
          const weightB = getWeight(b, adapter);
          return weightB - weightA || getMetaWeight(b) - getMetaWeight(a);
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
              // @ts-ignore
              const sortedText = sourceCode.getText(sortedChild);
              fixes.push(fixer.replaceText(originalChild, sortedText));
            }
          }
        }

        return fixes;
      }

      for (const violation of filteredViolations) {
        context.report({
          node: violation.nextElement,
          messageId: MESSAGE_IDS.WRONG_ORDER,
          data: {
            nextCategory: violation.nextCategory,
            currentCategory: violation.currentCategory,
          },
          fix,
        });
      }

      for (const violation of metaViolations) {
        context.report({
          node: violation.nextElement,
          messageId: MESSAGE_IDS.WRONG_META_ORDER,
          data: {
            next: getMetaLabel(violation.nextElement),
            current: getMetaLabel(violation.currentElement),
          },
          fix,
        });
      }
    }

    return {
      Tag(node) {
        processHeadTag(node);
      },

      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          const visitor = {
            Tag: processHeadTag,
          };
          parseTemplateLiteral(node.quasi, sourceCode, visitor);
        }
      },

      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          const visitor = {
            Tag: processHeadTag,
          };
          parseTemplateLiteral(node, sourceCode, visitor);
        }
      },
    };
  },
};
