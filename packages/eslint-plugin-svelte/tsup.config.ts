import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.js"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  shims: true,
});
