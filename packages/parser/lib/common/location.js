function setNodeLocAndRange(node, sourceCodeLocation) {
  if (!sourceCodeLocation) {
    node.loc = null;
    return;
  }

  const {
    startOffset: start,
    endOffset: end,
    startLine,
    startCol,
    endLine,
    endCol,
    startTag,
    endTag,
  } = sourceCodeLocation;

  node.range = [start, end];
  node.start = start;
  node.end = end;
  node.loc = {
    start: {
      line: startLine,
      column: startCol,
    },
    end: {
      line: endLine,
      column: endCol,
    },
  };
  if (startTag) {
    node.startTag = {};
    setNodeLocAndRange(node.startTag, startTag);
  }
  if (endTag) {
    node.endTag = {};
    setNodeLocAndRange(node.endTag, endTag);
  }
}

exports.setNodeLocAndRange = setNodeLocAndRange;
