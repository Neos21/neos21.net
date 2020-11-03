const fs = require('fs');

const srcDir  = 'src/';
const distDir = 'dist/';

// 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
// ファイルパスは `'src/pages/index.html'` のようにプロジェクトルートからの表記になっている
const addedModified = require('../../temp/added_modified.json');
const renamed       = require('../../temp/renamed.json');
const removed       = require('../../temp/removed.json');  // 削除されたファイルがあるかどうかの確認だけ

if(removed.length) {
  console.log('Removed Files Exist. Please Remove Manually');
}

const joined = [...addedModified, ...renamed];

// `src/templates/` 配下の変更がある場合は一切のアップロードを行わないこととする
// 全量アップロードが必要になり、GitHub Actions 内での全量アップは自信がないので手作業にする
const isTemplateChanged = joined.some((file) => file.includes('src/templates/'));
if(isTemplateChanged) {
  console.error('Templates Changed! Please Upload Manually. Aborted');
  return process.exit(1);
}

const uploadFiles = joined
  .filter((file) => file.includes(srcDir + 'pages/'))  // `src/pages/` 配下の変更のみ扱う
  .map((file) => file.replace(srcDir + 'pages/', distDir).replace('.md', '.html'));  // ファイルパス・ファイル名を直す

// 変更ファイルがなければ結果ファイルを作らず終了する
if(!uploadFiles.length) {
  return console.log('Upload Files Not Exist');
}

// src/ 配下の変更が検知できなくても必ずアップロードするファイルを付け足す
uploadFiles.push('dist/feeds/atom.xml');
uploadFiles.push('dist/sitemap.xml');
uploadFiles.push('dist/index.html');
uploadFiles.push('dist/about/new.html');
uploadFiles.push('dist/blog/index.html');

// 現在年月の `/blog/YYYY/MM/index.md` ファイルが存在すれば、必ずアップロードする対象にする
const now = new Date();
const currentYearMonth = now.getFullYear() + '/' + ('0' + (now.getMonth() + 1)).slice(-2);  // `'YYYY/MM'` 形式にする
const currentYearMonthIndex = srcDir + '/pages/blog/' + currentYearMonth + '/index.md';
try {
  fs.statSync(currentYearMonthIndex);  // ビルド前のファイルの存在をチェックする
  uploadFiles.push(distDir + 'blog/' + currentYearMonth + '/index.html');  // 存在していればビルド後のファイル名をアップロード対象にする
}
catch(_error) {
  console.log(`Current Year Month Index File [${currentYearMonthIndex}] Does Not Exist`);
}

const stringified = JSON.stringify(uploadFiles);
console.log('Upload Files :');
console.log(stringified);
fs.writeFileSync('./temp/upload-files.json', stringified, 'utf-8');
