const fs = require("fs");
const path = require("path");

function postBuild() {
  fs.cpSync(
    path.resolve(__dirname, "../lib/types.d.ts"),
    path.resolve(__dirname, "../types/lib/types.d.ts")
  );
}
postBuild();
