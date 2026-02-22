const fs = require("fs");
const path = require("path");

function generateLLMsTxt() {
  // Read content from llms.txt.md file
  const sourceFile = path.join(__dirname, "llms.txt.md");
  const content = fs.readFileSync(sourceFile, "utf8");

  const outDir = path.join(__dirname, "../out");
  const outputPath = path.join(outDir, "llms.txt");

  // Create out directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {
      recursive: true
    });
  }

  // Write llms.txt file
  fs.writeFileSync(outputPath, content, "utf8");

  console.log(`✓ Generated llms.txt at ${outputPath}`);
}

generateLLMsTxt();
