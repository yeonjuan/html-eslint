/**
 * @import {RuleModule} from "../types";
 * @import {Tag, ScriptTag} from "@html-eslint/types"
 * @typedef {{ attr: string; when: (node: Tag | ScriptTag) => boolean; message: string; }} AttributeChecker
 */

const { RULE_CATEGORY } = require("../constants");
const { hasAttr, hasTemplate, findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

/**
 * @param {Tag | ScriptTag} node
 * @param {string} attrName
 * @returns {string | undefined}
 */
function getAttrValue(node, attrName) {
  const attr = node.attributes.find(
    (a) => a.type === "Attribute" && a.key.value === attrName
  );
  if (!attr || !attr.value) return undefined;
  return attr.value.value;
}

/**
 * @param {Tag | ScriptTag} node
 * @param {string} attrName
 * @returns {boolean}
 */
function isTemplateValueAttr(node, attrName) {
  const attr = findAttr(node, attrName);
  if (!attr || !attr.value) return false;
  return hasTemplate(attr.value);
}

/**
 * @type {Record<string, AttributeChecker[]>}
 */
const checkersByTag = {
  input: [
    {
      attr: "multiple",
      when: (node) => {
        const type = getAttrValue(node, "type") || "text";
        return [
          "text",
          "password",
          "radio",
          "checkbox",
          "image",
          "hidden",
          "reset",
          "button",
        ].includes(type);
      },
      message: 'The "multiple" attribute has no effect on this input type.',
    },
    {
      attr: "accept",
      when: (node) => {
        if (isTemplateValueAttr(node, "type")) {
          return false;
        }
        const type = getAttrValue(node, "type") || "text";
        return type !== "file";
      },
      message:
        'The "accept" attribute has no effect unless input type is "file".',
    },
    {
      attr: "readonly",
      when: (node) => {
        const type = getAttrValue(node, "type") || "text";
        return ["checkbox", "radio", "file", "range", "color"].includes(type);
      },
      message: 'The "readonly" attribute has no effect on this input type.',
    },
  ],
  script: [
    {
      attr: "defer",
      when: (node) => !hasAttr(node, "src"),
      message: 'The "defer" attribute has no effect on inline scripts.',
    },
    {
      attr: "async",
      when: (node) => !hasAttr(node, "src"),
      message: 'The "async" attribute has no effect on inline scripts.',
    },
  ],
  a: [
    {
      attr: "download",
      when: (node) => !hasAttr(node, "href"),
      message: 'The "download" attribute has no effect without an "href".',
    },
  ],
  audio: [
    {
      attr: "controlslist",
      when: (node) => !hasAttr(node, "controls"),
      message: 'The "controlslist" attribute has no effect without "controls".',
    },
  ],
  video: [
    {
      attr: "controlslist",
      when: (node) => !hasAttr(node, "controls"),
      message: 'The "controlslist" attribute has no effect without "controls".',
    },
  ],
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  name: "no-ineffective-attrs",
  meta: {
    docs: {
      description:
        "Disallow HTML attributes that have no effect in their context",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },
    messages: {
      ineffective: "{{ message }}",
    },
    schema: [],
    type: "problem",
  },
  defaultOptions: [],
  create(context) {
    return createVisitors(context, {
      /**
       * @param {Tag} node
       */
      Tag(node) {
        const tagCheckers = checkersByTag[node.name];
        if (!tagCheckers) return;

        for (const check of tagCheckers) {
          for (const attr of node.attributes) {
            if (attr.type !== "Attribute") continue;
            if (attr.key.value !== check.attr) continue;

            if (check.when(node)) {
              context.report({
                loc: attr.loc,
                messageId: "ineffective",
                data: {
                  message: check.message,
                },
              });
            }
          }
        }
      },
      /**
       * @param {ScriptTag} node
       */
      ScriptTag(node) {
        const scriptCheckers = checkersByTag.script;
        if (!scriptCheckers) return;

        for (const check of scriptCheckers) {
          for (const attr of node.attributes) {
            if (attr.type !== "Attribute") continue;
            if (attr.key.value !== check.attr) continue;

            if (check.when(node)) {
              context.report({
                loc: attr.loc,
                messageId: "ineffective",
                data: {
                  message: check.message,
                },
              });
            }
          }
        }
      },
    });
  },
};
