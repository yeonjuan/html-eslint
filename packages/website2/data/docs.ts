import { resolveRoot } from "../utils/docs";
import * as plugin from "@html-eslint/eslint-plugin";
import * as fs from "fs";
import matter from "gray-matter";
import { RULE_CATEGORY } from "../constants";

export type DocData = {
  title: string;
  markdown: string;
  path: string;
};

export type DocTree = {
  doc?: DocData;
  title?: string;
  children?: DocTree[];
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
    categoryMap[rule.meta.docs.category] = [
      ...(categoryMap[rule.meta.docs.category] || []),
      {
        doc: getDocData(`docs/rules/${key}.md`),
      },
    ];
    return categoryMap;
  },
  {} as Record<string, DocTree[]>
);

Object.entries(CATEGORY_RULE_DOC_DATA_MAP).forEach(([key, v]) => {
  CATEGORY_RULE_DOC_DATA_MAP[key] = v.sort((a, b) =>
    a.doc!.title.localeCompare(b.doc!.title)
  );
});

const DOCS: DocTree[] = [
  {
    doc: getDocData("docs/getting-started.md"),
    children: [
      {
        doc: getDocData("docs/disabling-with-inline-comments.md"),
      },
      {
        doc: getDocData("docs/cli.md"),
      },
    ],
  },
  {
    doc: getDocData("docs/rules.md"),
    children: [
      {
        title: RULE_CATEGORY.BEST_PRACTICE,
        children: CATEGORY_RULE_DOC_DATA_MAP[RULE_CATEGORY.BEST_PRACTICE],
      },
      {
        title: RULE_CATEGORY.SEO,
        children: CATEGORY_RULE_DOC_DATA_MAP[RULE_CATEGORY.SEO],
      },
      {
        title: RULE_CATEGORY.ACCESSIBILITY,
        children: CATEGORY_RULE_DOC_DATA_MAP[RULE_CATEGORY.ACCESSIBILITY],
      },
      {
        title: RULE_CATEGORY.STYLE,
        children: CATEGORY_RULE_DOC_DATA_MAP[RULE_CATEGORY.STYLE],
      },
    ],
  },
];

export default DOCS;
