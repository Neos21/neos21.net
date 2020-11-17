const fs = require('fs');
const path = require('path');

const constants = require('../lib/constants');
const isNotFuture = require('../lib/is-not-future');
const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');

/*!
 * `src/` 配下のファイルを見てサイトマップを生成する
 */

const pages = listFiles(constants.pages.src)
  .filter(filePath => ['.html', '.md'].includes(path.extname(filePath)))
  .filter(filePath => !filePath.includes('403.html') && !filePath.includes('404.html') && !filePath.includes('500.html'))
  .filter(filePath => {
    // `created` が未来日のファイルを除外する (コレで未来日のブログも除外される)
    // 作成日が未来日なファイルは公開しておらずサイトマップには載せられないため
    // (ココだけ `last-modified` ではなく `created` で判定する必要がある)
    const text = fs.readFileSync(filePath, 'utf-8');
    const matchLine = text.split('\n').find(line => line.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
    const created      = matchLine.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
    const createdYear  = Number(created[2]);
    const createdMonth = Number(created[3]);
    const createdDate  = Number(created[4]);
    const isNotFutureFile = isNotFuture(createdYear, createdMonth, createdDate);
    if(!isNotFutureFile) console.log(`Filtered : Future Created File … [${filePath}]`);
    return isNotFutureFile;
  })
  .filter(filePath => {
    // 上の処理で除外できているはずだが、念のためファイルパスでも未来日のブログ記事を除外する
    const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return true;  // マッチしなかったファイルはサイトマップ対象にする
    const blogYear  = Number(match[1]);
    const blogMonth = Number(match[2]);
    const blogDate  = Number(match[3]);
    const isNotFutureFile = isNotFuture(blogYear, blogMonth, blogDate);
    if(!isNotFutureFile) console.log(`Filtered : Future Blog File … [${filePath}] (Maybe Invalid Created)`);
    return isNotFutureFile;
  })
  .map(filePath => filePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), `${constants.protocol}${constants.host}`).replace('.md', '.html'))
  .map(filePath => `  <url><loc>${filePath}</loc></url>`)
  .sort()
  .join('\n');

const template = fs.readFileSync(constants.sitemap.src, 'utf-8');
const sitemap = template.replace('{{ url-list }}', pages);
makeDirectory(constants.sitemap.dist, true);
fs.writeFileSync(constants.sitemap.dist, sitemap, 'utf-8');

console.log('Build Sitemap : Succeeded');
