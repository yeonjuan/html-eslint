function getLocFromChildNodes(childNodes) {
  if (!Array.isArray(childNodes) || childNodes.length <= 0) {
    return {
      range: [0, 0],
      start: 0,
      end: 0,
      loc: {
        start: {
          line: 0,
          column: 0,
        },
        end: {
          line: 0,
          column: 0,
        },
      },
    };
  }

  const firstNode = childNodes[0];
  const { startOffset, startLine, startCol } =
    firstNode.sourceCodeLocation || getLocFromChildNodes(firstNode.childNodes);

  const lastNode = childNodes[childNodes.length - 1];
  const { endOffset, endLine, endCol } =
    lastNode.sourceCodeLocation || getLocFromChildNodes(lastNode.childNodes);

  return {
    range: [startOffset, endOffset],
    start: startOffset,
    end: endOffset,
    loc: {
      start: {
        line: startLine,
        column: startCol,
      },
      end: {
        line: endLine,
        column: endCol,
      },
    },
  };
}

module.exports = {
  toType(nodeName) {
    let type = nodeName[0].toUpperCase() + nodeName.slice(1);
    type = type.replace("#", "");
    return type === "document" ? "Program" : type;
  },
  toESLocation(sourceCodeLocation, childNodes = []) {
    if (sourceCodeLocation) {
      return {
        range: [sourceCodeLocation.startOffset, sourceCodeLocation.endOffset],
        start: sourceCodeLocation.startOffset || 0,
        end: sourceCodeLocation.endOffset || 0,
        loc: {
          start: {
            line: sourceCodeLocation.startLine || 0,
            column: sourceCodeLocation.startCol || 0,
          },
          end: {
            line: sourceCodeLocation.endLine || 0,
            column: sourceCodeLocation.endCol || 0,
          },
        },
      };
    }
    return getLocFromChildNodes(childNodes);
  },
};
