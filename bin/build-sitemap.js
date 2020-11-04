const fs = require('fs');
const path = require('path');

const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');

/*!
 * サイトマップを生成する
 */

const template = fs.readFileSync(path.resolve(__dirname, `../${constants.sitemap.src}`), 'utf-8');
const pagesRegExp = new RegExp(`.*${constants.pages.src}`, 'u');
const pages = listFiles(path.resolve(__dirname, `../${constants.pages.src}`))
  .filter(filePath => filePath.endsWith('.html') || filePath.endsWith('.md'))
  .filter(filePath => !filePath.includes('403.html') && !filePath.includes('404.html') && !filePath.includes('500.html'))
  .map(filePath => filePath.replace(pagesRegExp, `${constants.protocol}${constants.host}`).replace('.md', '.html'))
  .map(filePath => `  <url><loc>${filePath}</loc></url>`)
  .sort()
  .join('\n');
const sitemap = template.replace('{{ url-list }}', pages);
const distFilePath = path.resolve(__dirname, `../${constants.sitemap.dist}`);
makeDirectory(distFilePath, true);
fs.writeFileSync(distFilePath, sitemap, 'utf-8');

console.log('Build Sitemap : Succeeded');
