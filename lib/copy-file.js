const fs = require('fs');
const path = require('path');

const makeDirectory = require('./make-directory');

/**
 * 指定のファイルをコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function copyFile(sourceFilePath) {
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  const resolvedDistFilePath = resolvedSourceFilePath.replace('src/pages', 'dist');
  makeDirectory(resolvedDistFilePath);
  fs.copyFileSync(resolvedSourceFilePath, resolvedDistFilePath);
};
