import path from 'node:path';

import { buildHtml } from '../lib/build-html.js';
import { buildMarkdown } from '../lib/build-markdown.js';
import { constants } from '../lib/constants.js';
import { copyFile } from '../lib/copy-file.js';
import { listFiles } from '../lib/list-files.js';

/*!
 * HTML・Markdown をビルドし、それ以外のファイルをコピーする
 * 
 * - CSS は clean-css-cli の `@import` 解釈に問題があるのでこのスクリプト内からは実行せず `$npm run` にて別途実行する
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

// Other Assets
sourceFilePaths
  .filter(sourceFilePath => !['.html', '.md'].includes(path.extname(sourceFilePath)))
  .forEach(sourceFilePath => {
    const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
    copyFile(sourceFilePath, distFilePath);
  });

// Documents
listFiles(constants.documents.src).forEach(sourceFilePath => {
  const distFilePath = sourceFilePath.replace(constants.documents.src, constants.documents.dist);
  copyFile(sourceFilePath, distFilePath);
});

console.log('Build All : Succeeded');
