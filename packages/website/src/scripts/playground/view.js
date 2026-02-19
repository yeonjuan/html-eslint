/**
 * @import {LintMessage} from "./linter";
 * @import {Editor} from "codemirror";
 */

import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/jsx/jsx.js";
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

// ESLint severity values for autocomplete
const ESLINT_SEVERITIES = ["error", "warn", "off"];
const RULES_VALUE_REG = /"@html-eslint\/[^"]*":\s*/;

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
    const ruleNameContext = HTML_REG.test(textBefore) ||
                           RULES_REG.test(cm.getValue().substring(0, cm.indexFromPos(cur)));

    const ruleValueContext = RULES_VALUE_REG.test(textBefore);

    if (!ruleNameContext && !ruleValueContext) {
      return null;
    }

    let suggestions = [];
    const word = token.string.replace(/^["']|["']$/g, '');

    if (ruleValueContext) {
      // Provide ESLint severity suggestions
      suggestions = ESLINT_SEVERITIES
        .filter(severity => {
          const severityStr = severity.toString();
          return severityStr.toLowerCase().includes(word.toLowerCase());
        })
        .map(severity => ({
          text: typeof severity === 'string' ? `"${severity}"` : severity.toString(),
          displayText: severity.toString()
        }));
    } else if (ruleNameContext) {
      // Provide rule name suggestions
      suggestions = HTML_ESLINT_RULES
        .filter(rule => rule.includes(word.toLowerCase()))
        .map(rule => ({
          text: `"${rule}"`,
          displayText: rule
        }));
    }

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
          <a class="ml-1 hover:underline" href="/docs/rules/${rule}">(${rule})</a>
        </span>
        <div class="ml-auto mr-0 my-2">
          ${fix ? html`<button type="submit" class="bg-accent text-white px-4 py-1 rounded hover:opacity-80 w-max">apply fix</button>` : ""}
          ${suggestions && suggestions.length > 0 ? html`
            <button type="submit" class="bg-accent text-white px-4 py-1 rounded hover:opacity-80 w-max">apply suggestion</button>
          ` : ""}
        </div>
      </li>`;
  }
}
