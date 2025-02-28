/**
 * @typedef {import("./types").TemplateHTMLVisitor} TemplateHTMLVisitor
 * @typedef {import("./types").TemplateHTMLVisitorKeys} TemplateHTMLVisitorKeys
 * @typedef {import("es-html-parser").AnyNode} AnyNode
 */

const { NodeTypes } = require("es-html-parser");

/**
 * @type {TemplateHTMLVisitorKeys}
 */
const visitorKeys = {
  [NodeTypes.Document]: ["children"],
  [NodeTypes.Attribute]: ["key", "startWrapper", "endWrapper", "value"],
  [NodeTypes.AttributeKey]: [],
  [NodeTypes.AttributeValue]: [],
  [NodeTypes.AttributeValueWrapperEnd]: [],
  [NodeTypes.AttributeValueWrapperStart]: [],
  [NodeTypes.CloseScriptTag]: [],
  [NodeTypes.CloseStyleTag]: [],
  [NodeTypes.CloseTag]: [],
  [NodeTypes.Comment]: ["open", "close", "value"],
  [NodeTypes.CommentContent]: [],
  [NodeTypes.CommentOpen]: [],
  [NodeTypes.CommentClose]: [],
  [NodeTypes.Doctype]: ["open", "close", "attributes"],
  [NodeTypes.DoctypeAttribute]: ["startWrapper", "value", "endWrapper"],
  [NodeTypes.DoctypeAttributeValue]: [],
  [NodeTypes.DoctypeAttributeWrapperEnd]: [],
  [NodeTypes.DoctypeAttributeWrapperStart]: [],
  [NodeTypes.DoctypeOpen]: [],
  [NodeTypes.DoctypeClose]: [],
  [NodeTypes.OpenScriptTagEnd]: [],
  [NodeTypes.OpenScriptTagStart]: [],
  [NodeTypes.OpenStyleTagEnd]: [],
  [NodeTypes.OpenStyleTagStart]: [],
  [NodeTypes.OpenTagEnd]: [],
  [NodeTypes.OpenTagStart]: [],
  [NodeTypes.ScriptTag]: [
    "attributes",
    "openStart",
    "openEnd",
    "close",
    "value",
  ],
  [NodeTypes.ScriptTagContent]: [],
  [NodeTypes.StyleTag]: [
    "attributes",
    "openStart",
    "openEnd",
    "close",
    "value",
  ],
  [NodeTypes.StyleTagContent]: [],
  [NodeTypes.Tag]: ["openStart", "openEnd", "close", "children", "attributes"],
  [NodeTypes.Text]: [],
  [NodeTypes.Template]: [],
  [NodeTypes.OpenTemplate]: [],
  [NodeTypes.CloseTemplate]: [],
  [NodeTypes.Part]: [],
};

/**
 *
 * @param {AnyNode} node
 * @param {TemplateHTMLVisitor} visitors
 * @param {AnyNode | null} parent
 */
function traverse(node, visitors, parent) {
  // @ts-ignore
  const enterVisitor = visitors[node.type];
  // @ts-ignore
  node.parent = parent;
  enterVisitor && enterVisitor(node);

  const nextKeys = visitorKeys[node.type];

  nextKeys.forEach((key) => {
    // @ts-ignore
    const next = node[key];
    if (Array.isArray(next)) {
      next.forEach((n) => traverse(n, visitors, node));
    } else if (next) {
      traverse(next, visitors, node);
    }
  });
  // @ts-ignore
  const exitVisitor = visitors[`${node.type}:exit`];
  exitVisitor && exitVisitor(node);
}

module.exports = {
  traverse,
};
