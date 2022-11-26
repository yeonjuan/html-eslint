import { resolveRoot } from "../utils/docs";
import * as plugin from "@html-eslint/eslint-plugin";
import * as fs from "fs";
import matter from "gray-matter";

export type DocData = {
  title: string;
  markdown: string;
  path: string;
};

const getDocData = (markdownPath: string): DocData => {
  const path = resolveRoot(markdownPath);
  const markdown = fs.readFileSync(path, "utf-8");
  const { data, content } = matter(markdown);
  return {
    title: data.title,
    markdown: content,
    path: `/${markdownPath.replace(".md", "")}`,
  };
};

const CATEGORY_RULE_DOC_DATA_MAP = Object.entries(plugin.rules).reduce(
  (categoryMap, [key, rule]: any) => {
    categoryMap[rule.meta.docs.category] = {
      ...(categoryMap[rule.meta.docs.category] || {}),
      [`/docs/rules/${key}`]: getDocData(`docs/rules/${key}.md`),
    };
    return categoryMap;
  },
  {} as Record<string, Record<string, DocData>>
);

const DOCS_DATA: Record<string, DocData> = {
  "/docs/getting-started": getDocData("docs/getting-started.md"),
  "/docs/disabling-with-inline-comments": getDocData(
    "docs/disabling-with-inline-comments.md"
  ),
  "/docs/cli": getDocData("docs/cli.md"),
  ...CATEGORY_RULE_DOC_DATA_MAP["Best Practice"],
  ...CATEGORY_RULE_DOC_DATA_MAP["SEO"],
  ...CATEGORY_RULE_DOC_DATA_MAP["Accessibility"],
  ...CATEGORY_RULE_DOC_DATA_MAP["Style"],
};

export default DOCS_DATA;
