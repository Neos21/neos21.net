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
  .filter(sourceFilePath => sourceFilePath.endsWith('.html'))
  .forEach(sourceFilePath => buildHtml(sourceFilePath));
sourceFilePaths
  .filter(sourceFilePath => sourceFilePath.endsWith('.md'))
  .forEach(sourceFilePath => buildMarkdown(sourceFilePath));
sourceFilePaths
  .filter(sourceFilePath => !['.html', '.md'].includes(path.extname(sourceFilePath)))
  .forEach(sourceFilePath => {
    const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
    copyFile(sourceFilePath, distFilePath);
  });

listFiles(constants.documents.src).forEach(sourceFilePath => {
  const distFilePath = sourceFilePath.replace(constants.documents.src, constants.documents.dist);
  copyFile(sourceFilePath, distFilePath);
});

console.log('Build All : Succeeded');
