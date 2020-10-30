const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const copyFile = require('../lib/copy-file');

/*!
 * 引数で指定されたファイル (1つ以上) をビルド処理する
 * 
 * ファイル拡張子に基づき、ビルドもしくはコピーを行う
 */
const sourcePaths = process.argv.slice(2);
if(!sourcePaths.length) return console.log('Please Select Source File(s)');

sourcePaths.forEach((sourcePath) => {
  if(!sourcePath.includes('src/pages')) return console.warn(`Ignore [${sourcePath}]`);
  
  if(sourcePath.endsWith('.css')) {
    console.log(`CSS : [${sourcePath}]`);
    return buildCss();
  }
  if(sourcePath.endsWith('.html')) {
    console.log(`HTML : [${sourcePath}]`);
    return buildHtml(sourcePath);
  }
  if(sourcePath.endsWith('.md')) {
    console.log(`Markdown : [${sourcePath}]`);
    return buildMarkdown(sourcePath);
  }
  
  console.log(`Asset : [${sourcePath}]`);
  copyFile(sourcePath);
});
console.log('Build Files : Succeeded');
