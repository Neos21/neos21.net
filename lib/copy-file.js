const fs = require('fs');
const path = require('path');

const constants = require('./constants');
const makeDirectory = require('./make-directory');

/**
 * 指定のファイルを `dist/` ディレクトリにコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function copyFile(sourceFilePath) {
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  const resolvedDistFilePath = resolvedSourceFilePath.replace(constants.pages.src, constants.pages.dist);
  try {
    fs.copyFileSync(resolvedSourceFilePath, resolvedDistFilePath);
  }
  catch(_error) {
    makeDirectory(resolvedDistFilePath, true);
    fs.copyFileSync(resolvedSourceFilePath, resolvedDistFilePath);
  }
};
