/** @import {Linter} from "eslint" */

/**
 * Recommended config: applies the script processor to all *.html files.
 *
 * Users still configure which JS rules to enable — this config only wires up
 * the processor so that ESLint knows to extract and lint <script> blocks.
 *
 * @type {Linter.Config}
 */
const recommended = {
  files: ["**/*.html"],
  plugins: {
    /** @returns {import("eslint").ESLint.Plugin} */
    get ["@html-eslint/script"]() {
      return require("..");
    },
  },
  processor: "@html-eslint/script/script",
};

module.exports = { recommended };
