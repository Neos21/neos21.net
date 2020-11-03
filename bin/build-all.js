const path = require('path');

const listFiles = require('../lib/list-files');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const copyFile = require('../lib/copy-file');

/*!
 * HTML・Markdown をビルドし、それ以外のファイルをコピーする
 * 
 * CSS は clean-css-cli の `@import` 解釈に問題があるので `npm run` にて別途実行する
 */

const files = listFiles('src/pages');

files.filter(filePath => filePath.endsWith('.html')).forEach((htmlFilePath) => {
  buildHtml(htmlFilePath);
})
files.filter(filePath => filePath.endsWith('.md')).forEach((mdFilePath) => {
  buildMarkdown(mdFilePath);
});
files.filter(filePath => !['.html', '.md'].includes(path.extname(filePath))).forEach((assetFilePath) => {
  copyFile(assetFilePath);
});
console.log('Build All : Succeeded');
