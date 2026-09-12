import type { Range, SourceLocation } from "@html-eslint/types";

export interface ElementAdapter {
  getElementName(): string;
  getAttributes(): AttributeAdapter[];
  getLocation(): SourceLocation;
  getRange(): Range;
  getOpenStartLocation(): SourceLocation;
  getOpenStartRange(): Range;
}

export interface AttributeAdapter {
  getKey(): AttributeKeyAdapter | null;
  getValue(): AttributeValueAdapter | null;
  getLocation(): SourceLocation;
  /**
   * Whether the attribute spreads an unknown set of attributes (e.g. JSX
   * `{...props}`, Svelte `{...props}`).
   */
  isSpread(): boolean;
}

export interface AttributeValueAdapter {
  getValue(): string | null;
  hasExpression(): boolean;
  getLocation(): SourceLocation;
  getRange(): Range;
}

export interface AttributeKeyAdapter {
  getValue(): string;
  hasExpression(): boolean;
  getLocation(): SourceLocation;
  getRange(): Range;
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

export interface NoRestrictedAttrsOptions extends Array<{
  tagPatterns: string[];
  attrPatterns: string[];
  message?: string;
}> {}

export type NoRestrictedAttrsResult = Array<
  | {
      messageId: "restricted";
      loc: SourceLocation;
      data: { attr: string };
    }
  | {
      message: string;
      loc: SourceLocation;
      data: { attr: string };
    }
>;

export interface NoRestrictedAttrValuesOptions extends Array<{
  attrPatterns: string[];
  attrValuePatterns: string[];
  message?: string;
}> {}

export type NoRestrictedAttrValuesResult = Array<
  | {
      messageId: "restricted";
      loc: SourceLocation;
      data: { attrValuePatterns: string };
    }
  | {
      message: string;
      loc: SourceLocation;
      data: { attrValuePatterns: string };
    }
>;

export interface RequireAttrsCondition {
  attr: string;
  value?: string;
  kind: "present" | "absent" | "equal" | "not-equal";
}

export interface RequireAttrsOption {
  tag: string;
  attr: string;
  value?: string;
  message?: string;
  conditions?: RequireAttrsCondition[];
}

export type RequireAttrsOptions = RequireAttrsOption[];

export type RequireAttrsFix = { range: [number, number]; text: string };

export type RequireAttrsResult = Array<
  (
    | { messageId: "missing"; data: { attr: string; tag: string } }
    | { messageId: "unexpected"; data: { attr: string; expected: string } }
    | { message: string; data: { attr: string; tag?: string } }
  ) & { loc: SourceLocation; fix?: RequireAttrsFix }
>;
