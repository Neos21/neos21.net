import fs from 'node:fs';
import path from 'node:path';

import { constants } from '../lib/constants.js';
import { isNotFuture } from '../lib/is-not-future.js';
import { listFiles } from '../lib/list-files.js';
import { makeDirectory } from '../lib/make-directory.js';

/*!
 * `src/pages/` 配下のファイルを見てサイトマップを生成する (`src/documents/` は対象外)
 */

const pages = listFiles(constants.pages.src)
  .filter(filePath => ['.html', '.md'].includes(path.extname(filePath)))
  .filter(filePath => {
    // エラーページ、またはファイルパスにアンダースコアを含んでいれば除外する
    if(filePath.includes('403.html') ||
       filePath.includes('404.html') ||
       filePath.includes('500.html') ||
       filePath.includes('_')) {
      return false;
    }
    
    // `created` が未来日のファイルを除外する (コレで未来日のブログも除外される)
    // 作成日が未来日なファイルは公開しておらずサイトマップには載せられないため
    const text = fs.readFileSync(filePath, 'utf-8');
    const matchLine = text.split('\n').find(line => line.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
    const created      = matchLine.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
    const createdYear  = Number(created[2]);
    const createdMonth = Number(created[3]);
    const createdDate  = Number(created[4]);
    return isNotFuture(createdYear, createdMonth, createdDate);
  })
  .map(filePath => {
    const url = filePath
      .replace(new RegExp(`.*${constants.pages.src}`, 'u'), `${constants.protocol}${constants.host}`)
      .replace('.md', '.html');
    return `  <url><loc>${url}</loc></url>`;
  })
  .sort()
  .join('\n');

const template = fs.readFileSync(constants.sitemap.src, 'utf-8');
const sitemap = template.replace('{{ url-list }}', pages);
makeDirectory(constants.sitemap.dist, true);
fs.writeFileSync(constants.sitemap.dist, sitemap, 'utf-8');

console.log('Build Sitemap : Succeeded');
