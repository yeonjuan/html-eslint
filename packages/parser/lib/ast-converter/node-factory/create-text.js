const NodeBuilder = require("./node-builder");
const createLines = require("./create-lines");

module.exports = function createText(origin) {
  const lines = createLines(origin.sourceCodeLocation, origin.value);
  return new NodeBuilder()
    .setType("text")
    .setLocation(origin.sourceCodeLocation)
    .setValue(origin.value)
    .setLineNodes(lines)
    .build();
};
