const NodeBuilder = require("./node-builder");

module.exports = function createNull() {
  return new NodeBuilder().setType("#null").build();
};
