const NodeBuilder = require("./node-builder");

function convertType(nodeName) {
  let type = nodeName[0].toUpperCase() + nodeName.slice(1);
  type = type.replace("#", "");
  return type === "document" ? "Program" : type;
}

function createTag(tagLoc) {
  return new NodeBuilder().setLocation(tagLoc).build();
}

function createAttributes(attrs, attrLocs) {
  return attrs.map((attr) => {
    const name = attr.name;
    const value = attr.value;
    const attrBuilder = new NodeBuilder();

    if (attrLocs[name]) {
      attrBuilder.setLocation(attrLocs[name]);
    }

    return attrBuilder.setName(name).setValue(value).build();
  });
}

module.exports = function createNode(origin) {
  const type = convertType(origin.nodeName);
  const builder = new NodeBuilder()
    .setType(type)
    .setChildNodes([]);

  if (origin.tagName) {
    builder.setTagName(origin.tagName);
  }

  const originLoc = origin.sourceCodeLocation;
  if (originLoc) {
    builder.setLocation(originLoc);

    if (originLoc.startTag) {
      const startTag = createTag(originLoc.startTag);
      builder.setStartTag(startTag);
    }

    if (originLoc.endTag) {
      const endTag = createTag(originLoc.endTag);
      builder.setEndTag(endTag);
    }

    if (Array.isArray(origin.attrs) && originLoc.attrs) {
      const attributes = createAttributes(origin.attrs, originLoc.attrs);
      builder.setAttributes(attributes);
    }
  }

  return builder.build();
};
