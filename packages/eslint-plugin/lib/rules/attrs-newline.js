/**
 * @import {
 *   RuleFixer,
 *   RuleModule
 * } from "../types"
 * @typedef {Object} MessageId
 * @property {"closeStyleWrong"} CLOSE_STYLE_WRONG
 * @property {"newlineMissing"} NEWLINE_MISSING
 *
 * @typedef {Object} Option
 * @property {"sameline" | "newline"} [option.closeStyle]
 * @property {number} [options.ifAttrsMoreThan]
 * @property {string[]} [options.skip]
 * @property {string[]} [options.inline]
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

/** @type {MessageId} */
const MESSAGE_ID = {
  CLOSE_STYLE_WRONG: "closeStyleWrong",
  NEWLINE_MISSING: "newlineMissing",
};

/** @type {Object<string, string[]>} */
const PRESETS = {
  // From https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics
  $inline: `
a
abbr
b
bdi
bdo
br
cite
code
data
dfn
em
i
kbd
mark
q
rp
rt
ruby
s
samp
small
span
strong
sub
sup
time
u
var
wbr
  `
    .trim()
    .split(`\n`),
};

/**
 * Expand preset tokens (e.g. "$inline") into the corresponding tag list.
 * @param {string[]} options
 * @returns {string[]}
 */
function optionsOrPresets(options) {
  const result = [];
  for (const option of options) {
    if (option in PRESETS) {
      result.push(...PRESETS[option]);
    } else {
      result.push(option);
    }
  }
  return result;
}

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce newline between attributes",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
      url: getRuleUrl("attrs-newline"),
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
          skip: {
            type: "array",
            items: {
              type: "string",
            },
          },
          inline: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
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
    const skipTags = optionsOrPresets(options.skip || []);
    const inlineTags = optionsOrPresets(options.inline || []);

    /**
     * Returns true if attrs-newline should be skipped for this tag.
     * @param {string} tagName
     * @returns {boolean}
     */
    function shouldSkipTag(tagName) {
      const name = tagName.toLowerCase();
      return skipTags.includes(name) || inlineTags.includes(name);
    }

    return createVisitors(context, {
      Tag(node) {
        if (shouldSkipTag(node.name)) return;

        const shouldBeMultiline = node.attributes.length > attrMin;
        if (!shouldBeMultiline) return;

        /**
         * This doesn't do any indentation, so the result will look silly.
         * Indentation should be covered by the `indent` rule
         *
         * @param {RuleFixer} fixer
         */
        function fix(fixer) {
          let expected = node.openStart.value;
          for (const attr of node.attributes) {
            expected += `\n${attr.key.value}`;
            if (attr.value) {
              const startWrapper = attr.startWrapper
                ? attr.startWrapper.value
                : "";
              const endWrapper = attr.endWrapper ? attr.endWrapper.value : "";
              expected += `=${startWrapper}${attr.value.value}${endWrapper}`;
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
