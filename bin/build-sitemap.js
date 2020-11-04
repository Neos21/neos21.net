const fs = require('fs');

const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');

/*!
 * サイトマップを生成する
 */

const template = fs.readFileSync(constants.sitemap.src, 'utf-8');
const pages = listFiles(constants.pages.src)
  .filter(filePath => filePath.endsWith('.html') || filePath.endsWith('.md'))
  .filter(filePath => !filePath.includes('403.html') && !filePath.includes('404.html') && !filePath.includes('500.html'))
  .map(filePath => filePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), `${constants.protocol}${constants.host}`).replace('.md', '.html'))
  .map(filePath => `  <url><loc>${filePath}</loc></url>`)
  .sort()
  .join('\n');
const sitemap = template.replace('{{ url-list }}', pages);
makeDirectory(constants.sitemap.dist, true);
fs.writeFileSync(constants.sitemap.dist, sitemap, 'utf-8');

console.log('Build Sitemap : Succeeded');
