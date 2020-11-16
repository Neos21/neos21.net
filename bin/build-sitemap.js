const fs = require('fs');

const constants = require('../lib/constants');
const isNotFuture = require('../lib/is-not-future');
const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');

/*!
 * `./src/` 配下のファイルを見てサイトマップを生成する
 * 
 * TODO : 予約投稿するつもりで未アップロードの新規ページも対象に入ってしまう
 */

const template = fs.readFileSync(constants.sitemap.src, 'utf-8');
const pages = listFiles(constants.pages.src)
  .filter(filePath => filePath.endsWith('.html') || filePath.endsWith('.md'))
  .filter(filePath => !filePath.includes('403.html') && !filePath.includes('404.html') && !filePath.includes('500.html'))
  .filter(filePath => {  // 未来日のブログ記事を除外する
    const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return true;  // マッチしなかったファイルはサイトマップ対象にする
    const blogYear  = Number(match[1]);
    const blogMonth = Number(match[2]);
    const blogDate  = Number(match[3]);
    return isNotFuture(blogYear, blogMonth, blogDate);
  })
  .map(filePath => filePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), `${constants.protocol}${constants.host}`).replace('.md', '.html'))
  .map(filePath => `  <url><loc>${filePath}</loc></url>`)
  .sort()
  .join('\n');
const sitemap = template.replace('{{ url-list }}', pages);
makeDirectory(constants.sitemap.dist, true);
fs.writeFileSync(constants.sitemap.dist, sitemap, 'utf-8');

console.log('Build Sitemap : Succeeded');
