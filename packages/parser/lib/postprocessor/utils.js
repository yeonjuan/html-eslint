function canIncludeChild(node) {
  return !!(node.startTag && node.endTag);
}

function canBeIncluded(node, child) {
  return (
    child.range[0] >= node.startTag.range[0] &&
    child.range[1] <= node.endTag.range[1]
  );
}

function hasChildNodes(node) {
  return Array.isArray(node.childNodes) && !!node.childNodes.length;
}

function getLocFromChildNodes(childNodes) {
  if (Array.isArray(childNodes) && childNodes.length) {
    const [left] = childNodes;
    const right = childNodes[childNodes.length - 1];

    const leftNode = left.loc ? left : getLocFromChildNodes(left.childNodes);
    const rightNode = right.loc
      ? right
      : getLocFromChildNodes(right.childNodes);

    return {
      loc: {
        start: leftNode.loc.start,
        end: rightNode.loc.end,
      },
      range: [leftNode.range[0], rightNode.range[1]],
      start: leftNode.start,
      end: rightNode.end,
    };
  }

  return {
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
    range: [0, 0],
    start: 0,
    end: 0,
  };
}

function createLines(locNode, text) {
  let start = locNode.start;
  let line = locNode.loc.start.line;

  return text.split("\n").map((textLine) => {
    const lengthWithoutIndent = textLine.trimStart().length;
    const indentLength = textLine.length - lengthWithoutIndent;

    start += indentLength;

    const node = {
      textLine,
      start,
      end: start + lengthWithoutIndent,
      range: [start, start + lengthWithoutIndent],
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
    };

    line += 1;
    start += lengthWithoutIndent + 1;

    return node;
  });
}

function createCommentStartTag(locNode) {
  return {
    start: locNode.start,
    end: locNode.start + 4,
    loc: {
      start: locNode.loc.start,
      end: {
        line: locNode.loc.start.line,
        column: locNode.loc.start.column + 5,
      },
    },
    range: [locNode.start, locNode.start + 4],
  };
}

function createCommentEndTag(locNode) {
  return {
    start: locNode.end - 3,
    end: locNode.end + 1,
    loc: {
      start: {
        line: locNode.loc.end.line,
        column: locNode.loc.end.column - 3,
      },
      end: locNode.loc.end,
    },
    range: [locNode.end - 3, locNode.end + 1],
  };
}

module.exports = {
  canIncludeChild,
  canBeIncluded,
  hasChildNodes,
  getLocFromChildNodes,
  createLines,
  createCommentStartTag,
  createCommentEndTag,
};
