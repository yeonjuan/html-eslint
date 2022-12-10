import * as path from "path";
import * as fs from "fs";
import type { DocData } from "../data/docs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

export async function getMarkdownHTML(data: DocData) {
  const remarkResult = await unified()
    .use(remarkParse)
    .use(() => (tree) => {
      visit(tree, "link", (node) => {
        if (process.env.NODE_ENV === "production") {
          if (!node.url.startsWith("http")) {
            node.url = `/html-eslint/docs/${node.url
              .split("/")
              .filter(Boolean)
              .join("/")}`;
          }
        }
      });
    })
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(data.markdown);

  const processedHTML = remarkResult.toString();
  return processedHTML;
}

export async function getFilePaths(dirPath: string) {
  return fs.readdirSync(dirPath).map((file) => path.resolve(dirPath, file));
}

export function resolveRoot(...paths: string[]): string {
  return path.resolve(process.cwd(), "../../", ...paths);
}
