/** @import {RuleModule} from "../types" */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { getImplicitRole } = require("html-standard");

const MESSAGE_IDS = {
  REDUNDANT: "redundant",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Disallow redundant role attributes that match the element's implicit role",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-redundant-role"),
    },

    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_IDS.REDUNDANT]:
        "Redundant role '{{role}}'. The element <{{element}}> already has an implicit role of '{{role}}'.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    return createVisitors(context, {
      Tag(node) {
        const role = findAttr(node, "role");
        if (!role) {
          return;
        }

        /** Allow template expression. ex: html`<div role=${role}></div>` */
        if (
          role.value &&
          role.value.parts.some((part) => part.type === NODE_TYPES.Template)
        ) {
          return;
        }

        const roleValue = (
          (role.value && role.value.value) ||
          ""
        ).toLowerCase();

        if (!roleValue) {
          return;
        }

        const elementName = node.name.toLowerCase();

        const implicitRole = getImplicitRole(elementName, {
          attribute(key) {
            const attr = findAttr(node, key);
            if (attr && attr.value) {
              return attr.value.value;
            }
            return null;
          },
        });

        if (implicitRole && implicitRole.toLowerCase() === roleValue) {
          context.report({
            node: role,
            messageId: MESSAGE_IDS.REDUNDANT,
            data: {
              role: roleValue,
              element: elementName,
            },
            fix(fixer) {
              return fixer.removeRange(role.range);
            },
          });
        }
      },
    });
  },
};
