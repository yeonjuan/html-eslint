#!/usr/bin/env node
const options = require("./options");
const packageJSON = require("../package.json");
const log = require("./log");
const request = require("./request");
const lint = require("./lint");
const print = require("./print");
const nodeFs = require("fs");
const nodePath = require("path");

function requireRCConfig(path = ".htmleslintrc.js") {
  let resolved = path;
  if (!nodePath.isAbsolute(resolved)) {
    resolved = nodePath.join(process.cwd(), resolved);
  }

  if (!nodeFs.existsSync(path)) {
    throw new Error("Cannot find config file.");
  }
  return require(resolved);
}

(function cli(argv) {
  const parsed = options.parseArgv(argv);

  if (parsed.version) {
    log(packageJSON.version);
    return;
  }
  if (parsed.help) {
    log(options.generateHelp());
    return;
  }

  const [url] = parsed._;
  const config = requireRCConfig(parsed.config);
  request(url).then((res) => {
    const results = lint(res.data, config, parsed.checkStyle);
    print(url, results);
    if (results.some((result) => result.fatal || result.severity === 2)) {
      process.exit(1);
    }
    process.exit(0);
  });
})(process.argv);
