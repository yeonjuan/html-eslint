class NodeBuilder {
  setType(type) {
    this.type = type;
    return this;
  }

  setAttributes(attrs) {
    this.attrs = attrs;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  setComments(comments) {
    this.comments = comments;
    return this;
  }

  setTokens(tokens) {
    this.tokens = tokens;
    return this;
  }

  setStartTag(start) {
    this.startTag = start;
    return this;
  }

  setEndTag(end) {
    this.endTag = end;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setChildNodes(nodes) {
    this.childNodes = nodes;
    return this;
  }

  setLineNodes(lines) {
    this.lineNodes = lines;
    return this;
  }

  setTextLine(textLine) {
    this.textLine = textLine;
    return this;
  }

  setTagName(tagName) {
    this.tagName = tagName;
    return this;
  }

  setLocation({
    startOffset,
    endOffset,
    startLine,
    startCol,
    endLine,
    endCol,
  }) {
    this.range = [startOffset, endOffset];
    this.start = startOffset;
    this.end = endOffset;
    this.loc = {
      start: {
        line: startLine,
        column: startCol,
      },
      end: {
        line: endLine,
        column: endCol,
      },
    };
    return this;
  }

  build() {
    return Object.entries(this)
      .filter(([, value]) => typeof value !== "function")
      .reduce(
        (before, [name, value]) => ({
          ...before,
          [name]: value,
        }),
        {}
      );
  }
}

module.exports = NodeBuilder;
