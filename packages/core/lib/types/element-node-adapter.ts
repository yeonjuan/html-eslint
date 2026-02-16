export interface ElementNodeAdapter<AttributeNode> {
  getTagName(): string;
  getAttribute(name: string): ElementAttributeAdapter<AttributeNode> | null;
  getAttributes(): ElementAttributeAdapter<AttributeNode>[];
  hasAttribute(name: string): boolean;
}

export interface ElementAttributeAdapter<AttributeNode> {
  node: AttributeNode;
  getKey(): string;
  getValue(): string;
}
