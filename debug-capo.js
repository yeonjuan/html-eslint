const { analyzeHeadWithOrdering } = require('@rviscomi/capo.js');
const { HtmlEslintAdapter } = require('./packages/eslint-plugin/lib/rules/utils/capo-adapter');
const { parseForESLint } = require('@html-eslint/parser');

const code = `<html>
<head>
  <meta charset="UTF-8">
  <title>Test Page</title>
  <link rel="preconnect" href="https://example.com">
  <script src="script.js" async></script>
  <style>@import url('styles.css');</style>
  <script>console.log('sync');</script>
  <style>body { color: red; }</style>
  <link rel="preload" href="font.woff" as="font">
  <script src="deferred.js" defer></script>
  <link rel="prefetch" href="next-page.html">
</head>
</html>`;

const ast = parseForESLint(code).ast;
const htmlNode = ast.body[0].children.find(n => n.name === 'html');
const headNode = htmlNode.children.find(n => n.name === 'head');
const adapter = new HtmlEslintAdapter();

console.log('Filtered children:');
adapter.getChildren(headNode).forEach(c => {
  if (c.type === 'StyleTag') {
    console.log('  - StyleTag:', adapter.stringify(c));
    console.log('    children:', c.children?.length, 'children types:', c.children?.map(ch => ch.type));
    if (c.children && c.children.length > 0) {
      console.log('    first child:', JSON.stringify(c.children[0], null, 2).substring(0, 300));
    }
    console.log('    text content:', adapter.getTextContent(c));
  }
});

try {
  const result = analyzeHeadWithOrdering(headNode, adapter);
  console.log('\nWeights:');
  result.weights.forEach(w => {
    console.log('  -', adapter.stringify(w.element), 'weight:', w.weight, 'category:', w.category);
  });
  console.log('\nViolations:', result.orderingViolations.length);
  result.orderingViolations.forEach(v => {
    console.log('  -', v.nextCategory, 'should come before', v.currentCategory);
  });
} catch (e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}
