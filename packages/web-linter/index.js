if (typeof process === "undefined") {
  // eslint-disable-next-line no-undef
  window.process = require("process/browser");
}

function getLinter() {
  return require("./node_modules/eslint/lib/linter/linter").Linter;
}

module.exports.Linter = getLinter();
