const constants = require('../lib/constants');
const jstNow = require('../lib/jst-now');
const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const copyFile = require('../lib/copy-file');

/*!
 * 引数で指定されたファイル (1つ以上) をビルド処理する
 * 
 * ファイル拡張子に基づき、ビルドもしくはコピーを行う
 */

const argFilePaths = process.argv.slice(2);
if(!argFilePaths.length) return console.log('Please Select Source File(s)');

// 重複を除外するために Set を使う
const sourceFilePathsSet = new Set(argFilePaths);

// 更新を知らせるためのファイルを追加する
sourceFilePathsSet.add(`${constants.pages.src}/index.html`);
sourceFilePathsSet.add(`${constants.pages.src}/about/new.html`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/index.md`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/${jstNow.jstCurrentYear}/index.md`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/${jstNow.jstCurrentYear}/${jstNow.zeroPadJstCurrentMonth}/index.md`);

const sourceFilePaths = Array.from(sourceFilePathsSet);

sourceFilePaths.forEach(sourceFilePath => {
  if(!sourceFilePath.includes(constants.src)) {
    return console.warn(`Ignore : [${sourceFilePath}]`);
  }
  
  if(sourceFilePath.endsWith('.css')) {
    console.log(`CSS : [${sourceFilePath}]`);
    return buildCss();
  }
  if(sourceFilePath.endsWith('.html')) {
    console.log(`HTML : [${sourceFilePath}]`);
    return buildHtml(sourceFilePath);
  }
  if(sourceFilePath.endsWith('.md')) {
    console.log(`Markdown : [${sourceFilePath}]`);
    return buildMarkdown(sourceFilePath);
  }
  
  console.log(`Asset : [${sourceFilePath}]`);
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
  copyFile(sourceFilePath, distFilePath);
});

console.log('Build Files : Succeeded');
