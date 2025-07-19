/**
 * @import {TemplateLiteral} from "@html-eslint/types";
 * @import {DocumentNode, AnyToken} from "es-html-parser";
 * @import {SourceCode} from "eslint";
 * @import {TemplateHTMLVisitor} from "@html-eslint/template-parser"
 */

const { parse, traverse } = require("@html-eslint/template-parser");

/**
 * Cache for parsed template literals to avoid re-parsing the same template multiple times.
 * Uses WeakMap for automatic garbage collection when nodes are no longer referenced.
 * @type {WeakMap<TemplateLiteral, {ast: any, html: string, tokens: any[]}>}
 */
const templateCache = new WeakMap();

/**
 * Get or create cached parse result for a template literal.
 * @param {TemplateLiteral} node
 * @param {SourceCode} sourceCode
 * @param {TemplateHTMLVisitor} [visitor]
 * @returns {{ast: DocumentNode, html: string, tokens: AnyToken[]}}
 */
function parseTemplateLiteral(node, sourceCode, visitor) {
  // Check if we already have a cached result for this node
  const cachedResult = templateCache.get(node);
  if (cachedResult) {
    if (visitor) {
      traverse(cachedResult.ast, visitor);
    }
    return cachedResult;
  }

  // Parse and cache the result
  const result = parse(node, sourceCode);
  templateCache.set(node, result);
  if (visitor) {
    traverse(result.ast, visitor);
  }
  return result;
}

module.exports = { parseTemplateLiteral };
