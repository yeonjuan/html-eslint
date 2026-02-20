export interface ElementNodeAdapter<
  ElementNode,
  AttributeKeyNode,
  AttributeValueNode,
> {
  getTagName(): string;
  getAttributes(): AttributeAdapter<AttributeKeyNode, AttributeValueNode>[];
  node: () => ElementNode;
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

export type ClassSpacingResult<AttributeValueNode> = Array<
  | {
      messageId: "extraSpacingStart";
      node: AttributeValueNode;
      data: {
        normalized: string;
      };
      spacingType: "start";
      spacingLength: number;
    }
  | {
      messageId: "extraSpacingEnd";
      node: AttributeValueNode;
      data: {
        normalized: string;
      };
      spacingType: "end";
      spacingLength: number;
    }
  | {
      messageId: "extraSpacingBetween";
      node: AttributeValueNode;
      data: {
        normalized: string;
      };
      spacingType: "between";
      spacingIndex: number;
      spacingLength: number;
    }
>;
