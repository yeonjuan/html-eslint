/**
 * @typedef {import("codemirror").Editor} Editor
 */
import {
  Model
} from "./model";
import {
  View
} from "./view";

class App {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.model.on(
      "lint",
      () => this.handleLint()
    );
    this.model.on(
      "changeLanguage",
      () => this.handleLanguageChange()
    );
    this.view.codeEditor.on(
      "change",
      (editor) => this.handleCodeChange(editor)
    );
    this.view.configEditor.on(
      "change",
      (editor) => {
        this.handleConfigChange(editor);
      }
    );
    this.view.$languageTabs.addEventListener(
      "click",
      (event) => {
        const $tab = event.target.closest("[data-language]");
        this.model.setLanguage($tab.dataset.language);
      }
    );
  }

  start() {
    const decoded = decodeURIComponent(escape(window.atob(window.location.hash.substring(1))));
    this.model.load(decoded);

    this.view.codeEditor.setValue(this.model.getCode());
    this.view.configEditor.setValue(JSON.stringify(
      {
        rules: this.model.rules
      },
      null,
      2
    ));
    this.handleCodeChange(this.view.codeEditor);
    this.handleConfigChange(this.view.configEditor);
    this.handleLanguageChange();
  }

  /**
   * @param {Editor} editor
   */
  handleConfigChange(editor) {
    try {
      const rules = JSON.parse(editor.getValue()).rules;
      this.model.setRules(rules);
      this.model.lint();
    } catch (e) {
      this.view.renderErrors([
        {
          line: 0,
          column: 0,
          message: e.message,
          fatal: true
        }
      ]);
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
    this.view.codeEditor.setOption(
      "mode",
      this.model.language.mime()
    );
    this.view.codeEditor.setValue(this.model.getCode());
    this.model.lint();
  }
}

const app = new App();
app.start();
