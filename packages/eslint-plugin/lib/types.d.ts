export type RuleCategory = {
  BEST_PRACTICE: "Best Practice";
  SEO: "SEO";
  ACCESSIBILITY: "Accessibility";
  STYLE: "Style";
};

export type NodeTypes = {
  PROGRAM: "Program";
  TEXT: "text";
  TITLE: "Title";
  PRE: "Pre";
  MENU: "Menu";
  OL: "Ol";
  UL: "Ul";
  SCRIPT: "Script";
  XMP: "Xmp";
  META: "Meta";
  STYLE: "Style";
};

interface BaseNode {
  range: [number, number];
  loc: {
    end: {
      line: number;
      column: number;
    };
    start: {
      line: number;
      column: number;
    };
  };
}

export interface HTMLNode extends BaseNode {
  childNodes?: HTMLNode[];
  startTag: BaseNode | null;
  endTag: BaseNode | null;
  type: string;
  attrs?: AttrNode[];
}

export interface AttrNode extends BaseNode {
  name: string;
  value: string;
}
