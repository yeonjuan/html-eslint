import CSSTree, { CssLocation, List } from "css-tree";

type ToESTree<Node extends CSSTree.CssNodeCommon> = Node & {
  range: [number, number];
  loc: CssLocation;
};

export type AnyCssNode = StyleSheet | SelectorList | Selector;

export type StyleSheet = ToESTree<CSSTree.StyleSheetPlain> & {
  children: List<AnyCssNode>;
};

export type SelectorList = ToESTree<CSSTree.SelectorListPlain> & {
  children: List<AnyCssNode>;
};

export type Selector = ToESTree<CSSTree.SelectorPlain> & {
  children: List<AnyCssNode>;
};
