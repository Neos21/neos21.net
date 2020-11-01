const fs = require('fs');
const path = require('path');

/**
 * 指定のファイルの親ディレクトリがなければ作成する
 * 
 * @param {string} filePath ファイルパス
 */
module.exports = function makeDirectory(filePath) {
  const dirPath = path.dirname(filePath);
  try {
    fs.statSync(dirPath);
  }
  catch(_error) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
