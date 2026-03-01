/**
 * @import {Editor} from "codemirror";
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
    this.model.on(
      "autofixed",
      () => this.view.codeEditor.setValue(this.model.getCode())
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
    this.view.$errors.addEventListener('click', (event) => {
      const $button = event.target.closest("button");
      if ($button) {
        const $li = $button.closest("li");
        const index = Array.from($li.parentNode.children).indexOf($li);
        const message = this.model.messages[index];
        if ($button.textContent.includes("fix")) {
          this.model.applyFix(message);
        } else if ($button.textContent.includes("suggestion")) {
          this.model.applySuggestion(message);
        }
      }
    });
  }

  start() {
    const decoded = decodeURIComponent(escape(window.atob(window.location.hash.substring(1))));
    this.model.load(decoded);

    this.view.codeEditor.setValue(this.model.getCode());
    this.view.configEditor.setValue(JSON.stringify(
      {
        parserOptions: this.model.parserOptions || undefined,
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
      const parsed = JSON.parse(editor.getValue());
      const rules = parsed.rules;
      const parserOptions = parsed.parserOptions;
      this.model.setRules(rules);
      this.model.setParserOptions(parserOptions);
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
    this.view.renderLanguageTabs(this.model.language.key);
    this.view.codeEditor.setOption(
      "mode",
      this.model.language.mime
    );
    this.view.codeEditor.setValue(this.model.getCode());
    this.view.configEditor.setValue(JSON.stringify({
      rules: this.model.rules
    }, null, 2))
    this.model.lint();
  }
}

const app = new App();
app.start();
