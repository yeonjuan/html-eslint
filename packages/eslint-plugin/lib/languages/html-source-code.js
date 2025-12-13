/**
 * @import {AST} from 'eslint';
 * @import {SourceLocation, DirectiveType} from '@eslint/plugin-kit';
 * @import {TraversalStep, SourceCode} from '@eslint/core';
 * @import {CommentContent, AnyHTMLNode} from '@html-eslint/types';
 * @import {BaseNode} from '../types';
 *
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
   * @param {{ast: AST.Program, text: string, comments: CommentContent[]}} config
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
     * @param {AnyHTMLNode | AST.Program} node
     * @param {AnyHTMLNode | AST.Program | null} parent
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
/**
 * @param {{ast: AST.Program, text: string, comments: CommentContent[]}} config
 * @returns {TextSourceCodeBase<any> & {
 *   getDisableDirectives(): { problems: {ruleId: null | string, message: string; loc: SourceLocation}[]; directives: Directive[]}
 *   getInlineConfigNodes(): CommentContent[]
 * }}
 */
function createHTMLSourceCode(config) {
  return new HTMLSourceCode(config);
}

module.exports = {
  createHTMLSourceCode,
};
