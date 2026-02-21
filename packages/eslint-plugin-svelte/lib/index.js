/**
 * @html-eslint/eslint-plugin-svelte
 * ESLint plugin for HTML with Svelte support
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import rules from "./rules/index.js";
import { allRules } from "./configs/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  // @ts-ignore
  rules,
  configs: {
    recommended: {
      rules: allRules,
      plugins: {
        get ["@html-eslint/svelte"]() {
          return plugin;
        },
      },
    },
    all: {
      rules: allRules,
      plugins: {
        get ["@html-eslint/svelte"]() {
          return plugin;
        },
      },
    },
  },
};

export default plugin;
