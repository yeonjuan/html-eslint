export interface ElementNodeAdapter<AttributeKeyNode, AttributeValueNode> {
  getTagName(): string;
  getAttributes(): ElementAttributeAdapter<
    AttributeKeyNode,
    AttributeValueNode
  >[];
}

export interface ElementAttributeAdapter<AttributeKeyNode, AttributeValueNode> {
  key:
    | {
        node: AttributeKeyNode;
        isExpression: true;
        value: null;
      }
    | {
        node: AttributeKeyNode;
        isExpression: false;
        value: string;
      };
  value:
    | {
        node: null;
        isExpression: true;
        value: null;
      }
    | {
        node: AttributeValueNode | null;
        isExpression: false;
        value: string;
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
