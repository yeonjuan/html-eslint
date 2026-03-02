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
    return [];
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
   * @returns {HTMLComment | null}
   */
  getJSDocComment(_node) {
    return null;
  }

  /** Stub implementations for ESLint's SourceCode API Compatibility */

  /**
   * @deprecated HTM does not have scopes
   * @param {NodeOrTokenData} node
   * @returns {Scope.Scope | null}
   */
  getScope(node) {
    if (node?.type !== "Program") {
      return null;
    }
    return createFakeGlobalScope(this.ast);
  }

  /**
   * @deprecated HTML does not have scopes
   * @returns {Scope.ScopeManager | null}
   */
  get scopeManager() {
    return {
      scopes: [],
      globalScope: createFakeGlobalScope(this.ast),
      acquire: (node) => {
        if (node.type === "Program") {
          return createFakeGlobalScope(this.ast);
        }
        return null;
      },
      getDeclaredVariables: () => [],
    };
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

/**
 * @deprecated HTML does not have scopes
 * @param {HTMLProgram} node
 * @returns {Scope.Scope}
 */
function createFakeGlobalScope(node) {
  /** @type {Scope.Scope} */
  const fakeGlobalScope = {
    type: "global",
    // @ts-ignore
    block: node,
    set: new Map(),
    through: [],
    childScopes: [],
    // @ts-ignore
    variableScope: null,
    variables: [],
    references: [],
    functionExpressionScope: false,
    isStrict: false,
    upper: null,
    implicit: {
      variables: [],
      set: new Map(),
    },
  };
  fakeGlobalScope.variableScope = fakeGlobalScope;
  return fakeGlobalScope;
}

module.exports = {
  createHTMLSourceCode,
};
