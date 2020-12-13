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

type Loc = {
  end: {
    line: number;
    column: number;
  };
  start: {
    line: number;
    column: number;
  };
};

export interface HTMLNode {
  childNodes?: HTMLNode[];
  range: [number, number];
  startTag: Loc | null;
  endTag: Loc | null;
  start: number;
  end: number;
  loc: Loc;
  type: string;
}
