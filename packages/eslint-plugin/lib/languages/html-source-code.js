/**
 * @import {TraversalStep} from "@eslint/core"
 * @import {
 *   DirectiveType,
 *   SourceLocation
 * } from "@eslint/plugin-kit"
 * @import {
 *   AnyHTMLNode,
 *   CommentContent
 * } from "@html-eslint/types"
 * @import {AST} from "eslint"
 * @import {BaseNode} from "../types"
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
  /** @param {{ ast: AST.Program; text: string; comments: CommentContent[] }} config */
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

  // TODO the following methods are stubs
  /* eslint-disable no-unused-vars */

  /**
   * @param {import("estree").Node} _node
   * @returns {import("eslint").Scope.Variable[]}
   */
  getDeclaredVariables(_node) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @returns {import("estree").Comment | null}
   */
  getJSDocComment(_node) {
    return null;
  }

  /**
   * @param {number} _index
   * @returns {import("estree").Node | null}
   */
  getNodeByRangeIndex(_index) {
    return null;
  }

  /**
   * @param {import("eslint").AST.Token} _first
   * @param {import("eslint").AST.Token} _second
   * @returns {boolean}
   */
  isSpaceBetweenTokens(_first, _second) {
    return false;
  }

  /**
   * @param {number} _offset
   * @param {{ includeComments?: boolean }} [options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getTokenByRangeStart(_offset, options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getFirstToken(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getFirstTokens(_node, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getLastToken(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node} _node
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getLastTokens(_node, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getTokenBefore(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getTokensBefore(_node, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getTokenAfter(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getTokensAfter(_node, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getTokenOrCommentBefore(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _node
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getTokenOrCommentAfter(_node, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getFirstTokenBetween(_left, _right, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getFirstTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @param {any} [_options]
   * @returns {import("eslint").AST.Token | import("estree").Comment | null}
   */
  getLastTokenBetween(_left, _right, _options) {
    return null;
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getLastTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @param {any} [_options]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getTokensBetween(_left, _right, _options) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @param {number | undefined} [_beforeCount]
   * @param {number | undefined} [_afterCount]
   * @returns {(import("eslint").AST.Token | import("estree").Comment)[]}
   */
  getTokens(_node, _beforeCount, _afterCount) {
    return [];
  }

  /**
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _left
   * @param {import("estree").Node
   *   | import("eslint").AST.Token
   *   | import("estree").Comment} _right
   * @returns {boolean}
   */
  commentsExistBetween(_left, _right) {
    return false;
  }

  /**
   * @param {import("estree").Node | import("eslint").AST.Token} _nodeOrToken
   * @returns {import("estree").Comment[]}
   */
  getCommentsBefore(_nodeOrToken) {
    return [];
  }

  /**
   * @param {import("estree").Node | import("eslint").AST.Token} _nodeOrToken
   * @returns {import("estree").Comment[]}
   */
  getCommentsAfter(_nodeOrToken) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @returns {import("estree").Comment[]}
   */
  getCommentsInside(_node) {
    return [];
  }

  /**
   * @param {import("estree").Node} _node
   * @returns {import("eslint").Scope.Scope | null}
   */
  getScope(_node) {
    return null;
  }

  /**
   * @param {import("estree").Node | import("eslint").AST.Token} _first
   * @param {import("estree").Node | import("eslint").AST.Token} _second
   * @returns {boolean}
   */
  isSpaceBetween(_first, _second) {
    return false;
  }

  /**
   * @param {import("estree").Identifier} _node
   * @returns {boolean}
   */
  isGlobalReference(_node) {
    return false;
  }

  /**
   * @param {string} _name
   * @param {import("estree").Node} [_refNode]
   * @returns {boolean}
   */
  markVariableAsUsed(_name, _refNode) {
    return false;
  }

  /* eslint-enable no-unused-vars */
}
/**
 * @param {{ ast: AST.Program; text: string; comments: CommentContent[] }} config
 * @returns {TextSourceCodeBase<any> & {
 *   getDisableDirectives(): {
 *     problems: {
 *       ruleId: null | string;
 *       message: string;
 *       loc: SourceLocation;
 *     }[];
 *     directives: Directive[];
 *   };
 *   getInlineConfigNodes(): CommentContent[];
 * }}
 */
function createHTMLSourceCode(config) {
  return new HTMLSourceCode(config);
}

module.exports = {
  createHTMLSourceCode,
};
