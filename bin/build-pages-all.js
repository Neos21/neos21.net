const log = require('../lib/create-log')('BUILD_ALL_PAGES');
const listFiles = require('../lib/list-files');
const buildPage = require('../lib/build-page');

/*!
 * ./src/pages/ 配下の全ての HTML ファイルをビルドする
 */

log('Build All Pages : Start');

const htmlFileNames = listFiles('src/pages').filter(fileName => fileName.endsWith('.html'));
htmlFileNames.forEach((htmlFileName) => {
  try {
    //log(`  [${htmlFileName}]`);
    buildPage(htmlFileName);
  }
  catch(error) {
    log(`  Failed To Build [${htmlFileName}]`);
    log(error);
  }
});

log('Build All Pages : Finished');
