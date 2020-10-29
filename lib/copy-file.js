const fs = require('fs');
const path = require('path');

const log = require('./create-log')('COPY_FILE');
const makeDirectory = require('./make-directory');

/**
 * 指定のファイルをコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function copyFile(sourceFilePath) {
  log('Copy File : Start');
  
  // プロジェクトルートから対象のソースファイルのパスを特定する
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  log(`  Source [${resolvedSourceFilePath}]`);
  
  // 出力先ファイルパスを作る
  const distFilePath = resolvedSourceFilePath.replace('src/pages', 'dist');
  log(`  Dist [${distFilePath}]`);
    
  // 出力先ファイルのディレクトリがなければ作る
  makeDirectory(distFilePath);
  
  fs.copyFileSync(resolvedSourceFilePath, distFilePath);
  log('Copy File : Finished');
};
