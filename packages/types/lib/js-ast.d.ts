import * as Parser from "es-html-parser";
import eslint from "eslint";
import * as estree from "estree";

export interface TaggedTemplateExpression
  extends estree.TaggedTemplateExpression {
  parent: estree.Node | null;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
  quasi: TemplateLiteral;
}

export interface TemplateLiteral extends estree.TemplateLiteral {
  parent: estree.Node | null;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
  quasis: TemplateElement[];
}

export interface TemplateElement extends estree.TemplateElement {
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
}

export type AnyJsNode =
  | TaggedTemplateExpression
  | TemplateLiteral
  | TemplateElement;
