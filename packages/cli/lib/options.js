const optionator = require("optionator");

module.exports = optionator({
  prepend: "html-eslint url",
  options: [
    {
      heading: "Miscellaneous",
    },
    {
      option: "version",
      alias: "v",
      type: "Boolean",
      description: "Print the version number",
    },
    {
      option: "help",
      alias: "h",
      type: "Boolean",
      description: "Show help",
    },
  ],
});
