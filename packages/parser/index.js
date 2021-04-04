const fs = require('fs');
const Parser = require("./lib/parser");


const file = fs.readFileSync('./test.html').toString('utf-8');

const parser = new Parser({sourceCodeLocationInfo: true});

console.log(
  parser.parse(file).childNodes[0].sourceCodeLocation.attrs
 );

