import fs from 'node:fs';

import { constants } from '../lib/constants.js';
import { listDirectories } from '../lib/list-directories.js';
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
catch(_error) { /* Do Nothing */ }
makeDirectory(constants.dist, false);

// `src/pages/` 配下のサブディレクトリパスを抽出し、空ディレクトリを作成したい `dist/` 配下のフルパスに変換する
listDirectories(constants.pages.src)
  .map(directoryPath => directoryPath.replace(constants.pages.src, constants.pages.dist))
  .forEach(directoryPath => makeDirectory(directoryPath, false));

console.log('Clear Dist : Succeeded');
