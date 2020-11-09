const fs = require('fs');

const makeDirectory = require('./make-directory');

/**
 * 指定のファイルを `dist/` ディレクトリにコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 * @param {string} distFilePath コピー先ファイルパス
 */
module.exports = function copyFile(sourceFilePath, distFilePath) {
  try {
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
};
