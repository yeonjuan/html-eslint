import { SyntaxConfig } from "@html-eslint/template-syntax-parser";

export type ParserOptions = {
  templateEngineSyntax?: SyntaxConfig;
  frontmatter?: boolean;
  rawContentTags?: string[];
};
