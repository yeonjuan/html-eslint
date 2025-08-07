/**
 * @import {Tag} from "@html-eslint/types"
 * @import {RuleModule} from "../types";
 * @typedef {{ tag: string; }} Checker
 */

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

function getAttrValue(node, attrName) {
  const attr = node.attributes.find(
    (a) => a.type === "Attribute" && a.key.name === attrName
  );
  if (!attr || !attr.value || attr.value.type !== "Text") return undefined;
  return attr.value.value;
}

function hasAttr(node, attrName) {
  return node.attributes.some(
    (a) => a.type === "Attribute" && a.key.name === attrName
  );
}

const checkers = [
  {
    tag: "input",
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
    tag: "input",
    attr: "accept",
    when: (node) => {
      const type = getAttrValue(node, "type") || "text";
      return type !== "file";
    },
    message:
      'The "accept" attribute has no effect unless input type is "file".',
  },
  {
    tag: "script",
    attr: "defer",
    when: (node) => !hasAttr(node, "src"),
    message: 'The "defer" attribute has no effect on inline scripts.',
  },
  {
    tag: "textarea",
    attr: "value",
    when: () => true,
    message:
      'The "value" attribute has no effect on <textarea>. Use its content instead.',
  },
  {
    tag: "a",
    attr: "download",
    when: (node) => !hasAttr(node, "href"),
    message: 'The "download" attribute has no effect without an "href".',
  },
  {
    tag: "form",
    attr: "enctype",
    when: (node) => {
      const method = (getAttrValue(node, "method") || "get").toLowerCase();
      return method !== "post";
    },
    message: 'The "enctype" attribute is only relevant when method is "post".',
  },
];

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  name: "no-ineffective-attrs",
  meta: {
    docs: {
      description: "Disallow HTML attributes that have no effect in context",
      category: "Possible Errors",
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
    return {
      Tag(node) {
        for (const check of checks) {
          if (node.tagName !== check.tag) continue;

          for (const attr of node.attributes) {
            if (attr.type !== "Attribute") continue;
            if (attr.key.name !== check.attr) continue;

            if (check.when(node, attr)) {
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
    };
  },
};
