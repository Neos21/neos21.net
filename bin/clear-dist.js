const fs = require('fs');
const path = require('path');

const makeDirectory = require('../lib/make-directory');

/*!
 * `./dist/` ディレクトリを削除する
 */

const distDirectoryPath = path.resolve(__dirname, '../dist');
fs.rmdirSync(distDirectoryPath, { recursive: true });

// `make-directory` が `path.dirname()` を使っているので適当なファイル名を付与しておき
// `./dist/` ディレクトリが生成されるようにしておく
const makeDistDirectoryPath = path.resolve(distDirectoryPath, './.gitkeep');
makeDirectory(makeDistDirectoryPath);

console.log('Clear Dist : Succeeded');
