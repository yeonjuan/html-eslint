/**
 * @import {Tag} from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { findParent, isTag, getNameOf } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missingLabel",
};

const INPUT_TAGS = new Set(["input", "textarea", "select"]);

const LABEL_ATTRIBUTES = new Set(["aria-labelledby", "aria-label"]);

const SELF_LABELING_INPUT_TYPES = new Set(["button", "reset", "submit"]);

/**
 * True if the attribute exists and its value is non-empty and not only whitespace.
 * @param {Tag["attributes"][number] | undefined} attr
 */
function hasNonWhitespaceValue(attr) {
  return Boolean(attr?.value?.value && attr.value.value.trim().length > 0);
}

/**
 * Walks the whole document collecting `for` attribute values
 * from <label for="..."> elements, so inputs anywhere in the
 * document can be matched against them.
 */
function collectLabelForTargets(root) {
  const targets = new Set();

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }
    if (isTag(node) && getNameOf(node) === "label") {
      for (const attr of node.attributes) {
        if (
          attr.key.value.toLowerCase() === "for" &&
          attr.value?.value?.trim()
        ) {
          targets.add(attr.value.value);
        }
      }
    }
    const children = node.children || node.body || [];
    for (const child of children) {
      walk(child);
    }
  }

  walk(root);
  return targets;
}

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforces use of label for form elements(`input`, `textarea`, `select`)",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("require-input-label"),
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing an associated label",
    },
  },
  create(context) {
    const labelForTargets = collectLabelForTargets(context.sourceCode.ast);
    return createVisitors(context, {
      Tag(node) {
        const tagName = getNameOf(node);
        if (!INPUT_TAGS.has(tagName)) {
          return;
        }

        /** @type {string | undefined} */
        let idValue;
        /** @type {string | undefined} */
        let type;
        /** @type {Tag["attributes"][number] | undefined} */
        let valueAttr;
        /** @type {Tag["attributes"][number] | undefined} */
        let altAttr;
        /** @type {Tag["attributes"][number] | undefined} */
        let titleAttr;

        for (const attr of node.attributes) {
          const key = attr.key.value.toLowerCase();

          if (LABEL_ATTRIBUTES.has(key) && hasNonWhitespaceValue(attr)) {
            return;
          }

          switch (key) {
            case "id":
              idValue = attr.value?.value;
            case "type":
              type = attr.value?.value?.toLowerCase();
              break;
            case "value":
              valueAttr = attr;
              break;
            case "alt":
              altAttr = attr;
              break;
            case "title":
              titleAttr = attr;
              break;
          }
        }

        if (tagName === "input") {
          if (type === "hidden") {
            return;
          }

          if (
            SELF_LABELING_INPUT_TYPES.has(type) &&
            hasNonWhitespaceValue(valueAttr)
          ) {
            return;
          }

          if (
            type === "image" &&
            (hasNonWhitespaceValue(altAttr) ||
              hasNonWhitespaceValue(titleAttr) ||
              hasNonWhitespaceValue(valueAttr))
          ) {
            return;
          }
        }

        const label = findParent(node, (parent) => {
          return isTag(parent) && getNameOf(parent) === "label";
        });

        if (label) {
          return;
        }
        
        if (idValue && labelForTargets.has(idValue)) {
          return;
        }

        context.report({
          node,
          messageId: "missingLabel",
        });
      },
    });
  },
};
