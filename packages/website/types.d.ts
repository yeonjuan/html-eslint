declare module "@html-eslint/eslint-plugin" {
  const decl: any;
  export = decl;
}

declare module "@html-eslint/web-linter" {
  import { Linter } from "eslint";
  export { Linter };
}
