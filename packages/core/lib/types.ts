import type { Range, SourceLocation } from "@html-eslint/types";

export interface ElementNodeAdapter<
  ElementNode,
  AttributeKeyNode,
  AttributeValueNode,
> {
  getTagName(): string;
  getAttributes(): AttributeAdapter<AttributeKeyNode, AttributeValueNode>[];
  node: () => ElementNode;
}

export interface AttributeValueAdapter {
  loc: SourceLocation;
  range: Range;
  getValue: () => string | null;
  hasExpression: () => boolean;
}

export interface AttributeAdapter<AttributeKeyNode, AttributeValueNode> {
  key: {
    node: () => AttributeKeyNode;
    isExpression: () => boolean;
    value: () => null | string;
    raw: () => null | string;
  };
  value: {
    node: () => AttributeValueNode | null;
    isExpression: () => boolean;
    value: () => string | null;
  };
}

export interface NoInvalidAttrValueOptions {
  allow?: Array<{
    tag: string;
    attr: string;
    valuePattern?: string;
  }>;
}

export type NoInvalidAttrValueResult<AttributeKeyNode, AttributeValueNode> =
  Array<{
    messageId: "invalid";
    node: AttributeKeyNode | AttributeValueNode;
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

export type UseBaselineResult<
  ElementNode,
  AttributeKeyNode,
  AttributeValueNode,
> = Array<
  | {
      messageId: "noBaselineElement";
      node: ElementNode | AttributeValueNode;
      data: {
        element: string;
        availability: string;
      };
    }
  | {
      messageId: "notBaselineElementAttribute";
      node: ElementNode | AttributeValueNode | AttributeKeyNode;
      data: {
        element: string;
        attr: string;
        availability: string;
      };
    }
  | {
      messageId: "notBaselineGlobalAttribute";
      node: AttributeValueNode | AttributeKeyNode;
      data: {
        attr: string;
        availability: string;
      };
    }
>;

export type NoIneffectiveAttrsResult<AttributeKeyNode> = Array<{
  messageId: "ineffective";
  node: AttributeKeyNode;
  data: {
    message: string;
  };
}>;

export type NoObsoleteTagsResult<ElementNode> = Array<{
  messageId: "unexpected";
  node: ElementNode;
  data: {
    tag: string;
  };
}>;

export type NoObsoleteAttrsResult<AttributeKeyNode> = Array<{
  messageId: "obsolete";
  node: AttributeKeyNode;
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

export type NoDuplicateClassResult<AttributeValueNode> = Array<{
  messageId: "duplicateClass";
  node: AttributeValueNode;
  data: {
    class: string;
  };
  className: string;
  classIndex: number;
  classLength: number;
  tokenIndex: number;
  hasSpacesBefore: boolean;
  hasSpacesAfter: boolean;
  hasClassBefore: boolean;
  hasClassAfter: boolean;
  spacesBeforePos: number;
  spacesAfterLength: number;
}>;
