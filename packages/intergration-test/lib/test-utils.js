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
tmp.setGracefulCleanup();
/**
 * @param {Object} config
 * @param {string} config.fixtureName
 * @param {string} config.glob
 * @param {Record<string, string} config.devDependencies
 */
async function runESLint(config) {
  const testDir = await tmpDir();
  await copyDir(
    path.join(__dirname, "../fixtures/", config.fixtureName),
    testDir
  );
  const packageJsonPath = path.join(testDir, "package.json");
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: "utf-8" })
  );
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...config.devDependencies,
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

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
  ).catch((e) => console.error(e));

  const result = await readFile(outFile, "utf-8");
  return JSON.parse(result);
}

/**
 * @param {string} dir
 * @returns {{packageJson: {name: string; dependencies?: Record<string, string>}; packageDir: string; packageJsonPath: stringl}[]}
 */
function getPackages(dir) {
  const packageDirs = fs.readdirSync(dir);
  return packageDirs
    .map((packageDirname) => {
      const packageDir = path.join(dir, packageDirname);
      const packageJsonPath = path.join(packageDir, "package.json");
      if (!fs.existsSync(packageJsonPath)) {
        return null;
      }
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, { encoding: "utf-8" })
      );
      if (packageJson.private === true) {
        return null;
      }
      return {
        packageJson,
        packageJsonPath,
        packageDir,
      };
    })
    .filter(Boolean);
}

/**
 * @returns {Record<string, string>}
 */
async function packPackages() {
  const tarFolder = tmp.dirSync({
    keep: true,
  }).name;

  const PACKAGES_DIR = path.resolve(__dirname, "../../");
  const packages = getPackages(PACKAGES_DIR);

  for (const { packageDir, packageJsonPath, packageJson } of packages) {
    const dependenciesInPackage = packageJson.dependencies;
    if (dependenciesInPackage) {
      const dependencyPackageNames = Object.keys(dependenciesInPackage);
      const workspacePackageNames = dependencyPackageNames.filter(
        (packageName) =>
          packages.find((pkg) => pkg.packageJson.name === packageName)
      );
      const newDependencies = {
        ...packageJson.dependencies,
      };
      workspacePackageNames.forEach((packageName) => {
        newDependencies[packageName] = `file:${packageDir}`;
      });
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify({ ...packageJson, dependencies: newDependencies }),
        "utf-8"
      );
    }
  }

  const dependencies = {};

  for (const { packageDir, packageJson } of packages) {
    const result = childProcess.spawnSync("npm", ["pack", packageDir], {
      cwd: tarFolder,
      encoding: "utf-8",
    });
    const stdoutLines = result.stdout.trim().split("\n");
    const tarball = stdoutLines[stdoutLines.length - 1];
    dependencies[packageJson.name] = `file:${path.join(tarFolder, tarball)}`;
  }

  return dependencies;
}

module.exports = {
  runESLint,
  packPackages,
};
