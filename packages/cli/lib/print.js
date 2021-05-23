const chalk = require("chalk");
const log = require("./log");

const SEVERITY_NAMES = ["off", "warn", "error"];

function printSeverity(severity) {
  const printWithColor =
    SEVERITY_NAMES[severity] === "error" ? chalk.red : chalk.yellow;
  return printWithColor(SEVERITY_NAMES[severity]);
}

module.exports = function print(url, results) {
  log(chalk.underline.white(url));
  results.forEach((result) => {
    const { line, column, message, severity } = result;
    console.log(
      `  ${chalk.dim(`${line}:${column}`)}  ${printSeverity(
        severity
      )}  ${message}`
    );
  });
};
