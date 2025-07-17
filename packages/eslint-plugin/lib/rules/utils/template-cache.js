/**
 * @import {TemplateLiteral} from "@html-eslint/types";
 * @import {DocumentNode, AnyToken} from "es-html-parser";
 * @import {SourceCode} from "eslint";
 */

const { parse } = require("@html-eslint/template-parser");

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
 * @returns {{ast: DocumentNode, html: string, tokens: AnyToken[]}}
 */
function getCachedParseResult(node, sourceCode) {
  // Check if we already have a cached result for this node
  const cachedResult = templateCache.get(node);
  if (cachedResult) {
    return cachedResult;
  }

  // Parse and cache the result
  const result = parse(node, sourceCode, {});
  templateCache.set(node, result);

  return result;
}

module.exports = { getCachedParseResult };
