/** @import {Linter} from "eslint" */

/**
 * Represents a single extracted <script> block from an HTML file.
 *
 * @typedef {Object} ScriptBlock
 * @property {string} text - The JavaScript source code.
 * @property {string} filename - Virtual filename for ESLint (e.g. "0.js").
 * @property {number} lineOffset - Line offset in the original HTML file.
 * @property {number} columnOffset - Column offset of the first line.
 */

/**
 * Extracts all <script> blocks from raw HTML text.
 *
 * @param {string} text
 * @returns {ScriptBlock[]}
 * @todo Implement extraction using es-html-parser or regex, handle `type`
 *   attribute filtering.
 */
function extractScriptBlocks(text) {
  throw new Error("Not implemented");
}

/** @type {Linter.Processor} */
const processor = {
  /**
   * Called before ESLint parses each file. Returns an array of virtual code
   * blocks (one per <script> tag) for ESLint to lint as separate JS files.
   *
   * @param {string} text
   * @param {string} filename
   * @returns {Linter.ProcessorFile[]}
   * @todo Implement script extraction and return virtual JS files.
   */
  preprocess(text, filename) {
    throw new Error("Not implemented");
  },

  /**
   * Called after ESLint lints each virtual code block. Remaps lint message
   * locations back to their original positions in the HTML file and flattens
   * all results into a single array.
   *
   * @param {Linter.LintMessage[][]} messages
   * @param {string} filename
   * @returns {Linter.LintMessage[]}
   * @todo Implement location remapping using ScriptBlock offsets.
   */
  postprocess(messages, filename) {
    throw new Error("Not implemented");
  },

  supportsAutofix: true,
};

module.exports = processor;
