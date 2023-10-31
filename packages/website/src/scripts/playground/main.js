import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import Linter from "./linter";
import { getInitial } from "./constants";
import { renderErrors, renderFixed } from "./render";
import { update } from "./hash-store";

/**
 * @typedef {import("eslint").Linter} ESLinter;
 * @typedef {import("eslint").Rule.RuleModule } RuleModule
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 * @typedef {import('eslint').Linter.Fi} LintMessage
 * @typedef {Object.<string, RuleModule>} RulesModules
 */

const $errors = document.getElementById("errors");
const $fixed = document.getElementById("fixed");

const linter = new Linter();

const codeEditor = CodeMirror.fromTextArea(
  document.getElementById("code-editor"),
  {
    mode: "text/html",
    lineNumbers: true,
    showCursorWhenSelecting: true,
  }
);

const configEditor = CodeMirror.fromTextArea(
  document.getElementById("config-editor"),
  {
    mode: "application/json",
    lineNumbers: false,
  }
);

/**
 * @param {string} code
 */
function handleCodeChange(code) {
  const { messages, output } = linter.lint(code);
  renderFixed($fixed, output);
  renderErrors(codeEditor, $errors, messages);
  update(codeEditor.getValue(), configEditor.getValue());
}

/**
 * @param {RulesRecord} rules
 * @param {string} code
 */
function handleRulesChange(rules, code) {
  linter.setRules(rules);
  const { messages, output } = linter.lint(code);
  renderFixed($fixed, output);
  renderErrors(codeEditor, $errors, messages);
  update(codeEditor.getValue(), configEditor.getValue());
}

codeEditor.on("change", (instance) => handleCodeChange(instance.getValue()));
configEditor.on("change", (instance) =>
  handleRulesChange(
    JSON.parse(instance.getValue()).rules,
    codeEditor.getValue()
  )
);

const { code, configs } = getInitial();
codeEditor.setValue(code);
configEditor.setValue(configs);
