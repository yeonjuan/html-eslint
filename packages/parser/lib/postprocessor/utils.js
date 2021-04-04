function canIncludeChild (node) {
  return !!(node.startTag && node.endTag);
}

function canBeIncluded (node, child) {
  return (
    child.range[0] >= node.startTag.range[0] && child.range[1] <= node.endTag.range[1]
  );
}

function hasChildNodes (node) {
  return Array.isArray(node.childNodes) && !!node.childNodes.length;
}

function getLocFromChildNodes (node) {
  if (hasChildNodes(node)) {
    const [left] = node.childNodes;
    const right = node.childNodes[node.childNodes.length - 1];

    const leftNode = left.loc ? left : getLocFromChildNodes(left);
    const rightNode = right.loc ? right : getLocFromChildNodes(right);

    return {
      loc: {
        start: leftNode.loc.start,
        end: rightNode.loc.end,
      },
      range: [leftNode.range[0], rightNode.range[1]],
      start: leftNode.start,
      end: rightNode.end,
    }
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
      }
    },
    range: [0, 0],
    start: 0,
    end: 0,
  };
}

function createLines (locNode, text) {
  let start = locNode.start;
  let line = locNode.loc.start.line;

  return text.split('\n').map(textLine => {
    const lengthWithoutIndent = textLine.trimStart().length;
    const indentLength = textLine.length - lengthWithoutIndent;

    start += indentLength;

    const lineLoc = {
      startOffset: start,
      endOffset: start + lengthWithoutIndent,
      startLine: line,
      endLine: line,
      startCol: indentLength + 1,
      endCol: textLine.length + 1,
    };

    line += 1;
    start += lengthWithoutIndent + 1;

    return new NodeBuilder().setLocation(lineLoc).setTextLine(textLine).build();
  });
}

module.exports = {
  canIncludeChild,
  canBeIncluded,
  hasChildNodes,
  getLocFromChildNodes,
};
