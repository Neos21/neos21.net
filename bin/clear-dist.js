import fs from 'node:fs';

import { constants } from '../lib/constants.js';
import { makeDirectory } from '../lib/make-directory.js';

/*!
 * `dist/` ディレクトリを削除して配下に空ディレクトリを作成する
 * 
 * GitHub Actions 用。ローカルで実行しないように注意
 */

// `dist/` ディレクトリを削除して再作成する
try {
  fs.rmSync(constants.dist, { recursive: true });
}
catch { /* Do Nothing */ }
makeDirectory(constants.dist, false);

/**
 * 指定のディレクトリパス配下のディレクトリを全て列挙する
 * 
 * @param {string} targetDirectoryPath ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ディレクトリパスの配列
 */
const listDirectories = targetDirectoryPath => {
  const directoryPaths = fs.readdirSync(targetDirectoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${targetDirectoryPath}/${dirent.name}`);
  const allDirectoryPaths = [...directoryPaths];
  directoryPaths.forEach(subDirectoryPath => allDirectoryPaths.push(...listDirectories(subDirectoryPath)));
  return allDirectoryPaths.sort();
};

// `src/pages/` 配下のサブディレクトリパスを抽出し、空ディレクトリを作成したい `dist/` 配下のフルパスに変換する
listDirectories(constants.pages.src)
  .map(directoryPath => directoryPath.replace(constants.pages.src, constants.pages.dist))
  .forEach(directoryPath => makeDirectory(directoryPath, false));

console.log('Clear Dist : Succeeded');
