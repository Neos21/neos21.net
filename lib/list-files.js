const fs = require('fs');

/**
 * 指定のディレクトリパス配下のファイルを全て列挙する
 * 
 * @param {string} targetDirectoryPath ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ファイルパスの配列
 */
module.exports = function listFiles(targetDirectoryPath) {
  return fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap(dirent => {
    const name = `${targetDirectoryPath}/${dirent.name}`;
    return dirent.isFile() ? [name] : listFiles(name);
  });
};
