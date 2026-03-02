import type { Range, SourceLocation } from "@html-eslint/types";

export interface ElementAdapter {
  getElementName(): string;
  getAttributes(): AttributeAdapter[];
  getOpenStartLocation: () => SourceLocation;
  getOpenStartRange: () => Range;
}

export interface AttributeAdapter {
  getKey: () => AttributeKeyAdapter | null;
  getValue: () => AttributeValueAdapter | null;
}

export interface AttributeValueAdapter {
  getValue: () => string | null;
  hasExpression: () => boolean;
  getLocation: () => SourceLocation;
  getRange: () => Range;
}

export interface AttributeKeyAdapter {
  getValue: () => string;
  hasExpression: () => boolean;
  getLocation: () => SourceLocation;
  getRange: () => Range;
}

export interface NoInvalidAttrValueOptions {
  allow?: Array<{
    tag: string;
    attr: string;
    valuePattern?: string;
  }>;
}

export type NoInvalidAttrValueResult = Array<{
  messageId: "invalid";
  loc: SourceLocation;
  data: {
    value: string;
    attr: string;
    element: string;
    suggestion: string;
  };
}>;

export interface UseBaselineOptions {
  available: "widely" | "newly" | number;
}

export type UseBaselineResult = Array<
  | {
      messageId: "noBaselineElement";
      loc: SourceLocation;
      data: {
        element: string;
        availability: string;
      };
    }
  | {
      messageId: "notBaselineElementAttribute";
      loc: SourceLocation;
      data: {
        element: string;
        attr: string;
        availability: string;
      };
    }
  | {
      messageId: "notBaselineGlobalAttribute";
      loc: SourceLocation;
      data: {
        attr: string;
        availability: string;
      };
    }
>;

export type NoIneffectiveAttrsResult = Array<{
  messageId: "ineffective";
  loc: SourceLocation;
  data: {
    message: string;
  };
}>;

export type NoObsoleteTagsResult = Array<{
  messageId: "unexpected";
  loc: SourceLocation;
  data: {
    tag: string;
  };
}>;

export type NoObsoleteAttrsResult = Array<{
  messageId: "obsolete";
  loc: SourceLocation;
  data: {
    attr: string;
    element: string;
    suggestion: string;
  };
}>;

export type ClassSpacingResult = Array<{
  messageId: "extraSpacing";
  range: Range;
  loc: SourceLocation;
}>;

export type NoDuplicateClassResult = Array<{
  messageId: "duplicateClass";
  range: Range;
  loc: SourceLocation;
  data: {
    className: string;
  };
}>;
