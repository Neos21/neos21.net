const fs = require('fs');
const path = require('path');

const constants = require('../lib/constants');
const makeDirectory = require('../lib/make-directory');

/*!
 * `./dist/` ディレクトリを削除して配下に空ディレクトリを作成する
 */

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

// `./dist/` ディレクトリを削除して再作成する
fs.rmdirSync(constants.dist, { recursive: true });
makeDirectory(constants.dist, false);

// `./src/pages/` 配下のサブディレクトリパスを抽出し、空ディレクトリを作成したい `./dist/` 配下のフルパスに変換する
listDirectories(constants.pages.src)
  .map(directoryPath => directoryPath.replace(constants.pages.src, constants.pages.dist))
  .forEach(directoryPath => makeDirectory(directoryPath, false));

console.log('Clear Dist : Succeeded');
