const fs = require('fs');

/**
 * ファイルまたはディレクトリの存在を確認する
 * 
 * @param {string} targetPath ファイル or ディレクトリパス
 * @return {boolean} ファイルやディレクトリが存在すれば true・存在しなければ false
 */
module.exports = function isExist(targetPath) {
  try {
    fs.statSync(targetPath);
    return true;
  }
  catch(_error) {
    return false;
  }
};
