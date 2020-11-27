export type RuleCategory = {
  BEST_PRACTICE: "Best Practice";
  SEO: "SEO";
  ACCESSIBILITY: "Accessibility";
  STYLE: "Style";
};

export type NodeTypes = {
  TEXT: "text";
  TITLE: "Title";
  PRE: "Pre";
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
