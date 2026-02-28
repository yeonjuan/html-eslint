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

const PACKAGE_VERSION = "0.0.2";
const PACKAGE_MANAGER = "yarn@4.9.1";
const PNPM_PACKAGE_MANAGER = "pnpm@9.15.4";
const HTML_ESLINT_PACKAGES = [
  "template-parser",
  "template-syntax-parser",
  "core",
  "parser",
];

/**
 * @param {string} name
 * @returns {string}
 */
function packageFileVersion(name) {
  return `file:${path.join(__dirname, "../../", name)}`;
}

/**
 * Install dependencies in a directory
 *
 * @param {string} dir
 * @param {boolean} log
 * @param {"yarn" | "pnpm"} [packageManager="yarn"] Default is `"yarn"`
 */
async function installDependencies(dir, log, packageManager = "yarn") {
  const installArgs =
    packageManager === "pnpm" ? ["install"] : ["install", "--no-immutable"];
  await execFile(packageManager, installArgs, { cwd: dir }).catch((e) => {
    if (log) {
      console.error(e);
    }
  });
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string} params.dir
 * @param {string[]} params.localPackages
 * @param {[string, string][]} [params.externalPackages=[]] Array of
 *   [packageName, version] tuples. Default is `[]`
 * @param {Record<string, string>} [params.scripts] <<<<<<< HEAD
 * @param {Record<string, string>} [params.extraDependencies] #
 *   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!?
 * @param {"yarn" | "pnpm"} [params.packageManager="yarn"] >>>>>>> main. Default
 *   is `"yarn"`
 */
async function makePackageJson({
  fixtureName,
  eslintVersion,
  dir,
  externalPackages = [],
  scripts,
  localPackages,
  packageManager = "yarn",
}) {
  const devDependencies = Object.fromEntries(
    localPackages.map((pkg) => [
      pkg,
      packageFileVersion(pkg.replace("@html-eslint/", "")),
    ])
  );

  const externalDeps = Object.fromEntries(externalPackages);

  const resolutions = Object.fromEntries(
    HTML_ESLINT_PACKAGES.map((pkg) => [
      `@html-eslint/${pkg}`,
      packageFileVersion(pkg),
    ])
  );

  const packageJson = {
    name: fixtureName,
    private: true,
    version: PACKAGE_VERSION,
    packageManager:
      packageManager === "pnpm" ? PNPM_PACKAGE_MANAGER : PACKAGE_MANAGER,
    scripts,
    devDependencies: {
      eslint: eslintVersion,
      ...externalDeps,
      ...devDependencies,
    },
  };

  // Use pnpm.overrides for pnpm, resolutions for yarn
  if (packageManager === "pnpm") {
    packageJson.pnpm = {
      overrides: resolutions,
    };
  } else {
    packageJson.resolutions = resolutions;
  }

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
 * @param {Record<string, string>} [params.scripts]
 * @param {string[]} params.localPackages
 * @param {[string, string][]} [params.externalPackages=[]] Array of
 *   [packageName, version] tuples. Default is `[]`
 * @param {boolean} [params.log]
 * @param {"yarn" | "pnpm"} [params.packageManager="yarn"] Default is `"yarn"`
 * @returns {Promise<{ dir: string }>}
 */
async function setup({
  fixtureName,
  eslintVersion,
  scripts,
  localPackages,
  externalPackages = [],
  log,
  packageManager = "yarn",
}) {
  const dir = await tmpDir();
  const fixturePath = path.join(__dirname, "../fixtures/", fixtureName);

  await copyDir(fixturePath, dir);
  await makePackageJson({
    fixtureName,
    eslintVersion,
    dir,
    scripts,
    localPackages,
    externalPackages,
    log,
    packageManager,
  });
  return { dir };
}

/**
 * @param {Object} params
 * @param {string} params.glob
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string[]} params.localPackages
 * @param {[string, string][]} [params.externalPackages=[]] Array of
 *   [packageName, version] tuples. Default is `[]`
 * @param {boolean} [params.log]
 * @param {"yarn" | "pnpm"} [params.packageManager="yarn"] Default is `"yarn"`
 */
async function runESLint({
  fixtureName,
  eslintVersion,
  glob,
  localPackages,
  externalPackages = [],
  log,
  packageManager = "yarn",
}) {
  const { dir } = await setup({
    fixtureName,
    eslintVersion,
    localPackages,
    externalPackages,
    packageManager,
  });

  await installDependencies(dir, log, packageManager);

  const outFile = await tmpFile();
  const eslintArgs = [
    "eslint",
    "--format",
    "json",
    "--output-file",
    outFile,
    glob,
  ];

  if (packageManager === "pnpm") {
    await execFile("pnpm", ["exec", ...eslintArgs], { cwd: dir }).catch((e) => {
      if (log) {
        console.error(e);
      }
    });
  } else {
    await execFile("yarn", eslintArgs, { cwd: dir }).catch((e) => {
      if (log) {
        console.error(e);
      }
    });
  }

  const result = await readFile(outFile, "utf-8");
  return JSON.parse(result);
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string[]} params.localPackages
 * @param {[string, string][]} [params.externalPackages=[]] Array of
 *   [packageName, version] tuples. Default is `[]`
 * @param {boolean} [params.log]
 * @param {"yarn" | "pnpm"} [params.packageManager="yarn"] Default is `"yarn"`
 */
async function runTypecheck({
  fixtureName,
  eslintVersion,
  localPackages,
  externalPackages = [],
  log,
  packageManager = "yarn",
}) {
  const { dir } = await setup({
    fixtureName,
    eslintVersion,
    scripts: {
      ts: "tsc -p ./tsconfig.json",
    },
    localPackages,
    externalPackages,
    log,
    packageManager,
  });

  await installDependencies(dir, log, packageManager);

  if (packageManager === "pnpm") {
    return await execFile("pnpm", ["run", "ts"], { cwd: dir })
      .then(() => undefined)
      .catch((error) => {
        if (log) {
          console.error(error);
        }
        return error;
      });
  } else {
    return await execFile("yarn", ["run", "ts"], { cwd: dir })
      .then(() => undefined)
      .catch((error) => {
        if (log) {
          console.error(error);
        }
        return error;
      });
  }
}

module.exports = {
  runESLint,
  runTypecheck,
};
