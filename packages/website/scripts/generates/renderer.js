const headingLevelClass = {
  1: "text-2xl my-6 md:text-3xl scroll-mt-[64px]",
  2: "text-xl my-4 md:text-2xl scroll-mt-[64px]",
  3: "text-lg my-2 md:text-xl scroll-mt-[64px]",
  4: "my-2 block  scroll-mt-[64px]",
};

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
      .replace(/[\s\/]/g, "-");
    return `
    <h${level} id="${id}" class="${headingLevelClass[level]}">
      ${text}
      <a href="#${id}"><img src="~/src/assets/link.svg" class="inline ${linkIconClass[level]}"></a>
    </h${level}>`;
  },
  paragraph(text) {
    return `<p>${text}</p>`;
  },
  list(body) {
    return `<ol class="list-disc pl-6 py-2 font-light">${body}</ol>`;
  },
  codespan(code) {
    return `<code class="py-1 px-1 rounded bg-slate-100 font-light text-sm">${code}</code>`;
  },
};
