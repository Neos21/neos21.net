const path = require('path');

const log = require('../lib/create-log')('COPY_PAGES_ASSETS');
const listFiles = require('../lib/list-files');
const copyFile = require('../lib/copy-file');

/*!
 * ./src/pages/ 配下の画像ファイルなどを全てコピーする
 */
log('Copy Pages Assets All : Start');

// HTML・Markdown ファイル以外を対象にする
const assetFilePaths = listFiles('src/pages').filter(filePath => !['.html', '.md'].includes(path.extname(filePath)));
assetFilePaths.forEach((assetFilePath) => {
  try {
    //log(`  [${assetFilePath}]`);
    copyFile(assetFilePath);
  }
  catch(error) {
    log(`  Failed To Copy [${assetFilePath}]`);
    log(error);
  }
});

log('Copy Pages Assets All : Finished');
