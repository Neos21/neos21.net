const fs = require('fs');
const path = require('path');

const constants = require('../../lib/constants');
const jstNow = require('../../lib/jst-now');
const listFiles = require('../../lib/list-files');
const buildHtml = require('../../lib/build-html');
const buildMarkdown = require('../../lib/build-markdown');
const copyFile = require('../../lib/copy-file');
const detectDirectoryPathsFromFilePaths = require('../../lib/detect-directory-paths-from-file-paths');
const ftp = require('../../lib/ftp');

/*!
 * `last-modified` が今日日付のファイルをビルドしてアップロードする
 * 
 * - 対象外
 *  - CSS の変更
 *  - `src/documents/` 配下
 *  - `src/pages/` 配下、ブログ以外の画像ファイルなど (新規ファイルなのか特定ができないため)
 * - ブログと静的ページの予約投稿に対応するのみ
 */

// 最終更新日が今日に設定されているファイルを取得する
const today = `${jstNow.jstCurrentYear}-${jstNow.zeroPadJstCurrentMonth}-${jstNow.zeroPadJstCurrentDate}`;
const todaySourceHtmlMdFilePaths = listFiles(constants.pages.src)
  .filter(sourceFilePath => ['.html', '.md'].includes(path.extname(sourceFilePath)))
  .filter(sourceFilePath => !sourceFilePath.includes('_'))  // ファイルパスにアンダースコアを含んでいればアップロード対象にしない
  .filter(sourceFilePath => {
    const text = fs.readFileSync(sourceFilePath, 'utf-8');
    return text.split('\n').find(line => line.match(new RegExp(`^last-modified(\\s*): ${today}`, 'u')));
  });
// ブログの画像ファイルなどを取得する
const todaySourceAssetFilePaths = listFiles(constants.pages.src)
  .filter(sourceFilePath => !['.html', '.md'].includes(path.extname(sourceFilePath)))
  .filter(sourceFilePath => !sourceFilePath.includes('_'))  // ファイルパスにアンダースコアを含んでいればアップロード対象にしない
  .filter(sourceFilePath => {
    const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return false;  // マッチしなかった資材はアップロード対象にしない
    const date = `${match[1]}-${match[2]}-${match[3]}`;
    return date === today;
  });
const todaySourceFilePaths = [...todaySourceHtmlMdFilePaths, ...todaySourceAssetFilePaths];

if(!todaySourceFilePaths.length) return console.log('Maybe There Was No Assets Today. Aborted');
console.log('Today Source Files :\n', todaySourceFilePaths);

// 重複を除去するため一旦 Set を使う
const uploadFilesSet = new Set();

// 更新を通知するためトップ・更新履歴ページと Atom フィードを対象にする
buildHtml(`${constants.pages.src}/index.html`);
buildHtml(`${constants.pages.src}/about/new.html`);
uploadFilesSet.add(`${constants.pages.dist}/index.html`);
uploadFilesSet.add(`${constants.pages.dist}/about/new.html`);
uploadFilesSet.add(constants.feeds.dist);
uploadFilesSet.add(constants.sitemap.dist);

// ビルドしてアップロード対象にする
todaySourceFilePaths.forEach(sourceFilePath => {
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
  if(sourceFilePath.endsWith('.html')) {
    buildHtml(sourceFilePath);
  }
  else if(sourceFilePath.endsWith('.md')) {
    buildMarkdown(sourceFilePath);
    
    // `/blog/YYYY/MM/DD-00.md` ファイルの更新時は `index.md` もアップロード対象にする
    const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/[0-9]{2}-[0-9]{2}\.md/u));
    if(match) {
      const year  = match[1];
      const month = match[2];
      buildMarkdown(`${constants.pages.src}/blog/${year}/${month}/index.md`);
      buildMarkdown(`${constants.pages.src}/blog/${year}/index.md`);
      buildMarkdown(`${constants.pages.src}/blog/index.md`);
      uploadFilesSet.add(`${constants.pages.dist}/blog/${year}/${month}/index.html`);
      uploadFilesSet.add(`${constants.pages.dist}/blog/${year}/index.html`);
      uploadFilesSet.add(`${constants.pages.dist}/blog/index.html`);
    }
  }
  else {
    copyFile(sourceFilePath, distFilePath);
  }
  uploadFilesSet.add(distFilePath);
});

// アップロード対象のディレクトリパス・ファイルパスの配列を作る
const filePaths = Array.from(uploadFilesSet).sort();
const directoryPaths = detectDirectoryPathsFromFilePaths(filePaths);
const uploadFilePaths = [...directoryPaths, ...filePaths];

// アップロード対象のファイルを FTP アップロードする
(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  console.log('Daily Upload : Succeeded');
})();
