/**
 *  @typedef {import("eslint").AST.Program} Program
 *  @typedef {import("@eslint/plugin-kit").SourceLocation} SourceLocation
 *  @typedef {import("@eslint/core").TraversalStep} TraversalStep
 *  @typedef {import("@html-eslint/types").Comment} Comment
 *  @typedef {import("@html-eslint/types").AnyHTMLNode} AnyHTMLNode
 *  @typedef {import("../types").BaseNode} BaseNode
 */
const { TextSourceCodeBase } = require("@eslint/plugin-kit");
const { SourceCode } = require("eslint");
const { HTMLTraversalStep, STEP_PHASE } = require("./html-traversal-step");
const { visitorKeys } = require("@html-eslint/parser");

class HTMLSourceCode extends TextSourceCodeBase {
  /**
   * @param {{ast: Program, text: string, comments: Comment[]}} config
   */
  constructor({ ast, text, comments }) {
    super({ ast, text });
    /**
     * @property
     */
    this.eslintSourceCode = new SourceCode(text, ast);
    /**
     * @property
     */
    this.ast = ast;
    /**
     * @property
     */
    this.comments = comments;
    this.parentsMap = new Map();
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

  /**
   * @param {import("@eslint/core").Position} loc
   * @returns
   */
  getIndexFromLoc(loc) {
    return this.eslintSourceCode.getIndexFromLoc(loc);
  }

  /**
   * @param {number} index
   * @returns {import("@eslint/core").Position}
   */
  getLocFromIndex(index) {
    return this.eslintSourceCode.getLocFromIndex(index);
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
