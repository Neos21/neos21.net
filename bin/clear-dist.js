const fs = require('fs');

const constants = require('../lib/constants');
const listDirectories = require('../lib/list-directories');
const makeDirectory = require('../lib/make-directory');

/*!
 * `dist/` ディレクトリを削除して配下に空ディレクトリを作成する
 * 
 * GitHub Actions 用。ローカルで実行しないように注意
 */

// `dist/` ディレクトリを削除して再作成する
fs.rmdirSync(constants.dist, { recursive: true });
makeDirectory(constants.dist, false);

// `src/pages/` 配下のサブディレクトリパスを抽出し、空ディレクトリを作成したい `dist/` 配下のフルパスに変換する
listDirectories(constants.pages.src)
  .map(directoryPath => directoryPath.replace(constants.pages.src, constants.pages.dist))
  .forEach(directoryPath => makeDirectory(directoryPath, false));

console.log('Clear Dist : Succeeded');
