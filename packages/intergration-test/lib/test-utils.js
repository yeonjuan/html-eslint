const tmp = require("tmp");
const ncp = require("ncp");
const fs = require("fs");
const { promisify } = require("node:util");
const path = require("path");
const childProcess = require("node:child_process");

const copyDir = promisify(ncp.ncp);
const tmpDir = promisify(tmp.dir);
const tmpFile = promisify(tmp.file);

const execFile = promisify(childProcess.execFile);
const readFile = promisify(fs.readFile);

/**
 * @param {Object} config
 * @param {string} config.fixtureName
 * @param {string} config.glob
 */
async function runESLint(config) {
  const testDir = await tmpDir();
  await copyDir(
    path.join(__dirname, "../fixtures/", config.fixtureName),
    testDir
  );
  await execFile("yarn", ["install", "--no-immutable"], {
    cwd: testDir,
  });
  const outFile = await tmpFile();
  await execFile(
    "yarn",
    ["eslint", "--format", "json", "--output-file", outFile, config.glob],
    {
      cwd: testDir,
    }
  ).catch(() => null);

  const result = await readFile(outFile, "utf-8");
  return JSON.parse(result);
}

module.exports = {
  runESLint,
};
