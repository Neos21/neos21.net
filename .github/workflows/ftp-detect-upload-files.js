const fs = require('fs');

const constants = require('../../lib/constants');

/*!
 * アップロード対象のファイルパスを組み立てる
 */

// 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
// ファイルパスは `'src/pages/index.html'` のようにプロジェクトルートからの表記になっている
const addedModified = require('../../temp/added_modified.json');
const renamed       = require('../../temp/renamed.json');
const removed       = require('../../temp/removed.json');  // 削除されたファイルがあるかどうかの確認だけ

if(removed.length) console.log('Removed Files Exist. Please Remove Manually');

const joined = [...addedModified, ...renamed];

// `src/templates/templates.html` の変更がある場合は一切のアップロードを行わないこととする
// 全量アップロードが必要になり、GitHub Actions 内での全量アップは自信がないので手作業にする
const isTemplateChanged = joined.some(file => file.includes(constants.templates.src));
if(isTemplateChanged) {
  console.error('Templates Changed! Please Upload Manually. Aborted');
  return process.exit(1);
}

const uploadFiles = joined
  .filter(uploadFile => uploadFile.includes(constants.pages.src))  // `src/pages/` 配下の変更のみ扱う
  .map(uploadFile => uploadFile.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html'));  // ファイルパス・ファイル名を直す

// 変更ファイルがなければ結果ファイルを作らず終了する
if(!uploadFiles.length) return console.log('Upload Files Not Exist');

// `./src/` 配下の変更が検知できなくても必ずアップロードするファイルを付け足す
uploadFiles.push(constants.feeds.dist);
uploadFiles.push(constants.sitemap.dist);
uploadFiles.push(constants.styles.dist);
uploadFiles.push(...constants.news.dist);
uploadFiles.push(`${constants.pages.dist}/blog/index.html`);

// 更新したファイル内に `/blog/YYYY/MM/index.md` ファイルが存在すれば `index.md` もアップロード対象にする
const blogIndexes = new Set();
uploadFiles.forEach(uploadFile => {
  const match = uploadFile.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/[0-9]{2}-[0-9]{2}\.md/u));
  if(!match) return;
  
  const year  = match[1];
  const month = match[2];
  blogIndexes.add(`${constants.pages.dist}/blog/${year}/${month}/index.html`);
  blogIndexes.add(`${constants.pages.dist}/blog/${year}/index.html`);
});
uploadFiles.push(...Array.from(blogIndexes));

const stringified = JSON.stringify(uploadFiles);
console.log('Upload Files :\n', stringified);
fs.writeFileSync('./temp/upload-files.json', stringified, 'utf-8');
