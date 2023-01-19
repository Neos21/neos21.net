import fs from 'node:fs';

/**
 * 指定のディレクトリパス配下のディレクトリを全て列挙する
 * 
 * @param {string} targetDirectoryPath ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ディレクトリパスの配列
 */
export const listDirectories = (targetDirectoryPath) => {
  const directoryPaths = fs.readdirSync(targetDirectoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${targetDirectoryPath}/${dirent.name}`);
  const allDirectoryPaths = [...directoryPaths];
  directoryPaths.forEach(subDirectoryPath => allDirectoryPaths.push(...listDirectories(subDirectoryPath)));
  return allDirectoryPaths.sort();
};
