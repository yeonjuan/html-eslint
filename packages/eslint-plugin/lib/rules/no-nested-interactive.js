/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").Tag } Tag
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2
 * @param {Tag} tag
 * @returns {boolean}
 */
function isInteractive(tag) {
  const tagName = tag.name.toLowerCase();

  switch (tagName) {
    // a (if the href attribute is present)
    case "a": {
      return !!findAttr(tag, "href");
    }
    // audio (if the controls attribute is present)
    // video (if the controls attribute is present)
    case "audio":
    case "video": {
      return !!findAttr(tag, "controls");
    }
    // img (if the usemap attribute is present)
    case "img": {
      return !!findAttr(tag, "usemap");
    }
    // input (if the type attribute is not in the Hidden state)
    case "input": {
      const typeAttr = findAttr(tag, "type");
      return !(typeAttr && typeAttr.value && typeAttr.value.value === "hidden");
    }
    case "button":
    case "details":
    case "embed":
    case "iframe":
    case "label":
    case "select":
    case "textarea": {
      return true;
    }
    default: {
      return false;
    }
  }
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallows nested interactive elements",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "Unexpected interactive elements nested (parent interactive: <{{tag}}>)",
    },
  },

  create(context) {
    /**
     * @type {Tag[]}
     */
    let interactiveStack = [];

    return createVisitors(context, {
      Document() {
        interactiveStack = [];
      },
      Tag(node) {
        if (!isInteractive(node)) {
          return;
        }
        if (interactiveStack.length) {
          if (interactiveStack.length === 1) {
            const parentLabel = interactiveStack.find(
              (tag) => tag.name.toLowerCase() === "label"
            );
            if (parentLabel && node.name.toLowerCase() !== "label") {
              return;
            }
          }

          context.report({
            node,
            messageId: MESSAGE_IDS.UNEXPECTED,
            data: {
              tag: interactiveStack[interactiveStack.length - 1].name,
            },
          });
        }

        interactiveStack.push(node);
      },
      "Tag:exit"(node) {
        if (interactiveStack[interactiveStack.length - 1] === node) {
          interactiveStack.pop();
        }
      },
    });
  },
};
