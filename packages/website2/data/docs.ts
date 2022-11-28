import { resolveRoot } from "../utils/docs";
import * as plugin from "@html-eslint/eslint-plugin";
import * as fs from "fs";
import matter from "gray-matter";

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
    doc: getDocData("docs/all-rules.md"),
    children: [
      {
        title: "Best Practice",
        children: CATEGORY_RULE_DOC_DATA_MAP["Best Practice"],
      },
      {
        title: "SEO",
        children: CATEGORY_RULE_DOC_DATA_MAP["SEO"],
      },
      {
        title: "Accessibility",
        children: CATEGORY_RULE_DOC_DATA_MAP["Accessibility"],
      },
      {
        title: "Style",
        children: CATEGORY_RULE_DOC_DATA_MAP["Style"],
      },
    ],
  },
];

export default DOCS;
