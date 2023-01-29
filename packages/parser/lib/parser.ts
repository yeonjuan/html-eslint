import { parse } from "es-html-parser";
import { visitorKeys } from "./visitor-keys";
import { traverse } from "./traverse";
import { ProgramNode } from "./types";

export function parseForESLint(code: string) {
  const { ast, tokens } = parse(code);

  const programNode: ProgramNode = {
    type: "Program",
    body: ast.children,
    loc: ast.loc,
    range: ast.range,
    tokens: tokens.filter(
      (token) =>
        token.type !== "CommentContent" &&
        token.type !== "CommentOpen" &&
        token.type !== "CommentClose"
    ),
    comments: [],
  };

  traverse(programNode, (node) => {
    if (node.type === "CommentContent") {
      programNode.comments.push({
        type: node.type,
        range: node.range,
        loc: node.loc,
        value: node.value,
      });
    }
  });

  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
  };
}
