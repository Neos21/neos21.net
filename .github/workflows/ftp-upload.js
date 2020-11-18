const fs = require('fs');
const path = require('path');

const constants = require('../../lib/constants');
const isNotFuture = require('../../lib/is-not-future');
const buildHtml = require('../../lib/build-html');
const buildMarkdown = require('../../lib/build-markdown');
const copyFile = require('../../lib/copy-file');
const detectDirectoryPathsFromFilePaths = require('../../lib/detect-directory-paths-from-file-paths');
const ftp = require('../../lib/ftp');

/*!
 * 対象のファイルをビルドしてアップロードする
 */

// 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
// ファイルパスは `'src/pages/index.html'` のようにプロジェクトルートからの表記になっている
const addedModified = require('../../temp/added_modified.json');
const renamed       = require('../../temp/renamed.json');
const removed       = require('../../temp/removed.json');  // 削除されたファイルがあるかどうかの確認だけ
if(removed.length) console.log('Removed Files Exist. Please Remove Manually');

// `src/` 配下の変更ファイルのみ扱う
const changedFiles = [...addedModified, ...renamed].filter(sourceFilePath => sourceFilePath.includes(constants.src));
if(!changedFiles.length) return console.log('Changed Files Not Exist. Aborted');

// `src/templates/templates.html` の変更がある場合は一切のアップロードを行わないこととする
// 全量アップロードが必要になり、GitHub Actions 内での全量アップは自信がないので手作業にする
const isTemplateChanged = changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.templates.src));
if(isTemplateChanged) return console.log('Templates Changed! Please Upload Manually. Aborted');


// アップロード対象のファイルを特定して追加していく
// ================================================================================

// 重複を除去するため一旦 Set を使う
const uploadFilesSet = new Set();

// CSS はビルド済・変更がある場合
if(changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.styles.src))) {
  uploadFilesSet.add(constants.styles.dist);
}

// News YAML に変更がある場合 : News を使用するページをビルドし追加する・Atom フィードはビルド済なので対象追加のみ
if(changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.news.src))) {
  buildHtml(`${constants.pages.src}/index.html`);
  buildHtml(`${constants.pages.src}/about/new.html`);
  uploadFilesSet.add(`${constants.pages.dist}/index.html`);
  uploadFilesSet.add(`${constants.pages.dist}/about/new.html`);
  uploadFilesSet.add(constants.feeds.dist);
}

// `src/documents/` 配下に変更がある場合 : ファイルコピーする
changedFiles
  .filter(sourceFilePath => sourceFilePath.includes(constants.documents.src))
  .forEach(sourceFilePath => {
    const distFilePath = sourceFilePath.replace(constants.documents.src, constants.documents.dist);
    copyFile(sourceFilePath, distFilePath);
    uploadFilesSet.add(distFilePath);
  });

// `src/pages/` 配下の HTML・Markdown 以外のファイルに変更がある場合 : 未来日のブログに関する画像などのみ除外する
changedFiles
  .filter(sourceFilePath => sourceFilePath.includes(constants.pages.src) && !['.html', '.md'].includes(path.extname(sourceFilePath)))
  .filter(sourceFilePath => {
    // 未来日のブログ関連のファイルは除外する
    const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
    const blogYear  = Number(match[1]);
    const blogMonth = Number(match[2]);
    const blogDate  = Number(match[3]);
    const isNotFutureFile = isNotFuture(blogYear, blogMonth, blogDate);
    if(!isNotFutureFile) console.log(`Filtered : Future Blog Asset … [${sourceFilePath}]`);
    return isNotFutureFile;
  })
  .forEach(sourceFilePath => {
    const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
    copyFile(sourceFilePath, distFilePath);
    uploadFilesSet.add(distFilePath);
  });

// `src/pages/` 配下の HTML・Markdown ファイルに変更がある場合 : 最終更新日・ブログのファイルパスが未来日のモノを除外する
changedFiles
  .filter(sourceFilePath => sourceFilePath.includes(constants.pages.src) && ['.html', '.md'].includes(path.extname(sourceFilePath)))
  .filter(sourceFilePath => {
    // 最終更新日が未来日のファイルを除外する (コレで未来日のブログも除外される)
    const text = fs.readFileSync(sourceFilePath, 'utf-8');
    const lastModifiedLine  = text.split('\n').find(line => line.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
    const lastModifiedMatch = lastModifiedLine.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
    const lastModifiedYear  = Number(lastModifiedMatch[2]);
    const lastModifiedMonth = Number(lastModifiedMatch[3]);
    const lastModifiedDate  = Number(lastModifiedMatch[4]);
    const isNotFutureFile   = isNotFuture(lastModifiedYear, lastModifiedMonth, lastModifiedDate);
    if(!isNotFutureFile) console.log(`Filtered : Future File … [${sourceFilePath}]`);
    return isNotFutureFile;
  })
  .filter(sourceFilePath => {
    // 上の処理で除外できているはずだが、念のためファイルパスでも未来日のブログ記事を除外する
    const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
    if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
    const blogYear  = Number(match[1]);
    const blogMonth = Number(match[2]);
    const blogDate  = Number(match[3]);
    const isNotFutureFile = isNotFuture(blogYear, blogMonth, blogDate);
    if(!isNotFutureFile) console.log(`Filtered : Future Blog File … [${sourceFilePath}] (Maybe Invalid Last-Modified)`);
    return isNotFutureFile;
  })
  .forEach(sourceFilePath => {
    const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
    if(sourceFilePath.endsWith('.html')) {
      buildHtml(sourceFilePath);
    }
    else {
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
    uploadFilesSet.add(distFilePath);
  });

if(!uploadFilesSet.size) return console.log('Upload Files Not Exist');

// サイトマップはアップロード対象があれば常に一緒にアップロードする
uploadFilesSet.add(constants.sitemap.dist);

// アップロード対象のディレクトリパス・ファイルパスの配列を作る
const filePaths = Array.from(uploadFilesSet).sort();
const directoryPaths = detectDirectoryPathsFromFilePaths(filePaths);
const uploadFilePaths = [...directoryPaths, ...filePaths];
console.log('Target File Paths :\n', filePaths);

// アップロード対象のファイルを FTP アップロードする
(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  console.log('FTP Upload : Succeeded');
})();
