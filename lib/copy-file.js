const fs = require('fs');

const constants = require('./constants');
const makeDirectory = require('./make-directory');

/**
 * 指定のファイルを `dist/` ディレクトリにコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function copyFile(sourceFilePath) {
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
  try {
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
};
