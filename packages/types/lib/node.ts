import { SourceLocation } from "estree";
import { Range } from "./range";

export interface NodeOrTokenData {
  type: string;
  loc: SourceLocation;
  range: Range;
}
