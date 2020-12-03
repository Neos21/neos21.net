const fs = require('fs');
const path = require('path');

const constants = require('../lib/constants');
const isNotFuture = require('../lib/is-not-future');
const listFiles = require('../lib/list-files');
const detectDirectoryPathsFromFilePaths = require('../lib/detect-directory-paths-from-file-paths');
const ftp = require('../lib/ftp');

/*!
 * `dist/` 配下の HTML・CSS・XML ファイルを全てアップロードする
 * 
 * - 画像ファイルなどは除外する
 * - 作成日が未来日のページ、未来日のパスにあるブログページは除外する
 */

const targetFilePaths = listFiles(constants.dist)
  .filter(filePath => ['.html', '.css', '.xml'].includes(path.extname(filePath)))  // HTML・CSS・XML (フィードとサイトマップ) を対象にする
  .filter(filePath => !filePath.includes('_'))  // ファイルパスにアンダースコアを含んでいれば除外する
  .filter(filePath => {
    // HTML ファイル以外、`dist/documents/` 配下の HTML ファイルは素通しする
    if(!filePath.endsWith('.html') || filePath.includes(constants.documents.dist)) return true;
    
    // 最終更新日が未来日のファイルを除外する (コレで未来日のブログも除外される)
    const text = getText(filePath);  // `src/pages/` 配下から元のファイルを見つけて確認する
    const lastModifiedLine  = text.split('\n').find(line => line.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
    const lastModifiedMatch = lastModifiedLine.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
    const lastModifiedYear  = Number(lastModifiedMatch[2]);
    const lastModifiedMonth = Number(lastModifiedMatch[3]);
    const lastModifiedDate  = Number(lastModifiedMatch[4]);
    return isNotFuture(lastModifiedYear, lastModifiedMonth, lastModifiedDate);
  })
  .filter(filePath => {
    // 上の処理で除外できているはずだが、念のためファイルパスでも未来日のブログ記事を除外する
    const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
    const blogYear  = Number(match[1]);
    const blogMonth = Number(match[2]);
    const blogDate  = Number(match[3]);
    return isNotFuture(blogYear, blogMonth, blogDate);
  })
  .map(filePath => filePath.replace(new RegExp(`.*${constants.dist}`, 'u'), constants.dist))
  .sort();  // `dist/` から始まるように調整する

if(!targetFilePaths.length) return console.error('Not Uploading Files. Aborted');
console.log('Target File Paths :\n', targetFilePaths);

// アップロード対象のディレクトリパス・ファイルパスの配列を作る
const directoryPaths = detectDirectoryPathsFromFilePaths(targetFilePaths);
const uploadFilePaths = [...directoryPaths, ...targetFilePaths];

(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  console.log('Upload All Pages : Succeeded');
})();


// ================================================================================


/**
 * 指定のファイルパスからソースファイルを見つけて内容を返す
 * 
 * @param {string} filePath `dist/` 配下のファイルパス
 * @return ソースファイルの内容
 * @throws ファイルが見つからなかった場合
 */
function getText(filePath) {
  const sourceHtmlFilePath = filePath.replace(constants.dist, constants.pages.src);
  try {
    return fs.readFileSync(sourceHtmlFilePath, 'utf-8');
  }
  catch(_error) { }
  
  // ソース HTML ファイルが見つからなければ Markdown ファイルを探す
  const sourceMarkdownFilePath = sourceHtmlFilePath.replace('.html', '.md');
  return fs.readFileSync(sourceMarkdownFilePath, 'utf-8');  // ココで例外が出たらそのまま落とす
}
