const log = require('../lib/create-log')('BUILD_CSS_ALL');
const listFiles = require('../lib/list-files');
const buildCss = require('../lib/build-css');

/*!
 * ./src/styles/ 配下の全ての CSS ファイルをビルドする
 */
log('Build CSS All : Start');

const cssFilePaths = listFiles('src/styles').filter(filePath => filePath.endsWith('.css'));
cssFilePaths.forEach((cssFilePath) => {
  try {
    //log(`  [${htmlFilePath}]`);
    const distFilePath = cssFilePath.replace('src/styles', 'dist');
    buildCss(cssFilePath, distFilePath);
  }
  catch(error) {
    log(`  Failed To Build [${cssFilePath}]`);
    log(error);
  }
});

log('Build CSS All : Finished');
