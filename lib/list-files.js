const fs = require('fs');

/**
 * 指定のディレクトリパス配下のファイルを全て列挙する
 * 
 * @param {string} dir ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ファイルパスの配列
 */
module.exports = function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const name = `${dir}/${dirent.name}`;
    return dirent.isFile() ? [name] : listFiles(name);
  });
};
