const fs = require('fs');

const srcDir  = 'src/';
const distDir = 'dist/';

// 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
const addedModified = require('../../temp/added_modified.json');
const renamed       = require('../../temp/renamed.json');
const removed       = require('../../temp/removed.json');  // 削除されたファイルがあるかどうかの確認だけ

if(removed.length) {
  console.log('Removed Files Exist. Please Remove Manually');
}

const joined = [...addedModified, ...renamed];

// src/templates/ 配下の変更がある場合は一切のアップロードを行わないこととする
const isTemplateChanged = joined.some((file) => file.includes('src/templates/'));
if(isTemplateChanged) {
  console.error('Templates Changed! Please Upload Manually. Aborted');
  return process.exit(1);
}

// src/pages/ 配下の変更を特定する
const filtered = joined.filter((file) => file.includes(srcDir + 'pages/'));

// ビルド後のコンテンツに対応するようファイル名を直す
const uploadFiles = filtered.map((file) => file.replace(srcDir + 'pages/', distDir).replace('.md', '.html'));

// 変更ファイルがなければ結果ファイルを作らず終了する
if(!uploadFiles.length) {
  return console.log('Upload Files Not Exist');
}

// src/ 配下の変更が検知できなくても必ずアップロードするファイルを付け足す
uploadFiles.push('dist/feeds/atom.xml');
uploadFiles.push('dist/index.html');
uploadFiles.push('dist/about/new.html');
uploadFiles.push('dist/blog/index.html');

const stringified = JSON.stringify(uploadFiles);
console.log('Upload Files :');
console.log(stringified);
fs.writeFileSync('./temp/upload-files.json', stringified, 'utf-8');
