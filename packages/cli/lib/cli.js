const options = require('./options');
const packageJSON = require('../package.json');

(function cli(argv) {
  const parsed = options.parseArgv(argv);

  if (parsed.version) {
    console.log(packageJSON.version);
    return;
  }
  if (parsed.help) {
    console.log(options.generateHelp());
    return;
  }

})(process.argv);
