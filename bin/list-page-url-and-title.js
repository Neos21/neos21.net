import fs from 'node:fs';

import { constants } from '../lib/constants.js';
import { listFiles } from '../lib/list-files.js'
import { extractFrontMatter } from '../lib/extract-front-matter.js';

/*!
 * URL とページタイトル一覧を作る
 */

console.log('List Page URL And Title : Start');

const lines = ['URL\tTitle'];

listFiles(constants.pages.src)
  .filter(sourceFilePath => sourceFilePath.endsWith('.html') || sourceFilePath.endsWith('.md'))
  .forEach(sourceFilePath => {
    const url = sourceFilePath.replace('src/pages', 'https://neos21.net').replace('.md', '.html');
    const file = fs.readFileSync(sourceFilePath, 'utf-8');
    const frontMatter = extractFrontMatter(file);
    lines.push(`${url}\t${frontMatter.title.replaceAll('&amp;', '&')}`);
  });

fs.writeFileSync('url-title.txt', lines.join('\n'), 'utf-8');
console.log('List Page URL And Title : Succeeded');
