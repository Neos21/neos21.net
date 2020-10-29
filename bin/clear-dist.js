const fs = require('fs');
const path = require('path');

const log = require('../lib/create-log')('CLEAR_DIST');

/*!
 * ./dist/ ディレクトリを削除する
 */

log('Clear Dist : Start');

try {
  fs.rmdirSync(path.resolve(__dirname, '../dist'), { recursive: true });
  log('  Success');
}
catch(error) {
  log('  Failed To Remove');
  log(error);
}

log('Clear Dist : Finished');
