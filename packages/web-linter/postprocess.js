const { readFileSync, writeFileSync } = require("fs");
const outputJs = readFileSync("./out/output.js", "utf-8");

writeFileSync(
  "./out/output.js",
  outputJs.replace(
    "process.env.DEBUG=e:delete process.env.DEBUG",
    "void 0: void 0"
  )
);
