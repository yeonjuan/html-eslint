import {Position} from 'estree';
import {Rule} from 'eslint';

export type Context = Rule.RuleContext;

export interface BaseNode {
  range: [number, number];
  start: number;
  end: number;
  loc: {
    start: Position;
    end: Position;
  }
  type?: string;
}

export interface TagNode extends BaseNode {
  type: undefined;
}

export interface TextLineNode extends BaseNode {
  textLine: string;
}

export interface TextNode extends BaseNode {
  type: 'text';
  value: string;
  lineNodes: TextLineNode[];
}

export interface ElementNode extends BaseNode {
  type: string;
  tagName: string;
  attrs: AttrNode[];
  childNodes: ElementNode[];
  startTag?: TagNode;
  endTag?: TagNode; 
}

export interface AttrNode extends BaseNode {
  name: string;
  value: string;
}
