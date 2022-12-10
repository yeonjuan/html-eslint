const commonjs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const json = require("@rollup/plugin-json");
const builtins = require("rollup-plugin-node-builtins");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "index.js",
  output: {
    file: "out/output.js",
    format: "umd",
    exports: "named",
    name: "eslint",
  },
  plugins: [
    commonjs({
      ignoreGlobal: true,
      requireReturnsDefault: "preferred",
    }),
    json(),
    builtins(),
    nodeResolve({
      preferBuiltins: false,
    }),
    terser(),
  ],
};
