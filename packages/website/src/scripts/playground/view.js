/**
 * @import {LintMessage} from "./linter";
 * @import {Editor} from "codemirror";
 */

import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import rules from "@html-eslint/eslint-plugin/lib/rules";
import CodeMirror from "codemirror";
import {
  toMarker,
  escapeHTML
} from "./helpers";
import {
  html
} from "@html-kit/html";

// HTML ESLint rules for autocomplete
const HTML_ESLINT_RULES = Object.keys(rules).map(rule => `@html-eslint/${rule}`);

const HTML_REG = /"@html-eslint\//;
const RULES_REG = /"rules"[\s\S]*?"@html-eslint\//;

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
        lineNumbers: false,
        extraKeys: {
          "Ctrl-Space": "autocomplete"
        },
        hintOptions: {
          hint: this.getHtmlEslintHints.bind(this)
        }
      }
    );
    this.configEditor.on('inputRead', (cm, change) => {
      if (change.text[0].match(/[\w$.]/)) {
        this.configEditor.showHint({
          completeSingle: false
        });
      }
    });

    this.$languageTabs = document.getElementById("language-tabs");
    this.$errors = document.getElementById("errors");
  }

  /**
   * Custom hint function for HTML ESLint rules
   * @param {CodeMirror.Editor} cm
   * @returns {Object|null}
   */
  getHtmlEslintHints(cm) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const start = token.start;
    const end = cur.ch;
    const line = cm.getLine(cur.line);

    // Get the text before cursor
    const textBefore = line.substring(0, cur.ch);

    // Check if we're in a context where rule names should be suggested
    const ruleContext = HTML_REG.test(textBefore) ||
                       RULES_REG.test(cm.getValue().substring(0, cm.indexFromPos(cur)));
    if (!ruleContext) {
      return null;
    }


    // Extract the current word being typed
    const word = token.string.replace(/^["']|["']$/g, '');
    // Filter rules based on what's being typed
    const suggestions = HTML_ESLINT_RULES
      .filter(rule => rule.includes(word.toLowerCase()))
      .map(rule => ({
        text: `"${rule}"`,
        displayText: rule
      }));

    if (suggestions.length === 0) {
      return null;
    }

    return {
      list: suggestions,
      from: CodeMirror.Pos(cur.line, start),
      to: CodeMirror.Pos(cur.line, end)
    };
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
    const children = messages.
      map((message) => this.lintMessageHTML(message));

    this.$errors.innerHTML = html`<ul class="text-sm flex flex-col gap-2">
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
    line, column, message, ruleId, fatal, fix, suggestions
  }) {
    if (fatal) {
      console.error(message);
      return html`<li class="bg-red-100 text-red-800 px-2 py-1 my-1 rounded">
          ${line}:${column} - ${message}
        </li>`;
    }
    const rule = ruleId.replace(
      "@html-eslint/",
      ""
    )
    return html`<li class="bg-red-100 text-red-800 px-2 rounded flex items-center">
        <span class="my-4">
          <span>${line}:${column} - ${escapeHTML(message)}</span>
          <a href="/docs/rules/${rule}" class="ml-1 hover:underline">(${rule})</a>
        </span>
        <div class="ml-auto mr-0 my-2">
          ${fix ? html`<button class="bg-accent text-white px-4 py-1 rounded hover:opacity-80 w-max">apply fix</button>` : ""}
          ${suggestions && suggestions.length > 0 ? html`
            <button class="bg-accent text-white px-4 py-1 rounded hover:opacity-80 w-max">apply suggestion</button>
          ` : ""}
        </div>
      </li>`;
  }
}
