import type { Linter } from "eslint";

function toMarkerPos(pos: number) {
  return pos - 1;
}
export default function toMarker(message: Linter.LintMessage) {
  const from = {
    line: toMarkerPos(message.line),
    ch: toMarkerPos(message.column),
  };
  const to = {
    line: toMarkerPos(message.endLine || message.line),
    ch: toMarkerPos(message.endColumn || message.column),
  };
  return [from, to];
}
