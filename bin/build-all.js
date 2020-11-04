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

const sourceFilePaths = listFiles(constants.pages.src);

sourceFilePaths
  .filter(filePath => filePath.endsWith('.html'))
  .forEach(filePath => buildHtml(filePath));
sourceFilePaths
  .filter(filePath => filePath.endsWith('.md'))
  .forEach(filePath => buildMarkdown(filePath));
sourceFilePaths
  .filter(filePath => !['.html', '.md'].includes(path.extname(filePath)))
  .forEach(filePath => copyFile(filePath));

console.log('Build All : Succeeded');
