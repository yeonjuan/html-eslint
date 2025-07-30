/**
 * @import {MaybeHTMLSettings, HTMLSettings, Context} from "../../types";
 * @import {TaggedTemplateExpression, TemplateLiteral} from "@html-eslint/types";
 */

const { getSourceCode } = require("../utils/source-code");

const DEFAULT_SETTINGS = {
  templateLiterals: {
    tags: ["^html$"],
    comments: ["^\\s*html\\s*$"],
  },
};

/**
 * @param {{ html?: MaybeHTMLSettings }} settings
 * @returns {HTMLSettings}
 */
function getSettings(settings) {
  const tags =
    (settings &&
      settings.html &&
      settings.html.templateLiterals &&
      settings.html.templateLiterals.tags) ||
    DEFAULT_SETTINGS.templateLiterals.tags;

  const comments =
    (settings &&
      settings.html &&
      settings.html.templateLiterals &&
      settings.html.templateLiterals.comments) ||
    DEFAULT_SETTINGS.templateLiterals.comments;

  return {
    templateLiterals: {
      tags: tags.map((tag) => new RegExp(tag, "u")),
      comments: comments.map((comment) => new RegExp(comment, "u")),
    },
  };
}

/**
 * @param {TaggedTemplateExpression} node
 * @param {Context<any[]>} context
 * @returns {boolean}
 */
function shouldCheckTaggedTemplateExpression(node, context) {
  const { templateLiterals } = getSettings(context.settings);
  const tags = templateLiterals.tags;
  const tagNode = node.tag;
  return !!(
    tagNode.type === "Identifier" && tags.some((tag) => tag.test(tagNode.name))
  );
}

/**
 *
 * @param {TemplateLiteral} node
 * @param {Context<any[]>} context
 * @returns {boolean}
 */
function shouldCheckTemplateLiteral(node, context) {
  const sourceCode = getSourceCode(context);
  const { templateLiterals } = getSettings(context.settings);
  const comments = sourceCode.getCommentsBefore(node);
  const last = comments[comments.length - 1];
  return !!(
    last &&
    templateLiterals.comments.some((comment) => comment.test(last.value))
  );
}

module.exports = {
  shouldCheckTemplateLiteral,
  shouldCheckTaggedTemplateExpression,
};
