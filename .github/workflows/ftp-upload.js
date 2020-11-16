const path = require('path');

const constants = require('../../lib/constants');
const jstNow = require('../../lib/jst-now');
const isNotFuture = require('../../lib/is-not-future');
const buildHtml = require('../../lib/build-html');
const buildMarkdown = require('../../lib/build-markdown');
const copyFile = require('../../lib/copy-file');
const ftp = require('../../lib/ftp');

/*!
 * 対象のファイルをビルドしてアップロードする
 */

console.log(`JST Now : ${jstNow.jstCurrentYear}-${jstNow.zeroPadJstCurrentMonth}-${jstNow.zeroPadJstCurrentDate} ${jstNow.zeroPadJstCurrentHour}`);

// 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
// ファイルパスは `'src/pages/index.html'` のようにプロジェクトルートからの表記になっている
const addedModified = require('../../temp/added_modified.json');
const renamed       = require('../../temp/renamed.json');
const removed       = require('../../temp/removed.json');  // 削除されたファイルがあるかどうかの確認だけ

if(removed.length) console.log('Removed Files Exist. Please Remove Manually');

const changedFiles = [...addedModified, ...renamed];

// `src/templates/templates.html` の変更がある場合は一切のアップロードを行わないこととする
// 全量アップロードが必要になり、GitHub Actions 内での全量アップは自信がないので手作業にする
const isTemplateChanged = changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.templates.src));
if(isTemplateChanged) {
  console.error('Templates Changed! Please Upload Manually. Aborted');
  return process.exit(1);
}

// 重複を除去するため一旦 Set を使う
const uploadFilesSet = new Set();
// `src/` 配下のみ扱う
// TODO : 未来日が最終更新日の静的ページを除外できていない
changedFiles.filter(sourceFilePath => sourceFilePath.includes(constants.src)).forEach(sourceFilePath => {
  // CSS はビルド済・変更がある場合はアップロード対象に入れる
  if(sourceFilePath.includes(constants.styles.src)) return uploadFilesSet.add(constants.styles.dist);
  
  // News に変更がある場合 : News を使用するページをビルドする・Atom フィードはビルド済なので対象追加のみ
  if(sourceFilePath.includes(constants.news.src)) {
    buildHtml(`${constants.pages.src}/index.html`);
    buildHtml(`${constants.pages.src}/about/new.html`);
    uploadFilesSet.add(`${constants.pages.dist}/index.html`);
    uploadFilesSet.add(`${constants.pages.dist}/about/new.html`);
    uploadFilesSet.add(constants.feeds.dist);
    return;
  }
  
  // `src/pages/` 配下の変更 : ビルド or コピーする
  if(sourceFilePath.includes(constants.pages.src)) {
    // 未来日日付のブログ記事・画像などを除外する
    const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(match) {
      const blogYear  = Number(match[1]);
      const blogMonth = Number(match[2]);
      const blogDate  = Number(match[3]);
      if(!isNotFuture(blogYear, blogMonth, blogDate)) return console.log(`This Is Future Blog Asset : [${sourceFilePath}]`);  // 未来日ならビルドしない
    }
    
    const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
    if(sourceFilePath.endsWith('.html')) {
      buildHtml(sourceFilePath);
    }
    else if(sourceFilePath.endsWith('.md')) {
      buildMarkdown(sourceFilePath);
      
      // `/blog/YYYY/MM/DD-00.md` ファイルの更新時は `index.md` と Atom フィードもアップロード対象にする
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
        uploadFilesSet.add(constants.feeds.dist);
      }
    }
    else {
      copyFile(sourceFilePath, distFilePath);
    }
    uploadFilesSet.add(distFilePath);
    
    return;
  }
  
  // `src/documents/` 配下の変更 : ファイルコピーする
  if(sourceFilePath.includes(constants.documents.src)) {
    const distFilePath = sourceFilePath.replace(constants.documents.src, constants.documents.dist);
    copyFile(sourceFilePath, distFilePath);
    uploadFilesSet.add(distFilePath);
    return;
  }
});

if(uploadFilesSet.size) {
  // サイトマップはアップロード対象があれば常に一緒にアップロードする
  uploadFilesSet.add(constants.sitemap.dist);
}
else {
  // 変更ファイルがなければ結果ファイルを作らず終了する
  return console.log('Upload Files Not Exist');
}

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
  console.log('FTP Upload Finished');
})();
