const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');

/*!
 * HTML・Markdown をビルドする
 * 
 * - 最終更新日やブログのファイルパスが未来日のモノも除外せずビルドする
 */

const sourceFilePaths = listFiles(constants.pages.src);

// HTML
sourceFilePaths
  .filter(sourceFilePath => sourceFilePath.endsWith('.html'))
  .forEach(sourceFilePath => buildHtml(sourceFilePath));

// Markdown
sourceFilePaths
  .filter(sourceFilePath => sourceFilePath.endsWith('.md'))
  .forEach(sourceFilePath => buildMarkdown(sourceFilePath));

console.log('Build Pages : Succeeded');
