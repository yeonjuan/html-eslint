import { remark } from "remark";
import html from "remark-html";
import * as path from "path";
import matter from "gray-matter";
import * as fs from "fs";
import type { DocData } from "../data/docs";
import { all } from "mdast-util-to-hast";

export async function getMarkdownHTML(data: DocData) {
  const remarkResult = await remark().use(html).process(data.markdown);
  const processedHTML = `
<article class="markdown-body">
${remarkResult.toString()}
</article>`;
  return processedHTML;
}

export async function getFilePaths(dirPath: string) {
  return fs.readdirSync(dirPath).map((file) => path.resolve(dirPath, file));
}

export function resolveRoot(...paths: string[]): string {
  return path.resolve(process.cwd(), "../../", ...paths);
}
