/**
 * @import {LintMessage} from "./linter";
 * @import {Editor} from "codemirror";
 */

import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import CodeMirror from "codemirror";
import {
  toMarker,
  escapeHTML
} from "./helpers";
import {
  html
} from "@html-kit/html";

export class View {
  constructor() {
    /**
     * @member
     * @type {CodeMirror.Editor}
     */
    this.codeEditor = CodeMirror.fromTextArea(
      document.getElementById("code-editor"),
      {
        mode: "text/html",
        lineNumbers: true,
        showCursorWhenSelecting: true
      }
    );

    /**
     * @member
     * @type {CodeMirror.Editor}
     */
    this.configEditor = CodeMirror.fromTextArea(
      document.getElementById("config-editor"),
      {
        mode: "application/json",
        lineNumbers: false
      }
    );

    this.$languageTabs = document.getElementById("language-tabs");
  }

  /**
   * @param {string} content
   */
  renderFixed(content) {
    const $fixed = document.getElementById("fixed");
    $fixed.textContent = content;
  }

  /**
   * @param {string} language
   */
  renderLanguageTabs(language) {
    const $tabs = document.querySelectorAll("[data-language]");
    [...$tabs].forEach(($tab) => {
      if ($tab.dataset.language === language) {
        $tab.classList.add("bg-gray-300");
      } else {
        $tab.classList.remove("bg-gray-300");
      }
    });
  }

  /**
   *
   * @param {LintMessage[]} messages
   */
  renderErrors(messages) {
    const $errors = document.getElementById("errors");

    const children = messages.
      map((message) => this.lintMessageHTML(message));

    $errors.innerHTML = html`<ul class="text-sm">
        ${children}
      </ul>`;

    if (messages.some((message) => message.fatal)) {
      return;
    }

    this.codeEditor.getAllMarks().forEach((mark) => mark.clear());
    messages.forEach((message) => {
      const [
        start,
        end
      ] = toMarker(message);
      this.codeEditor.markText(
        start,
        end,
        {
          className: "editor_error"
        }
      );
    });
  }

  /**
   * @private
   * @param {LintMessage} message
   */
  lintMessageHTML({
    line, column, message, ruleId, fatal
  }) {
    if (fatal) {
      console.error(message);
      return html`<li class="bg-red-100 text-red-800 px-2 py-1 my-1 rounded">
          ${line}:${column} - ${message}
        </li>`;
    }

    return html`<li class="bg-red-100 text-red-800 px-2 py-1 my-1 rounded">
        ${line}:${column} - ${escapeHTML(message)}(
        <a href="/docs/rules/${ruleId.replace(
          "@html-eslint/",
          ""
        )}">${ruleId}</a>
        )
      </li>`;
  }
}
