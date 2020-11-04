const path = require('path');

const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const copyFile = require('../lib/copy-file');

/*!
 * HTML・Markdown をビルドし、それ以外のファイルをコピーする
 * 
 * CSS は clean-css-cli の `@import` 解釈に問題があるのでこのスクリプト内からは実行せず `$npm run` にて別途実行する
 */

(async () => {
  const sourceFilePaths = listFiles(constants.pages.src);
  
  const html = sourceFilePaths
    .filter(filePath => filePath.endsWith('.html'))
    .map(filePath => new Promise(resolve => { buildHtml(filePath); resolve(); }));
  const markdown = sourceFilePaths
    .filter(filePath => filePath.endsWith('.md'))
    .map(filePath => new Promise(resolve => { buildMarkdown(filePath); resolve(); }));
  const assets = sourceFilePaths
    .filter(filePath => !['.html', '.md'].includes(path.extname(filePath)))
    .map(filePath => new Promise(resolve => { copyFile(filePath); resolve(); }));
  
  await Promise.all([
    ...html,
    ...markdown,
    ...assets
  ]);
  console.log('Build All : Succeeded');
})();
