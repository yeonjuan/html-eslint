/**
 * @typedef {import("codemirror").Editor} Editor
 */
import { getInitial } from "./helpers";
import { Model } from "./model";
import { View } from "./view";

const INITIAL_HTML = /* html */ `<!DOCTYPE html>
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

class App {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.model.on("lint", () => this.handleLint());
    this.view.codeEditor.on("change", (editor) =>
      this.handleCodeChange(editor)
    );
    this.view.configEditor.on("change", (editor) => {
      this.handleConfigChange(editor);
    });
  }

  start() {
    const { code, config } = getInitial();
    this.model.code = code;
    this.model.rules = config.rules;
    this.view.codeEditor.setValue(this.model.code);
    this.view.configEditor.setValue(config);
    this.handleCodeChange(this.view.codeEditor);
    this.handleConfigChange(this.view.configEditor);
  }

  /**
   * @param {Editor} editor
   */
  handleConfigChange(editor) {
    const rules = JSON.parse(editor.getValue()).rules;
    this.model.setRules(rules);
    this.model.lint();
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
}

const app = new App();
app.start();
