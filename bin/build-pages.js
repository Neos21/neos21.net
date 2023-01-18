import { buildHtml } from '../lib/build-html.js';
import { buildMarkdown } from '../lib/build-markdown.js';
import { constants } from '../lib/constants.js';
import { listFiles } from '../lib/list-files.js';

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
