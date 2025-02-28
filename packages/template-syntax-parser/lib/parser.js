/**
 * @typedef {import('eslint').AST.Range} Range
 * @typedef {import("./types").TemplateSyntax} TemplateSyntax
 * @typedef {import("./types").OpenSyntax} OpenSyntax
 * @typedef {import("./types").CloseSyntax} CloseSyntax
 * @typedef {import("./types").TemplateSyntaxParserResult} TemplateSyntaxParserResult
 */

module.exports = class Parser {
  /**
   * @param {string} code
   * @param {[string, string][]} syntaxPairs
   * @param {Range[]} skipRanges
   */
  constructor(code, syntaxPairs, skipRanges) {
    /**
     * @type {string}
     */
    this.code = code;
    /**
     * @type {[string, string][]}
     */
    this.syntaxPairs = syntaxPairs || [];
    /**
     * @type {Range[]}
     */
    this.skipRanges = skipRanges;
    /**
     * @type {OpenSyntax[]}
     */
    this.syntaxStack = [];
    /**
     * @type {TemplateSyntax[]}
     */
    this.result = [];
  }

  /**
   * @private
   * @param {number} index
   * @returns {Range | undefined}
   */
  findSkipRange(index) {
    return this.skipRanges.find(
      (range) => range[0] <= index && index < range[1]
    );
  }

  /**
   * @param {string} syntax
   * @param {number} position
   * @returns {number}
   */
  indexOf(syntax, position) {
    const index = this.code.indexOf(syntax, position);
    if (index < 0) return index;
    const skipRange = this.findSkipRange(index);
    if (skipRange) {
      return this.indexOf(syntax, skipRange[1]);
    }
    return index;
  }

  /**
   * @param {number} position
   * @returns {OpenSyntax | null}
   */
  findOpenSyntax(position) {
    /**
     * @type {string | null}
     */
    let value = null;
    let rangeStart = Infinity;
    for (let i = 0; i < this.syntaxPairs.length; i++) {
      const [open] = this.syntaxPairs[i];
      const openIndex = this.indexOf(open, position);
      if (openIndex >= 0 && openIndex < rangeStart) {
        value = open;
        rangeStart = openIndex;
      }
    }
    if (!value) return null;
    return {
      type: "open",
      value,
      range: [rangeStart, rangeStart + value.length],
    };
  }

  /**
   * @param {number} position
   * @returns {CloseSyntax | null}
   */
  findCloseSyntax(position) {
    /**
     * @type {string | null}
     */
    let value = null;
    let rangeStart = Infinity;
    for (let i = 0; i < this.syntaxPairs.length; i++) {
      const [, close] = this.syntaxPairs[i];
      const closeIndex = this.indexOf(close, position);
      if (closeIndex >= 0 && closeIndex < rangeStart) {
        value = close;
        rangeStart = closeIndex;
      }
    }
    if (!value) return null;
    return {
      type: "close",
      value,
      range: [rangeStart, rangeStart + value.length],
    };
  }

  /**
   * @returns {OpenSyntax[]}
   */
  findAllOpenSyntax() {
    /**
     * @type {OpenSyntax[]}
     */
    const result = [];
    let position = 0;

    while (position < this.code.length) {
      const openSyntax = this.findOpenSyntax(position);
      if (!openSyntax) {
        break;
      }
      result.push(openSyntax);
      position = openSyntax.range[1];
    }

    return result;
  }

  /**
   * @returns {CloseSyntax[]}
   */
  findAllCloseSyntax() {
    /**
     * @type {CloseSyntax[]}
     */
    const result = [];
    let position = 0;

    while (position < this.code.length) {
      const closeSyntax = this.findCloseSyntax(position);
      if (!closeSyntax) {
        break;
      }
      result.push(closeSyntax);
      position = closeSyntax.range[1];
    }

    return result;
  }

  /**
   * @returns {(CloseSyntax | OpenSyntax)[]}
   */
  findAllSyntax() {
    /**
     * @type {(CloseSyntax | OpenSyntax)[]}
     */
    const result = this.findAllOpenSyntax();
    return result
      .concat(this.findAllCloseSyntax())
      .sort((a, b) => a.range[0] - b.range[0]);
  }

  /**
   * @param {OpenSyntax} open
   * @returns {string}
   */
  getPossibleCloseValueOf(open) {
    const found = this.syntaxPairs.find((syntax) => syntax[0] === open.value);
    if (!found) {
      /* istanbul ignore next */
      throw new Error("Unexpected open value: " + open);
    }
    return found[1];
  }

  /**
   * @param {CloseSyntax | OpenSyntax} syntax
   */
  eatSyntax(syntax) {
    if (syntax.type === "open") {
      const top = this.syntaxStack.pop();
      if (!top) {
        this.syntaxStack.push(syntax);
      } else {
        throw new Error(
          `Expecting "${this.getPossibleCloseValueOf(top)}", but found "${
            syntax.value
          }" at (${syntax.range[0]}, ${syntax.range[1]}).`
        );
      }
    } else if (syntax.type === "close") {
      const top = this.syntaxStack.pop();
      if (!top) {
        return;
      } else if (this.getPossibleCloseValueOf(top) === syntax.value) {
        this.result.push({
          open: [top.range[0], top.range[0] + top.value.length],
          close: [syntax.range[1] - syntax.value.length, syntax.range[1]],
        });
      }
    }
  }

  /**
   * @returns {TemplateSyntaxParserResult}
   */
  parse() {
    for (const syntax of this.findAllSyntax()) {
      this.eatSyntax(syntax);
    }
    return {
      syntax: this.result,
    };
  }
};
