export interface ElementNodeAdapter<AttributeKeyNode, AttributeValueNode> {
  getTagName(): string;
  getAttributes(): AttributeAdapter<AttributeKeyNode, AttributeValueNode>[];
}

export interface AttributeAdapter<AttributeKeyNode, AttributeValueNode> {
  key(): {
    node: AttributeKeyNode;
    isExpression: () => boolean;
    value: null | string;
  };
  value(): {
    node: AttributeValueNode | null;
    isExpression: () => boolean;
    value: string | null;
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
    keyNode: AttributeKeyNode;
    valueNode: AttributeValueNode | null;
    elementName: string;
    reason: string;
  }>;
