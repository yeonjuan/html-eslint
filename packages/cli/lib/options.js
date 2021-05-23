const optionator = require("optionator");

module.exports = optionator({
  prepend: "Usage: html-eslint <url> [options[",
  options: [
    {
      heading: "Basic configuration",
    },
    {
      option: "config",
      alias: "c",
      type: "path::String",
      description: "Specify configuration files.",
    },
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
