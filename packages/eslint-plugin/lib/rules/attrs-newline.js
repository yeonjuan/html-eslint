/**
 * @typedef { import("../types").RuleFixer } RuleFixer
 *
 * @typedef {Object} MessageId
 * @property {"closeStyleWrong"} CLOSE_STYLE_WRONG
 * @property {"newlineMissing"} NEWLINE_MISSING
 *
 * @typedef {Object} Option
 * @property {"sameline" | "newline"} [option.closeStyle]
 * @property {number} [options.ifAttrsMoreThan]
 *
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

/**
 * @type {MessageId}
 */
const MESSAGE_ID = {
  CLOSE_STYLE_WRONG: "closeStyleWrong",
  NEWLINE_MISSING: "newlineMissing",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce newline between attributes",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [
      {
        type: "object",
        properties: {
          closeStyle: {
            enum: ["newline", "sameline"],
          },
          ifAttrsMoreThan: {
            type: "integer",
          },
        },
      },
    ],
    messages: {
      [MESSAGE_ID.CLOSE_STYLE_WRONG]:
        "Closing bracket was on {{actual}}; expected {{expected}}",
      [MESSAGE_ID.NEWLINE_MISSING]: "Newline expected before {{attrName}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const attrMin =
      typeof options.ifAttrsMoreThan !== "number" ? 2 : options.ifAttrsMoreThan;
    const closeStyle = options.closeStyle || "newline";

    return createVisitors(context, {
      Tag(node) {
        const shouldBeMultiline = node.attributes.length > attrMin;
        if (!shouldBeMultiline) return;

        /**
         * This doesn't do any indentation, so the result will look silly. Indentation should be covered by the `indent` rule
         * @param {RuleFixer} fixer
         */
        function fix(fixer) {
          let expected = node.openStart.value;
          for (const attr of node.attributes) {
            expected += `\n${attr.key.value}`;
            if (attr.startWrapper && attr.value && attr.endWrapper) {
              expected += `=${attr.startWrapper.value}${attr.value.value}${attr.endWrapper.value}`;
            }
          }

          if (closeStyle === "newline") {
            expected += "\n";
          } else if (node.selfClosing) {
            expected += " ";
          }
          expected += node.openEnd.value;

          return fixer.replaceTextRange(
            [node.openStart.range[0], node.openEnd.range[1]],
            expected
          );
        }

        let index = 0;
        for (const attr of node.attributes) {
          const attrPrevious = node.attributes[index - 1];
          const relativeToNode = attrPrevious || node.openStart;
          if (attr.loc.start.line === relativeToNode.loc.end.line) {
            return context.report({
              node,
              data: {
                attrName: attr.key.value,
              },
              fix,
              messageId: MESSAGE_ID.NEWLINE_MISSING,
            });
          }
          index += 1;
        }

        const attrLast = node.attributes[node.attributes.length - 1];
        const closeStyleActual =
          node.openEnd.loc.start.line === attrLast.loc.end.line
            ? "sameline"
            : "newline";
        if (closeStyle !== closeStyleActual) {
          return context.report({
            node,
            data: {
              actual: closeStyleActual,
              expected: closeStyle,
            },
            fix,
            messageId: MESSAGE_ID.CLOSE_STYLE_WRONG,
          });
        }
      },
    });
  },
};
