const fs = require("fs");

/**
 * Generate robots.txt file
 * @param {string} dest - Destination path for robots.txt
 * @param {string} sitemapUrl - Full URL to sitemap.xml
 */
function generateRobots(dest, sitemapUrl) {
  const robots = `# html-eslint.org robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}
`;

  fs.writeFileSync(
    dest,
    robots,
    "utf-8"
  );
}

module.exports = generateRobots;
