const { fileName, exampleCode, exampleIcon } = require("./html-factory");

const linkIconClass = {
  1: "w-[20px]",
  2: "w-[18px]",
  3: "w-[16px]",
  4: "w-[16px]",
};

module.exports = {
  heading(text, level) {
    const id = text
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/[\s\/]/g, "-")
      .replace(/-+/g, "-")
      .replace(/-$/, "");
    return `
    <h${level} id="${id}" class="group md-heading${level}">
      ${text}
      <a href="#${id}" aria-label="${text}"><img src="~/src/assets/link.svg" alt="" class="inline md:hidden md:group-hover:inline ${linkIconClass[level]}"></a>
    </h${level}>`;
  },
  paragraph(text) {
    let icon = "";
    if (text.includes("<strong>correct</strong>")) {
      icon = exampleIcon("correct");
    }

    if (text.includes("<strong>incorrect</strong>")) {
      icon = exampleIcon("incorrect");
    }

    return `<p class="md-p">${icon}${text}</p>`;
  },
  list(body) {
    return `<ol class="md-list">${body}</ol>`;
  },
  listitem(text) {
    return `<li class="md-listitem">${text}</li>`;
  },
  codespan(code) {
    return `<code class="md-codespan">${code}</code>`;
  },
  code(code, info) {
    [_, info] = info.includes(",") ? info.split(",") : [info];

    if (info === "correct" || info === "incorrect") {
      return exampleCode(info, code);
    }

    return `<div class="md-code-wrapper">
      ${fileName(info)}
       <pre><code class="hljs code2 md-code${
         info ? "" : "-no-filename"
       }">${code}</code></pre>
      </div>
    `;
  },
  link(href, title, text) {
    const isExternal = href.indexOf("http") === 0;
    if (isExternal) {
      text += /* html */ `<img class="inline" src="~/src/assets/icon-external-link.svg" alt="" width="20" height="20">`;
    }
    href = href.replace(/\.md$/, "");
    return /* html */ `<a href="${href}" target="${isExternal ? "blank" : ""}" class="md-a" rel="noopener noreferrer">${text}</a>`;
  },
  tablecell(content, flags) {
    if (flags.header) {
      return `<th class="md-th">${content}</th>`;
    }
    return `<td class="md-td">${content}</td>`;
  },
  table(header, body) {
    return `<div class="md-table-wrapper"><table class="md-table">${header}${body}</table></div>`;
  },
};
