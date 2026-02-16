import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.js"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
