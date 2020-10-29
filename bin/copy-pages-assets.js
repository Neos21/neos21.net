const fs = require('fs');
const path = require('path');

const log = require('../lib/create-log')('COPY_PAGES_ASSETS');
const listFiles = require('../lib/list-files');

/*!
 * ./src/pages/ 配下の画像ファイルなどをコピーする
 */

log('Copy Pages Assets : Start');

// HTML・Markdown ファイル以外を移動する
const assetFileNames = listFiles('src/pages').filter(fileName => !['.html', '.md'].includes(path.extname(fileName)));
assetFileNames.forEach((assetFileName) => {
  try {
    //log(`  [${assetFileName}]`);
    const resolvedSourceFilePath = path.resolve(assetFileName);
    const distFilePath = resolvedSourceFilePath.replace('src/pages', 'dist');
    
    // 出力先ファイルのディレクトリがなければ作る
    const distDirName = path.dirname(distFilePath);
    try {
      fs.statSync(distDirName);
    }
    catch(_error) {
      fs.mkdirSync(distDirName, { recursive: true });
    }
    
    fs.copyFileSync(resolvedSourceFilePath, distFilePath);
  }
  catch(error) {
    log(`  Failed To Copy [${assetFileName}]`);
    log(error);
  }
});

log('Copy Pages Assets : Finished');
