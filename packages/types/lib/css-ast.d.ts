import CSSTree, { CssLocation } from "css-tree";

type ToESTree<Node extends CSSTree.CssNodeCommon> = Node & {
  range: [number, number];
  loc: CssLocation;
};

export type StyleSheet = ToESTree<CSSTree.StyleSheet>;
export type SelectorList = ToESTree<CSSTree.SelectorList>;
