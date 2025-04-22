/**
 * @typedef { import("html-standard").ElementSpec } ElementSpec
 * @typedef { import("html-standard").ContentModel } ContentModel
 * @typedef { import("@html-eslint/types").AnyHTMLNode} AnyHTMLNode
 * @typedef { import("@html-eslint/types").Tag} Tag
 * @typedef { import("@html-eslint/types").Text} Text
 *
 * @typedef { import("./use-standard-html").Option} Option
 * @typedef { import("../../types").Context<[Option]> } Context
 *
 * @typedef {Object} State
 * @property {number} contentModelIndex
 * @property {ContentModel[] | null} contentModels
 * @property {number} childIndex
 * @property {AnyHTMLNode[]} children
 */

const { shouldIgnoreChild, getNodeName } = require("./helpers");

const EXIT = false;
const CONTINUE = true;

const MESSAGE_IDS = {
  REQUIRED: "required",
  NOT_ALLOWED: "notAllowed",
};

/**
 * @param {State} state
 * @returns {AnyHTMLNode | null}
 */
function getChild(state) {
  return state.children[state.childIndex];
}

/**
 * @param {State} state
 * @returns {ContentModel | null}
 */
function getContentModel(state) {
  if (!state.contentModels) {
    return null;
  }
  return state.contentModels[state.contentModelIndex] || null;
}

/**
 * @param {Context} context
 * @param {ElementSpec} spec
 * @param {AnyHTMLNode} node
 * @param {AnyHTMLNode[]} children
 */
function checkContentModel(context, spec, node, children) {
  /**
   * @type {State}
   */
  const state = {
    contentModels: spec.contents,
    contentModelIndex: 0,
    childIndex: 0,
    children,
  };
  let result = CONTINUE;
  while (result && state.contentModels && !!getContentModel(state)) {
    const contentModel = getContentModel(state);
    if (!contentModel) {
      return;
    }
    switch (contentModel.type) {
      case "required": {
        result = required(contentModel, context, state, node);
        break;
      }
      case "zeroOrMore": {
        result = zeroOrMore(contentModel, state);
        break;
      }
      case "oneOrMore": {
        result = oneOrMore(contentModel, context, state, node);
        break;
      }
      case "optional": {
        result = optional(state);
        break;
      }
      case "either": {
        break;
      }
      default: {
        result = EXIT;
      }
    }
  }
  const remain = getChild(state);
  const contentModel = getContentModel(state);
  if (remain && !contentModel) {
    context.report({
      node: remain,
      messageId: MESSAGE_IDS.NOT_ALLOWED,
    });
  }
}

/**
 * @param {ContentModel & {type: "required"}} model
 * @param {Context} context
 * @param {State} state
 * @param {AnyHTMLNode} node
 * @returns {boolean}
 */
function required(model, context, state, node) {
  let child = getChild(state);
  if (!child) {
    context.report({
      node,
      messageId: MESSAGE_IDS.REQUIRED,
    });
    return EXIT;
  }
  if (shouldIgnoreChild(child)) {
    state.childIndex++;
  }
  const name = getNodeName(child);
  if (model.contents.has(name)) {
    state.childIndex++;
    state.contentModelIndex++;
    return CONTINUE;
  }
  context.report({
    node,
    messageId: MESSAGE_IDS.REQUIRED,
  });
  return EXIT;
}

/**
 * @param {ContentModel & {type: "zeroOrMore"}} model
 * @param {State} state
 * @returns {boolean}
 */
function zeroOrMore(model, state) {
  let child = getChild(state);
  if (!child) {
    state.childIndex++;
    state.contentModelIndex++;
    return CONTINUE;
  }
  while ((child = getChild(state))) {
    if (shouldIgnoreChild(child)) {
      state.childIndex++;
      continue;
    }
    const name = getNodeName(child);
    if (model.contents.has(name)) {
      state.childIndex++;
    } else {
      break;
    }
  }

  state.contentModelIndex++;
  return CONTINUE;
}

/**
 * @param {ContentModel & {type: "oneOrMore"}} model
 * @param {Context} context
 * @param {State} state
 * @param {AnyHTMLNode} node
 * @returns {boolean}
 */
function oneOrMore(model, context, state, node) {
  let child = getChild(state);
  if (!child) {
    state.childIndex++;
    state.contentModelIndex++;
    return CONTINUE;
  }
  let count = 0;
  while ((child = getChild(state))) {
    if (shouldIgnoreChild(child)) {
      state.childIndex++;
      continue;
    }
    const name = getNodeName(child);
    if (model.contents.has(name)) {
      count++;
      state.childIndex++;
    } else {
      break;
    }
  }

  if (count <= 0) {
    context.report({
      node,
      messageId: MESSAGE_IDS.REQUIRED,
    });
    return EXIT;
  }

  state.contentModelIndex++;
  return CONTINUE;
}

/**
 * @param {State} state
 * @returns {boolean}
 */
function optional(state) {
  let child = getChild(state);
  if (!child) {
    state.childIndex++;
    state.contentModelIndex++;
    return CONTINUE;
  }
  state.childIndex++;
  state.contentModelIndex++;
  return CONTINUE;
}

module.exports = {
  MESSAGE_IDS,
  checkContentModel,
};
