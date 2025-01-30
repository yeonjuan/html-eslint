const {
  html
} = require("@html-kit/html");

const fileIconMap = {
  Terminal: "~/src/assets/icon-terminal.svg",
  ".vscode/settings.json": "~/src/assets/icon-json.svg",
  ".eslintrc.js": "~/src/assets/icon-js.svg"
};

const fileIcon = (name) => {
  const icon = fileIconMap[name];
  if (!icon) return "";
  return html`<img src="${icon}" alt="" width="20" height="20">`;
};

const fileName = (name) => {
  if (!name) return "";
  return `<div class="md-code-filename">
    ${fileIcon(name)}
    ${name}
  </div>
  `;
};

/**
 *
 * @param {"correct" | "incorrect"} type
 * @param {string} code
 */
const exampleCode = (type, code) => {
  return html`<div class="md-code-wrapper md-code-${type}">
    <pre><code class="hljs code2">${code}</code></pre></div>
  `;
};

const exampleIcon = (type) => {
  return html`<img src="~/src/assets/icon-${type}.svg" class="inline mr-[9px]" alt="">`;
};

module.exports = {
  fileName,
  exampleCode,
  exampleIcon
};
