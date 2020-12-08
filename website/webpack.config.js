const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  entry: {
    playground: path.resolve(__dirname, "playground/index.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "static/js/playground"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: [
          /\/eslint\/.*\/rule-tester/,
          /\/eslint\/.*\/cli-engine/,
          /\/resolve-from\/*/,
          /\/\@eslint\/.*\/config-array-factory/,
          /\/\@eslint\/.*\/relative-module-resolver/,
          /\/eslint\/eslint\.js/,
        ],
        use: "null-loader",
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /esquery/,
      path.resolve(__dirname, "node_modules/esquery/dist/esquery.js")
    ),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          comments: false,
        },
        extractComments: false,
      }),
    ],
  },
  devServer: {
    open: true,
    hot: true,
  },
};
