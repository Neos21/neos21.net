const fs = require('fs');
const path = require('path');

/**
 * 指定パスのディレクトリがなければ作成する
 * 
 * @param {string} targetPath 対象のパス
 * @param {boolean} isFilePath `targetPath` がファイル名を指している場合は `true` を指定し
 *                             `path.dirname()` を適用させて指定のファイルの親ディレクトリを作成させる
 */
module.exports = function makeDirectory(targetPath, isFilePath) {
  if(isFilePath) targetPath = path.dirname(targetPath);
  try {
    fs.statSync(targetPath);
  }
  catch(_error) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
};
