/**
 * @import {TraversalStep} from "@eslint/core"
 * @import {
 *   DirectiveType,
 *   SourceLocation
 * } from "@eslint/plugin-kit"
 * @import {
 *   HTMLComment,
 *   HTMLProgram
 * } from "@html-eslint/parser"
 * @import {
 *   AnyHTMLNode,
 *   AnyToken,
 *   CommentContent,
 *   NodeOrTokenData
 * } from "@html-eslint/types"
 * @import {Scope} from "eslint"
 * @import {BaseNode} from "../types"
 * @import {
 *   SourceCodeOptions,
 *   TokenOrHTMLComment
 * } from "./types"
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

/** @extends TextSourceCodeBase<SourceCodeOptions> */
class HTMLSourceCode extends TextSourceCodeBase {
  /** @param {{ ast: HTMLProgram; text: string; comments: CommentContent[] }} config */
  constructor({ ast, text, comments }) {
    super({ ast, text });

    /** @property */
    this.ast = ast;
    /** @property */
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

  /** @returns {CommentContent[]} */
  getAllComments() {
    return this.comments;
  }

  getInlineConfigNodes() {
    return this.comments.filter((comment) => INLINE_CONFIG.test(comment.value));
  }

  getDisableDirectives() {
    /**
     * @type {{
     *   ruleId: null | string;
     *   message: string;
     *   loc: SourceLocation;
     * }[]}
     */
    const problems = [];
    /** @type {Directive[]} */
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
    /** @type {TraversalStep[]} */
    const steps = [];

    /**
     * @param {AnyHTMLNode | HTMLProgram} node
     * @param {AnyHTMLNode | HTMLProgram | null} parent
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

  // TODO the following methods are stubs
  /* eslint-disable no-unused-vars */

  /**
   * @param {NodeOrTokenData} _node
   * @returns {Scope.Variable[]}
   */
  getDeclaredVariables(_node) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @returns {HTMLComment | null}
   */
  getJSDocComment(_node) {
    return null;
  }

  /**
   * @param {number} _index
   * @returns {NodeOrTokenData | null}
   */
  getNodeByRangeIndex(_index) {
    return null;
  }

  /**
   * @param {AnyToken} _first
   * @param {AnyToken} _second
   * @returns {boolean}
   */
  isSpaceBetweenTokens(_first, _second) {
    return false;
  }

  /**
   * @param {number} _offset
   * @param {{ includeComments?: boolean }} [options]
   * @returns {TokenOrHTMLComment | null}
   */
  getTokenByRangeStart(_offset, options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getFirstToken(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getFirstTokens(_node, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getLastToken(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getLastTokens(_node, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getTokenBefore(_node, _options) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getTokensBefore(_node, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getTokenAfter(_node, _options) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getTokensAfter(_node, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getTokenOrCommentBefore(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getTokenOrCommentAfter(_node, _options) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getFirstTokenBetween(_left, _right, _options) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getFirstTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment | null}
   */
  getLastTokenBetween(_left, _right, _options) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getLastTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @param {any} [_options]
   * @returns {TokenOrHTMLComment[]}
   */
  getTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @param {number | undefined} [_beforeCount]
   * @param {number | undefined} [_afterCount]
   * @returns {TokenOrHTMLComment[]}
   */
  getTokens(_node, _beforeCount, _afterCount) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _left
   * @param {NodeOrTokenData} _right
   * @returns {boolean}
   */
  commentsExistBetween(_left, _right) {
    return false;
  }

  /**
   * @param {NodeOrTokenData} _nodeOrToken
   * @returns {HTMLComment[]}
   */
  getCommentsBefore(_nodeOrToken) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _nodeOrToken
   * @returns {HTMLComment[]}
   */
  getCommentsAfter(_nodeOrToken) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @returns {HTMLComment[]}
   */
  getCommentsInside(_node) {
    return [];
  }

  /**
   * @param {NodeOrTokenData} _node
   * @returns {Scope.Scope | null}
   */
  getScope(_node) {
    return null;
  }

  /**
   * @param {NodeOrTokenData} _first
   * @param {NodeOrTokenData} _second
   * @returns {boolean}
   */
  isSpaceBetween(_first, _second) {
    return false;
  }

  /**
   * @param {NodeOrTokenData} _node
   * @returns {boolean}
   */
  isGlobalReference(_node) {
    return false;
  }

  /**
   * @param {string} _name
   * @param {NodeOrTokenData} [_refNode]
   * @returns {boolean}
   */
  markVariableAsUsed(_name, _refNode) {
    return false;
  }

  /* eslint-enable no-unused-vars */
}
/**
 * @param {{ ast: HTMLProgram; text: string; comments: CommentContent[] }} config
 * @returns {HTMLSourceCode}
 */
function createHTMLSourceCode(config) {
  return new HTMLSourceCode(config);
}

module.exports = {
  createHTMLSourceCode,
};
