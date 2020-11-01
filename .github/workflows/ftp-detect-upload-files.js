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
const isTemplateChanged = joined.some((file) => file.includes(srcDir + 'templates/'));
if(isTemplateChanged) {
  console.error('Templates Changed! Please Upload Manually. Aborted');
  return process.exit(1);
}

// src/ 配下の変更ファイルのみ抽出する
const filtered = joined.filter((file) => file.includes(srcDir));

// ビルド後のコンテンツに対応するようファイル名を直す
const uploadFiles = filtered.map((file) => {
  if(file.includes(srcDir + 'pages/')) {
    return file.replace(srcDir + 'pages/', distDir);
  }
  // 知らないパスにファイルが登場したら中止する
  throw new Error(`The file path is not supported : [${file}]`);
});

// 変更ファイルがなければ結果ファイルを作らず終了する
if(!uploadFiles.length) {
  return console.log('Upload Files Not Exist');
}

const stringified = JSON.stringify(uploadFiles);
console.log('Upload Files :');
console.log(stringified);
fs.writeFileSync('./temp/upload-files.json', stringified, 'utf-8');
