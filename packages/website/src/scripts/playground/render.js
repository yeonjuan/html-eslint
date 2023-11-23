/**
 * @typedef {import("codemirror").Editor} Editor
 * @typedef {import("codemirror").TextMarker} TextMarker
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 */

/**
 * @type {TextMarker[]}
 */
let prevMarks = [];

/**
 * @param {Editor} editor
 * @param {HTMLElement} $errors
 * @param {LintMessage[]} messages
 * @param {LintMessage?} fataMessage
 */
export function renderErrors(editor, $errors, messages, fatalMessage) {
  $errors.innerHTML = errorsHTML(messages, fatalMessage);
  if (messages.some((message) => message.fatal)) {
    return;
  }

  prevMarks.forEach((mark) => mark.clear());
  prevMarks = [];

  messages.map(toMarker).forEach(([start, end]) => {
    prevMarks.push(
      editor.markText(start, end, {
        className: "editor_error",
      })
    );
  });
}

/**
 * @param {HTMLElement} $fixed
 * @param {string} output
 */
export function renderFixed($fixed, output) {
  $fixed.textContent = output;
}

/**
 * @param {LintMessage} message
 */
function toMarker(message) {
  const from = {
    line: toMarkerPos(message.line),
    ch: toMarkerPos(message.column),
  };
  const to = {
    line: toMarkerPos(message.endLine || message.line),
    ch: toMarkerPos(message.endColumn || message.column),
  };
  return [from, to];
}

/**
 * @param {number} pos
 * @returns
 */
function toMarkerPos(pos) {
  return pos - 1;
}

/**
 * @param {LintMessage[]} messages
 * @param {LintMessage?} fatalMessage
 */
function errorsHTML(messages, fatalMessage) {
  const list = [];

  const liHTML = (child) =>
    `<li class="bg-red-100 text-red-800 px-2 py-1 my-1 rounded">${child}</li>`;

  if (fatalMessage) {
    list.push(liHTML(fatalMessage.message));
  } else if (messages.length) {
    messages.forEach((message) => {
      list.push(
        liHTML(
          `${message.line}:${message.line} - ${
            message.message
          }(<a href="/docs/rules/${message.ruleId.replace(
            "@html-eslint/",
            ""
          )}">${message.ruleId}</a>)`
        )
      );
    });
  }

  const html = `<ul class="text-sm">${list.join("")}</ul>`;
  return html;
}
