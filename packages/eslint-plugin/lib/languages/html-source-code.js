/**
 *  @typedef {import("eslint").AST.Program} Program
 *  @typedef {import("@eslint/plugin-kit").SourceLocation} SourceLocation
 *  @typedef {import("@eslint/plugin-kit").DirectiveType} DirectiveType
 *  @typedef {import("@eslint/core").TraversalStep} TraversalStep
 *  @typedef {import("@html-eslint/types").CommentContent} CommentContent
 *  @typedef {import("@html-eslint/types").AnyHTMLNode} AnyHTMLNode
 *  @typedef {import("@eslint/core").Position} Position
 *  @typedef {import("../types").BaseNode} BaseNode
 */
const {
  TextSourceCodeBase,
  ConfigCommentParser,
  Directive,
} = require("@eslint/plugin-kit");
const { HTMLTraversalStep, STEP_PHASE } = require("./html-traversal-step");
const { visitorKeys } = require("@html-eslint/parser");

const lineBreakPattern = /\r\n|[\r\n\u2028\u2029]/u;

function createGlobalLinebreakMatcher() {
  return new RegExp(lineBreakPattern.source, "gu");
}

const INLINE_CONFIG =
  /^\s*(?:eslint(?:-enable|-disable(?:(?:-next)?-line)?)?)(?:\s|$)/u;

const commentParser = new ConfigCommentParser();

class HTMLSourceCode extends TextSourceCodeBase {
  /**
   * @param {{ast: Program, text: string, comments: CommentContent[]}} config
   */
  constructor({ ast, text, comments }) {
    super({ ast, text });

    /**
     * @property
     */
    this.ast = ast;
    /**
     * @property
     */
    this.comments = comments;
    this.parentsMap = new Map();

    this.lineStartIndices = [0];

    const lineEndingPattern = createGlobalLinebreakMatcher();
    let match;
    while ((match = lineEndingPattern.exec(this.text))) {
      this.lineStartIndices.push(match.index + match[0].length);
    }
  }

  /**
   * @param {BaseNode} node
   * @returns {[number, number]}
   */
  getRange(node) {
    return node.range;
  }

  /**
   * @param {BaseNode} node
   * @returns {import("@eslint/plugin-kit").SourceLocation}
   */
  getLoc(node) {
    return node.loc;
  }

  getLines() {
    return this.lines;
  }

  // Copied from eslint source code
  /**
   * @see https://github.com/eslint/eslint/blob/f60f2764971a33e252be13e560dccf21f554dbf1/lib/languages/js/source-code/source-code.js#L745
   * @param {Position} loc
   * @returns {number}
   */
  getIndexFromLoc(loc) {
    if (
      typeof loc !== "object" ||
      typeof loc.line !== "number" ||
      typeof loc.column !== "number"
    ) {
      throw new TypeError(
        "Expected `loc` to be an object with numeric `line` and `column` properties."
      );
    }

    if (loc.line <= 0) {
      throw new RangeError(
        `Line number out of range (line ${loc.line} requested). Line numbers should be 1-based.`
      );
    }

    if (loc.line > this.lineStartIndices.length) {
      throw new RangeError(
        `Line number out of range (line ${loc.line} requested, but only ${this.lineStartIndices.length} lines present).`
      );
    }

    const lineStartIndex = this.lineStartIndices[loc.line - 1];
    const lineEndIndex =
      loc.line === this.lineStartIndices.length
        ? this.text.length
        : this.lineStartIndices[loc.line];
    const positionIndex = lineStartIndex + loc.column;
    if (
      (loc.line === this.lineStartIndices.length &&
        positionIndex > lineEndIndex) ||
      (loc.line < this.lineStartIndices.length && positionIndex >= lineEndIndex)
    ) {
      throw new RangeError(
        `Column number out of range (column ${loc.column} requested, but the length of line ${loc.line} is ${lineEndIndex - lineStartIndex}).`
      );
    }

    return positionIndex;
  }

  // Copied from eslint source code
  /**
   * @see https://github.com/eslint/eslint/blob/f60f2764971a33e252be13e560dccf21f554dbf1/lib/languages/js/source-code/source-code.js#L694
   * @param {number} index
   * @returns {Position}
   */
  getLocFromIndex(index) {
    if (typeof index !== "number") {
      throw new TypeError("Expected `index` to be a number.");
    }

    if (index < 0 || index > this.text.length) {
      throw new RangeError(
        `Index out of range (requested index ${index}, but source text has length ${this.text.length}).`
      );
    }
    if (index === this.text.length) {
      return {
        line: this.lines.length,
        // @ts-ignore
        column: this.lines.at(-1).length,
      };
    }

    const lineNumber =
      // @ts-ignore
      index >= this.lineStartIndices.at(-1)
        ? this.lineStartIndices.length
        : this.lineStartIndices.findIndex((el) => index < el);

    return {
      line: lineNumber,
      column: index - this.lineStartIndices[lineNumber - 1],
    };
  }

  getInlineConfigNodes() {
    return this.comments.filter((comment) => INLINE_CONFIG.test(comment.value));
  }

  getDisableDirectives() {
    /**
     * @type {{ruleId: null | string, message: string; loc: SourceLocation}[]}
     */
    const problems = [];
    /**
     * @type {Directive[]}
     */
    const directives = [];

    this.getInlineConfigNodes().forEach((comment) => {
      const parsed = commentParser.parseDirective(comment.value);
      if (!parsed) return;
      const { label, value, justification } = parsed;
      // `eslint-disable-line` directives are not allowed to span multiple lines as it would be confusing to which lines they apply
      if (
        label === "eslint-disable-line" &&
        comment.loc.start.line !== comment.loc.end.line
      ) {
        const message = `${label} comment should not span multiple lines.`;

        problems.push({
          ruleId: null,
          message,
          loc: comment.loc,
        });
        return;
      }

      switch (label) {
        case "eslint-disable":
        case "eslint-enable":
        case "eslint-disable-next-line":
        case "eslint-disable-line": {
          const directiveType = label.slice("eslint-".length);
          directives.push(
            new Directive({
              type: /** @type {DirectiveType} */ (directiveType),
              node: comment,
              value,
              justification,
            })
          );
        }
      }
    });

    return { problems, directives };
  }

  traverse() {
    /**
     * @type {TraversalStep[]}
     */
    const steps = [];

    /**
     *
     * @param {AnyHTMLNode | Program} node
     * @param {AnyHTMLNode | Program | null} parent
     */
    const visit = (node, parent) => {
      this.parentsMap.set(node, parent);
      // @ts-ignore
      node.parent = parent;
      steps.push(
        new HTMLTraversalStep({
          target: node,
          phase: STEP_PHASE.ENTER,
          args: [node, parent],
        })
      );
      // @ts-ignore
      for (const key of visitorKeys[node.type] || []) {
        // @ts-ignore
        const child = node[key];

        if (child) {
          if (Array.isArray(child)) {
            child.forEach((grandchild) => {
              visit(grandchild, node);
            });
          } else {
            visit(child, node);
          }
        }
      }
      steps.push(
        new HTMLTraversalStep({
          target: node,
          phase: STEP_PHASE.EXIT,
          args: [node, parent],
        })
      );
    };
    visit(this.ast, null);

    return steps;
  }

  /**
   * @param {AnyHTMLNode} node
   * @returns
   */
  getParent(node) {
    return this.parentsMap.get(node);
  }
}

module.exports = {
  HTMLSourceCode,
};
