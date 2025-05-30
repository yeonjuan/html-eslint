/**
 * @typedef {import("codemirror").Editor} Editor
 */
import {
  Model 
} from "./model";
import {
  View 
} from "./view";
import {
  Linter 
} from "eslint"; // or from the html-eslint package


class App {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.linter = new Linter();

    this.model.on("lint", () => this.handleLint());
    this.model.on("changeLanguage", () => this.handleLanguageChange());

    this.view.codeEditor.on("change", (editor) => this.handleCodeChange(editor));
    this.view.configEditor.on("change", (editor) => this.handleConfigChange(editor));

    this.view.$languageTabs.addEventListener("click", (event) => {
      const $tab = event.target.closest("[data-language]");
      if ($tab) {
        this.model.setLanguage($tab.dataset.language);
      }
    });
  }

  start() {
    const decoded = decodeURIComponent(escape(window.atob(window.location.hash.substring(1))));
    this.model.load(decoded);

    this.view.codeEditor.setValue(this.model.getCode());
    this.view.configEditor.setValue(JSON.stringify({
      parserOptions: this.model.parserOptions || undefined,
      rules: this.model.rules
    }, null, 2));

    this.handleCodeChange(this.view.codeEditor);
    this.handleConfigChange(this.view.configEditor);
    this.handleLanguageChange();

    // Setup fix/suggestion buttons
    const applyFixBtn = document.getElementById("applyFixBtn");
    const applySuggestionBtn = document.getElementById("applySuggestionBtn");
    const lintOutput = document.getElementById("lintOutput");

    applyFixBtn.addEventListener("click", () => {
      const code = this.view.codeEditor.getValue();
      const eslintConfig = this.getLintConfig();
      const results = this.linter.verifyAndFix(code, eslintConfig);

      if (results.output && results.output !== code) {
        this.view.codeEditor.setValue(results.output);
        lintOutput.textContent = "✅ Applied auto-fix.";
      } else {
        lintOutput.textContent = "ℹ️ No fixes available.";
      }
    });

    applySuggestionBtn.addEventListener("click", () => {
      const code = this.view.codeEditor.getValue();
      const eslintConfig = this.getLintConfig();
      const messages = this.linter.verify(code, eslintConfig);

      const suggestionMsg = messages.find(msg => msg.suggestions && msg.suggestions.length > 0);
      if (suggestionMsg) {
        const suggestion = suggestionMsg.suggestions[0];
        const newCode = this.applyFix(code, suggestion.fix);
        this.view.codeEditor.setValue(newCode);
        lintOutput.textContent = `✅ Applied suggestion: ${suggestion.desc}`;
      } else {
        lintOutput.textContent = "ℹ️ No suggestions available.";
      }
    });
  }

  /**
   * @param {Editor} editor
   */
  handleConfigChange(editor) {
    try {
      const parsed = JSON.parse(editor.getValue());
      const rules = parsed.rules;
      const parserOptions = parsed.parserOptions;
      this.model.setRules(rules);
      this.model.setParserOptions(parserOptions);
      this.model.lint();
    } catch (e) {
      this.view.renderErrors([{
        line: 0,
        column: 0,
        message: e.message,
        fatal: true
      }]);
    }
  }

  /**
   * @param {Editor} editor
   */
  handleCodeChange(editor) {
    this.model.setCode(editor.getValue());
    this.model.lint();
  }

  handleLint() {
    this.view.renderErrors(this.model.messages);
    this.view.renderFixed(this.model.fixed);
    const hash = this.model.toHash();
    window.location.hash = hash;
  }

  handleLanguageChange() {
    this.view.renderLanguageTabs(this.model.language.value);
    this.view.codeEditor.setOption("mode", this.model.language.mime());
    this.view.codeEditor.setValue(this.model.getCode());
    this.model.lint();
  }

  getLintConfig() {
    try {
      return JSON.parse(this.view.configEditor.getValue());
    } catch (e) {
      return {};
    }
  }

  applyFix(code, fix) {
    return code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]);
  }
}

const app = new App();
app.start();
