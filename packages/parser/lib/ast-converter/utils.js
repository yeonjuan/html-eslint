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
  getAttrLocation(sourceCodeLocation, attrName) {
    if (sourceCodeLocation && sourceCodeLocation.attrs) {
      return this.toESLocation(sourceCodeLocation.attrs[attrName]);
    }
    return null;
  },
  isEmptyHTMLNode(node) {
    return !node || (node.nodeName !== "#document" && !node.sourceCodeLocation);
  },
  getCommentTags(node) {
    return {
      startTag: {
        range: [node.range[0], node.range[0] + 4],
        start: node.start,
        end: node.start + 4,
        loc: {
          start: {
            line: node.loc.start.line,
            column: node.loc.start.column,
          },
          end: {
            line: node.loc.start.line,
            column: node.loc.start.column + 5,
          },
        },
      },
      endTag: {
        range: [node.range[1] - 3, node.range[1]],
        start: node.start,
        end: node.start + 4,
        loc: {
          start: {
            line: node.loc.end.line,
            column: node.loc.end.column - 3,
          },
          end: {
            line: node.loc.end.line,
            column: node.loc.end.column,
          },
        },
      },
    };
  },
  getLineNodes(node, text) {
    let [rangeStart] = node.range;
    let startOffset = node.start;
    let { line } = node.loc.start;
    return text.split("\n").map((textLine) => {
      const lengthWithoutIndent = textLine.trimStart().length;
      const indentLength = textLine.length - lengthWithoutIndent;

      rangeStart += indentLength;
      startOffset += indentLength;
      const lineNode = {
        range: [rangeStart, rangeStart + textLine.trimStart().length],
        start: startOffset,
        end: rangeStart + textLine.length,
        loc: {
          start: {
            line,
            column: indentLength + 1,
          },
          end: {
            line,
            column: textLine.length + 1,
          },
        },
        textLine,
      };
      rangeStart += lengthWithoutIndent + 1;
      startOffset += lengthWithoutIndent + 1;
      line += 1;
      return lineNode;
    });
  },
};
