const log = require('../lib/create-log')('BUILD_ALL_PAGES');
const listFiles = require('../lib/list-files');
const buildPage = require('../lib/build-page');

/*!
 * ./src/pages/ 配下の全ての HTML ファイルをビルドする
 */
log('Build Pages All : Start');

const htmlFilePaths = listFiles('src/pages').filter(filePath => filePath.endsWith('.html'));
htmlFilePaths.forEach((htmlFilePath) => {
  try {
    //log(`  [${htmlFilePath}]`);
    buildPage(htmlFilePath);
  }
  catch(error) {
    log(`  Failed To Build [${htmlFilePath}]`);
    log(error);
  }
});

log('Build Pages All : Finished');
