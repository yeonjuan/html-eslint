const { NodeTypes } = require("es-html-parser");

// eslint-disable-next-line no-unused-vars
const { Document, ...restNodeTypes } = NodeTypes;

const NODE_TYPES = {
  Program: "Program",
  ...restNodeTypes,
};

module.exports = {
  NODE_TYPES,
};
