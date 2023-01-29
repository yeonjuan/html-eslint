import { visitorKeys } from "./visitor-keys";
import { AnyHTMLNode } from "./types";

export function traverse(
  node: AnyHTMLNode,
  visitor: (nodeArg: AnyHTMLNode) => void
) {
  if (!node) {
    return;
  }
  visitor(node);
  const type = node.type;
  const keys: string[] = visitorKeys[type];

  if (!keys || keys.length <= 0) {
    return;
  }

  keys.forEach((key) => {
    // @ts-ignore
    const value = node[key];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((n: any) => traverse(n, visitor));
      } else {
        traverse(value, visitor);
      }
    }
  });
}
