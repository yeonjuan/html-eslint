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
const writeFile = promisify(fs.writeFile);
tmp.setGracefulCleanup();
/**
 * @param {string} name
 * @returns {string}
 */
function packageFileVersion(name) {
  return `file:${path.join(__dirname, "../../", name)}`;
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string} params.dir
 */
async function makePackageJson({ fixtureName, eslintVersion, dir }) {
  const packageJson = {
    name: fixtureName,
    private: true,
    version: "0.0.2",
    packageManager: "yarn@4.0.2",
    devDependencies: {
      eslint: eslintVersion,
      "@html-eslint/eslint-plugin": packageFileVersion("eslint-plugin"),
      "@html-eslint/parser": packageFileVersion("parser"),
    },
    resolutions: {
      "@html-eslint/template-parser": packageFileVersion("template-parser"),
      "@html-eslint/template-syntax-parser": packageFileVersion(
        "template-syntax-parser"
      ),
    },
  };
  await writeFile(
    path.join(dir, "package.json"),
    JSON.stringify(packageJson),
    "utf-8"
  );
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @returns {Promise<{dir: string}>}
 */
async function setup({ fixtureName, eslintVersion }) {
  const dir = await tmpDir();
  const fixturePath = path.join(__dirname, "../fixtures/", fixtureName);

  await copyDir(fixturePath, dir);
  await makePackageJson({ fixtureName, eslintVersion, dir });
  return { dir };
}

/**
 * @param {Object} params
 * @param {string} params.glob
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 */
async function runESLint({ fixtureName, eslintVersion, glob }) {
  const { dir } = await setup({ fixtureName, eslintVersion });

  await execFile("yarn", ["install", "--no-immutable"], {
    cwd: dir,
  }).catch((e) => {
    console.error(e);
  });
  const outFile = await tmpFile();
  await execFile(
    "yarn",
    ["eslint", "--format", "json", "--output-file", outFile, glob],
    {
      cwd: dir,
    }
  ).catch(() => {});

  const result = await readFile(outFile, "utf-8");

  const parsed = JSON.parse(result);
  return parsed;
}

module.exports = {
  runESLint,
};
