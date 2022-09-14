const { visitorKeys } = require("./visitor-keys");

function traverse(node, visitor) {
  if (!node) {
    return;
  }
  visitor(node);
  const type = node.type;
  const keys = visitorKeys[type];

  if (!keys || keys.length <= 0) {
    return;
  }

  keys.forEach((key) => {
    if (node[key]) {
      if (Array.isArray(node[key])) {
        node[key].forEach((n) => traverse(n, visitor));
      } else {
        traverse(node[key], visitor);
      }
    }
  });
}

module.exports = { traverse };
