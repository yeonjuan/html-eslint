"use strict";

const { setNodeLocAndRange } = require("../common/location");
const { DOCUMENT_MODE } = require("../common/html");

//Node construction
exports.createDocument = function () {
  return {
    type: "#document",
    mode: DOCUMENT_MODE.NO_QUIRKS,
    childNodes: [],
    tokens: [],
    body: [],
    comments: [],
  };
};

exports.createDocumentFragment = function () {
  return {
    type: "#document-fragment",
    childNodes: [],
  };
};

exports.createElement = function (tagName, namespaceURI, attrs) {
  return {
    type: tagName,
    tagName: tagName,
    attrs: attrs,
    namespaceURI: namespaceURI,
    childNodes: [],
    parentNode: null,
  };
};

exports.createCommentNode = function (data) {
  return {
    type: "#comment",
    data: data,
    parentNode: null,
  };
};

const createTextNode = function (value) {
  return {
    type: "#text",
    value: value,
    parentNode: null,
  };
};

//Tree mutation
const appendChild = (exports.appendChild = function (parentNode, newNode) {
  parentNode.childNodes.push(newNode);
  newNode.parentNode = parentNode;
});

const insertBefore = (exports.insertBefore = function (
  parentNode,
  newNode,
  referenceNode
) {
  const insertionIdx = parentNode.childNodes.indexOf(referenceNode);

  parentNode.childNodes.splice(insertionIdx, 0, newNode);
  newNode.parentNode = parentNode;
});

exports.setTemplateContent = function (templateElement, contentElement) {
  templateElement.content = contentElement;
};

exports.getTemplateContent = function (templateElement) {
  return templateElement.content;
};

exports.setDocumentType = function (document, name, publicId, systemId) {
  let doctypeNode = null;

  for (let i = 0; i < document.childNodes.length; i++) {
    if (document.childNodes[i].type === "#documentType") {
      doctypeNode = document.childNodes[i];
      break;
    }
  }

  if (doctypeNode) {
    doctypeNode.name = name;
    doctypeNode.publicId = publicId;
    doctypeNode.systemId = systemId;
  } else {
    appendChild(document, {
      type: "#documentType",
      name: name,
      publicId: publicId,
      systemId: systemId,
    });
  }
};

exports.setDocumentMode = function (document, mode) {
  document.mode = mode;
};

exports.getDocumentMode = function (document) {
  return document.mode;
};

exports.detachNode = function (node) {
  if (node.parentNode) {
    const idx = node.parentNode.childNodes.indexOf(node);

    node.parentNode.childNodes.splice(idx, 1);
    node.parentNode = null;
  }
};

exports.insertText = function (parentNode, text) {
  if (parentNode.childNodes.length) {
    const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];

    if (prevNode.type === "#text") {
      prevNode.value += text;
      return;
    }
  }

  appendChild(parentNode, createTextNode(text));
};

exports.insertTextBefore = function (parentNode, text, referenceNode) {
  const prevNode =
    parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

  if (prevNode && prevNode.type === "#text") {
    prevNode.value += text;
  } else {
    insertBefore(parentNode, createTextNode(text), referenceNode);
  }
};

exports.adoptAttributes = function (recipient, attrs) {
  const recipientAttrsMap = [];

  for (let i = 0; i < recipient.attrs.length; i++) {
    recipientAttrsMap.push(recipient.attrs[i].name);
  }

  for (let j = 0; j < attrs.length; j++) {
    if (recipientAttrsMap.indexOf(attrs[j].name) === -1) {
      recipient.attrs.push(attrs[j]);
    }
  }
};

//Tree traversing
exports.getFirstChild = function (node) {
  return node.childNodes[0];
};

exports.getChildNodes = function (node) {
  return node.childNodes;
};

exports.getParentNode = function (node) {
  return node.parentNode;
};

exports.getAttrList = function (element) {
  return element.attrs;
};

//Node data
exports.getTagName = function (element) {
  return element.tagName;
};

exports.getNamespaceURI = function (element) {
  return element.namespaceURI;
};

exports.getTextNodeContent = function (textNode) {
  return textNode.value;
};

exports.getCommentNodeContent = function (commentNode) {
  return commentNode.data;
};

exports.getDocumentTypeNodeName = function (doctypeNode) {
  return doctypeNode.name;
};

exports.getDocumentTypeNodePublicId = function (doctypeNode) {
  return doctypeNode.publicId;
};

exports.getDocumentTypeNodeSystemId = function (doctypeNode) {
  return doctypeNode.systemId;
};

//Node types
exports.isTextNode = function (node) {
  return node.type === "#text";
};

exports.isCommentNode = function (node) {
  return node.type === "#comment";
};

exports.isDocumentTypeNode = function (node) {
  return node.type === "#documentType";
};

exports.isElementNode = function (node) {
  return !!node.tagName;
};

// Source code location
exports.setNodeSourceCodeLocation = function (node, location) {
  setNodeLocAndRange(node, location);
};

exports.getNodeSourceCodeLocation = function (node) {
  return node.loc;
};

exports.updateNodeSourceCodeLocation = function (node, endLocation) {
  const endLocNode = {};
  setNodeLocAndRange(endLocNode, endLocation);
  node.end = endLocNode.end;
  node.range[1] = endLocNode.range[1];
  node.loc.end = endLocNode.loc.end;
  if (endLocNode.endTag) {
    node.endTag = endLocNode.endTag;
  }
  // no-op
};
