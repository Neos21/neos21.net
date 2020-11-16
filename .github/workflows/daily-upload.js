const childProcess = require('child_process');
const path = require('path');

const constants = require('../../lib/constants');
const jstNow = require('../../lib/jst-now');
const buildHtml = require('../../lib/build-html');
const buildMarkdown = require('../../lib/build-markdown');
const copyFile = require('../../lib/copy-file');
const ftp = require('../../lib/ftp');

/*!
 * 今日更新されるファイルをビルドしてアップロードする
 * 
 * NOTE : このスクリプトは `./src/documents/` は対象外。CSS の変更も検知しない
 */

const today = `${jstNow.jstCurrentYear}-${jstNow.zeroPadJstCurrentMonth}-${jstNow.zeroPadJstCurrentDate}`;
console.log(`JST Now : ${today} ${jstNow.zeroPadJstCurrentHour}`);

let todaySourceFilePathsStr = null;
try {
  // `./src/pages/` 配下の最終更新日が今日のファイルを抽出する
  todaySourceFilePathsStr = childProcess.execSync(`grep -r -l -E 'last-modified(\\s*): ${today}' ${constants.pages.src}`).toString();
}
catch(error) {
  console.error('Error ---\n', error, '\nError ---');
  console.error('Maybe There Was No Assets Today. Aborted');
  return;
}

const todaySourceFilePaths = todaySourceFilePathsStr.split('\n').filter(filePath => filePath);

// 何らかの理由で不正値になっていたらココで終了する
if(todaySourceFilePaths == null || !todaySourceFilePaths.length) {
  console.error('Invalid Today Source Files :\n', todaySourceFilePaths);
  return process.exit(1);
}

console.log('Today Source Files :\n', todaySourceFilePaths);

// 重複を除去するため一旦 Set を使う
const uploadFilesSet = new Set();

// 更新を通知するためトップ・更新履歴ページと Atom フィードを対象にする
buildHtml(`${constants.pages.src}/index.html`);
buildHtml(`${constants.pages.src}/about/new.html`);
uploadFilesSet.add(`${constants.pages.dist}/index.html`);
uploadFilesSet.add(`${constants.pages.dist}/about/new.html`);
uploadFilesSet.add(constants.feeds.dist);
//uploadFilesSet.add(constants.sitemap.dist);  // FIXME : サイトマップは予約投稿ファイルを除外しきれていないので一旦対象外とする

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

// アップロード対象ファイルのディレクトリの配列を作る
const uploadDirectoriesSet = new Set();
uploadFilesSet.forEach(uploadFilePath => {
  let directoryPath = uploadFilePath;
  while(directoryPath !== constants.dist) {
    directoryPath = path.dirname(directoryPath);
    if(directoryPath === constants.dist) break;
    uploadDirectoriesSet.add(directoryPath);
  }
});

// アップロード対象のディレクトリパス・ファイルパスの配列を作る
const uploadFiles = [...Array.from(uploadDirectoriesSet).sort(), ...Array.from(uploadFilesSet).sort()];

// アップロード対象のファイルを FTP アップロードする
(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFiles)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  console.log('Daily Upload Finished');
})();
