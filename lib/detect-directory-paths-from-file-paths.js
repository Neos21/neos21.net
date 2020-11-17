const path = require('path');

const constants = require('./constants');

/**
 * ファイルパスの配列からディレクトリパスの配列を作る
 * FTP アップロードの際に先にディレクトリを生成させるために使用する
 * 
 * @param {Array<string>} filePaths ファイルパスの配列
 * @return ディレクトリパスの配列
 */
module.exports = function detectDirectoryPathsFromFilePaths(filePaths) {
  const directoriesSet = new Set();
  filePaths.forEach(filePath => {
    let directoryPath = filePath;
    while(directoryPath !== constants.dist) {
      directoryPath = path.dirname(directoryPath);
      // `dist/` までさかのぼったら中止する
      if(directoryPath === constants.dist) break;
      directoriesSet.add(directoryPath);
    }
  });
  return Array.from(directoriesSet).sort();
};
