import { remark } from "remark";
import html from "remark-html";
import * as path from "path";
import matter from "gray-matter";
import { all } from "mdast-util-to-hast";
import * as fs from "fs";

export async function getMarkdownData(filePath: string) {
  const markdownPath = path.join(filePath);
  const markdownFile = fs.readFileSync(markdownPath, "utf-8");
  const { content, data } = matter(markdownFile);
  const remarkResult = await remark().use(html).process(content);
  const processedHTML = `<article class="markdown-body">${remarkResult.toString()}</article>`;
  return { html: processedHTML, data };
}

export async function getFilePaths(dirPath: string) {
  return fs.readdirSync(dirPath).map((file) => path.resolve(dirPath, file));
}
