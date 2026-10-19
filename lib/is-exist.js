import fs from 'node:fs';

/**
 * ファイルまたはディレクトリが存在するか否か
 * 
 * @param {string} targetPath ファイル or ディレクトリパス
 * @return {boolean} ファイルやディレクトリが存在すれば `true`・存在しなければ `false`
 */
export const isExist = targetPath => {
  try {
    fs.statSync(targetPath);
    return true;
  }
  catch {
    return false;
  }
};
