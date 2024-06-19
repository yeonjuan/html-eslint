/**
 * @typedef { import("../types").RuleFixer } RuleFixer
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef {Object} MessageId
 * @property {"closeStyleWrong"} CLOSE_STYLE_WRONG
 * @property {"newlineMissing"} NEWLINE_MISSING
 * @property {"newlineUnexpected"} NEWLINE_UNEXPECTED
 */

const { RULE_CATEGORY } = require("../constants");

/**
 * @type {MessageId}
 */

const MESSAGE_ID = {
  CLOSE_STYLE_WRONG: "closeStyleWrong",
  NEWLINE_MISSING: "newlineMissing",
  NEWLINE_UNEXPECTED: "newlineUnexpected",
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
      [MESSAGE_ID.NEWLINE_UNEXPECTED]:
        "Newlines not expected between attributes, since this tag has fewer than {{attrMin}} attributes",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const attrMin = isNaN(options.ifAttrsMoreThan)
      ? 2
      : options.ifAttrsMoreThan;
    const closeStyle = options.closeStyle || "newline";

    return {
      /**
       * @param {TagNode} node
       */
      Tag(node) {
        const shouldBeMultiline = node.attributes.length > attrMin;

        /**
         * This doesn't do any indentation, so the result will look silly. Indentation should be covered by the `indent` rule
         * @param {RuleFixer} fixer
         */
        function fix(fixer) {
          const spacer = shouldBeMultiline ? "\n" : " ";
          let expected = node.openStart.value;
          for (const attr of node.attributes) {
            expected += `${spacer}${attr.key.value}`;
            if (attr.startWrapper && attr.value && attr.endWrapper) {
              expected += `=${attr.startWrapper.value}${attr.value.value}${attr.endWrapper.value}`;
            }
          }
          if (shouldBeMultiline && closeStyle === "newline") {
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

        if (shouldBeMultiline) {
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
        } else {
          let expectedLastLineNum = node.openStart.loc.start.line;
          for (const attr of node.attributes) {
            if (shouldBeMultiline) {
              expectedLastLineNum += 1;
            }
            if (attr.value) {
              const valueLineSpan =
                attr.value.loc.end.line - attr.value.loc.start.line;
              expectedLastLineNum += valueLineSpan;
            }
          }
          if (shouldBeMultiline && closeStyle === "newline") {
            expectedLastLineNum += 1;
          }

          if (node.openEnd.loc.end.line !== expectedLastLineNum) {
            return context.report({
              node,
              data: {
                attrMin,
              },
              fix,
              messageId: MESSAGE_ID.NEWLINE_UNEXPECTED,
            });
          }
        }
      },
    };
  },
};
