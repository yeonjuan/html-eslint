import eslint from "eslint";
import * as estree from "estree";

interface EstreeNode extends estree.BaseNode {
  type: string;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
}

export interface TaggedTemplateExpression
  extends estree.TaggedTemplateExpression {
  parent: EstreeNode | null;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
  quasi: TemplateLiteral;
}

export interface TemplateLiteral extends estree.TemplateLiteral {
  parent: EstreeNode | null;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
  quasis: TemplateElement[];
}

export interface TemplateElement extends estree.TemplateElement {
  parent: EstreeNode | null;
  loc: eslint.AST.SourceLocation;
  range: eslint.AST.Range;
}

export type AnyJsNode =
  | TaggedTemplateExpression
  | TemplateLiteral
  | TemplateElement;
