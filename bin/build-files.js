const fs = require('fs');

const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const constants = require('../lib/constants');
const copyFile = require('../lib/copy-file');
const jstNow = require('../lib/jst-now');
const listFiles = require('../lib/list-files');

/*!
 * 引数で指定されたファイル (1つ以上) をビルド処理する
 * 
 * - ディレクトリを指定した場合は配下のファイルを再帰的に追加する
 * - ファイル拡張子に基づき、ビルドもしくはコピーを行う
 */

const argFilePaths = process.argv.slice(2);
if(!argFilePaths.length) return console.log('Please Select Source File(s)');

// 重複を除外するために Set を使う
const sourceFilePathsSet = new Set(argFilePaths);

// 更新を知らせるためのファイルを追加する
sourceFilePathsSet.add(`${constants.pages.src}/index.html`);
sourceFilePathsSet.add(`${constants.pages.src}/about/new.html`);
sourceFilePathsSet.add(`${constants.pages.src}/about/sitemap.md`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/index.md`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/${jstNow.jstCurrentYear}/index.md`);
sourceFilePathsSet.add(`${constants.pages.src}/blog/${jstNow.jstCurrentYear}/${jstNow.zeroPadJstCurrentMonth}/index.md`);

// ディレクトリが指定されていた時に配下のファイルを追加する (ディレクトリ指定時は末尾スラッシュなし)
const beforeSourceFilePaths = Array.from(sourceFilePathsSet);
beforeSourceFilePaths.forEach(sourceFilePath => {
  if(!sourceFilePath.includes(constants.src)) {
    return console.warn(`Ignore : [${sourceFilePath}]`);
  }
  
  try {
    const stat = fs.statSync(sourceFilePath);
    if(stat.isDirectory()) {
      const files = listFiles(sourceFilePath);
      files.forEach(file => sourceFilePathsSet.add(file));  // 配下のファイルを追加する
      sourceFilePathsSet.delete(sourceFilePath);  // 元のディレクトリパスは除去する
    }
  }
  catch(error) {
    console.warn(`Before Source File Paths Error : [${sourceFilePath}]`, error);
  }
});

const sourceFilePaths = Array.from(sourceFilePathsSet);
sourceFilePaths.forEach(sourceFilePath => {
  if(!sourceFilePath.includes(constants.src)) return;
  
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
