const hashStore = require("./hash-store");

/**
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 */

const INITIAL_HTML = `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
          <div>
        <li> foo </li>
        </div>
    </body>
</html>
`;

const INITAIL_CONFIG = JSON.stringify(
  { rules: { "@html-eslint/indent": "error" } },
  null,
  2
);

/**
 * @returns {{code: string, configs: string}}
 */
export function getInitial() {
  try {
    const { code, configs } = hashStore.get();
    return {
      code: code || INITIAL_HTML,
      configs: configs || INITAIL_CONFIG,
    };
  } catch (e) {
    return {
      code: INITIAL_HTML,
      configs: INITAIL_CONFIG,
    };
  }
}
