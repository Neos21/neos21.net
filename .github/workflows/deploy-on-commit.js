import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { buildHtml } from '../../lib/build-html.js';
import { buildMarkdown } from '../../lib/build-markdown.js';
import { constants } from '../../lib/constants.js';
import { copyFile } from '../../lib/copy-file.js';
import { isNotFuture } from '../../lib/is-not-future.js';
import { jstCurrentYear, zeroPadJstCurrentMonth, zeroPadJstCurrentDate } from '../../lib/jst-now.js';
import { listFiles } from '../../lib/list-files.js';
import { makeDirectory } from '../../lib/make-directory.js';

/*!
 * 対象のファイルをビルドしてアップロードする
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// `return` で中断するため即時関数を使用している
(() => {
  // 前 Step で JSON ファイルに書き出しておいた変更ファイル一覧を取得する
  // ファイルパスは `'src/pages/index.html'` のようにプロジェクトルートからの表記になっている
  // 対象ファイルが一つもない場合は空配列 `[]` が記載されている。必ず3ファイルとも存在しないとこのスクリプトは動作しない
  const addedModified = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../temp/added_modified.json'), 'utf-8'));
  const renamed       = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../temp/renamed.json'       ), 'utf-8'));
  const removed       = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../temp/removed.json'       ), 'utf-8'));  // 削除されたファイルがあるかどうかの確認だけ
  if(removed.length) console.log('Removed Files Exist. Please Remove Manually');
  
  // `src/` 配下の変更ファイルのみ扱う
  const rawChangedFiles = [...addedModified, ...renamed].filter(sourceFilePath => sourceFilePath.includes(constants.src));
  if(!rawChangedFiles.length) return console.log('Changed Files Not Exist. Aborted');
  
  // `src/templates/templates.html` の変更がある場合は一切のアップロードを行わないこととする
  // 全量アップロードが必要になり、GitHub Actions 内での全量アップは自信がないので手作業にする
  const isTemplateChanged = rawChangedFiles.some(sourceFilePath => sourceFilePath.includes(constants.templates.src));
  if(isTemplateChanged) return console.log('Templates Changed! Please Upload Manually. Aborted');
  
  // `last-modified` が今日日付のファイルを追加する
  // 
  // `daily-deploy.js` の一部コードを流用
  // 既に今日日付のブログ記事を予約コミットしてある状態で Index や News YAML に変更が入ると
  // `rawChangedFiles` にはそのブログ記事がないのでリンク先が 404 なリンクが生まれてしまう
  // そこで変更されたファイルとは別に今日日付のファイルを追加しビルド・公開する
  // 
  // この対応により、その後に `daily-deploy.yaml` が実行されると
  // 既に全てがアップロードされているので `gh-pages` ブランチに変更が発生しないため
  // `Deploy To GitHub Pages` Step が失敗扱いになってしまうことがあるが、やむなし
  // ================================================================================
  
  // 最終更新日が今日に設定されているファイルを取得する
  const today = `${jstCurrentYear}-${zeroPadJstCurrentMonth}-${zeroPadJstCurrentDate}`;
  const todaySourceFilePaths = listFiles(constants.pages.src).filter(sourceFilePath => {
    if(['.html', '.md'].includes(path.extname(sourceFilePath))) {
      // HTML と Markdown : `last-modified` を確認する
      const text = fs.readFileSync(sourceFilePath, 'utf-8');
      return text.split('\n').find(line => line.match(new RegExp(`^last-modified(\\s*): ${today}`, 'u')));
    }
    else {
      // ブログの画像ファイルなどを取得する
      const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
      if(!match) return false;  // マッチしなかった資材はアップロード対象にしない
      const date = `${match[1]}-${match[2]}-${match[3]}`;
      return date === today;
    }
  });
  
  // 変更があったファイルとマージし重複を消す
  const changedFiles = Array.from(new Set([...rawChangedFiles, ...todaySourceFilePaths]));
  
  // アップロード対象のファイルを特定して追加していく
  // ================================================================================
  
  // 重複を除去するため一旦 Set を使う
  const uploadFilesSet = new Set();
  
  // CSS はビルド済・変更がある場合
  if(changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.styles.src))) {
    console.log('Update : CSS');
    uploadFilesSet.add(constants.styles.dist);
  }
  
  // News YAML に変更がある場合 : News を使用するページをビルドし追加する・Atom フィードはビルド済なので対象追加のみ
  // 未来日の更新履歴を追加しただけの場合も取り込まれてしまうが、やむなし (未来日のフィードは除外してビルドするので影響はない)
  if(changedFiles.some(sourceFilePath => sourceFilePath.includes(constants.news.src))) {
    console.log('Update : News YAML … /index.html・/about/new.html・/feeds.xml');
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
      console.log(`Update : Documents … [${sourceFilePath}]`);
      const distFilePath = sourceFilePath.replace(constants.documents.src, constants.documents.dist);
      copyFile(sourceFilePath, distFilePath);
      uploadFilesSet.add(distFilePath);
    });
  
  // `src/pages/` 配下の HTML・Markdown ファイルに変更がある場合 : 最終更新日・ブログのファイルパスが未来日のモノを除外する
  changedFiles
    .filter(sourceFilePath => {
      // `src/pages/` 配下の HTML・Markdown ファイルのみ
      if(!sourceFilePath.includes(constants.pages.src)) return false;
      if(!['.html', '.md'].includes(path.extname(sourceFilePath))) return false;
      
      // 最終更新日が未来日のファイルを除外する (コレで未来日のブログも除外される)
      const text = fs.readFileSync(sourceFilePath, 'utf-8');
      const lastModifiedLine  = text.split('\n').find(line => line.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
      const lastModifiedMatch = lastModifiedLine.match((/^last-modified(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
      const lastModifiedYear  = Number(lastModifiedMatch[2]);
      const lastModifiedMonth = Number(lastModifiedMatch[3]);
      const lastModifiedDate  = Number(lastModifiedMatch[4]);
      if(!isNotFuture(lastModifiedYear, lastModifiedMonth, lastModifiedDate)) return false;
      
      // 上の処理で除外できているはずだが、念のためファイルパスでも未来日のブログ記事を除外する
      const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
      if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
      const blogYear  = Number(match[1]);
      const blogMonth = Number(match[2]);
      const blogDate  = Number(match[3]);
      if(!isNotFuture(blogYear, blogMonth, blogDate)) return false;
      
      return true;
    })
    .forEach(sourceFilePath => {
      const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
      if(sourceFilePath.endsWith('.html')) {
        console.log(`Update : HTML … [${sourceFilePath}]`);
        buildHtml(sourceFilePath);
      }
      else {
        console.log(`Update : Markdown … [${sourceFilePath}]`);
        buildMarkdown(sourceFilePath);
      
        // `/blog/YYYY/MM/DD-00.md` ファイルの更新時は `index.md` と Atom フィードもアップロード対象にする
        const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/[0-9]{2}-[0-9]{2}\.md/u));
        if(match) {
          const year  = match[1];
          const month = match[2];
          console.log(`Update : Markdown Blog Indexes … [${sourceFilePath}] [${year}-${month}]`);
          buildMarkdown(`${constants.pages.src}/blog/${year}/${month}/index.md`);
          buildMarkdown(`${constants.pages.src}/blog/${year}/index.md`);
          buildMarkdown(`${constants.pages.src}/blog/index.md`);
          buildHtml(`${constants.pages.src}/index.html`);
          uploadFilesSet.add(`${constants.pages.dist}/blog/${year}/${month}/index.html`);
          uploadFilesSet.add(`${constants.pages.dist}/blog/${year}/index.html`);
          uploadFilesSet.add(`${constants.pages.dist}/blog/index.html`);
          uploadFilesSet.add(`${constants.pages.dist}/index.html`);
          uploadFilesSet.add(constants.feeds.dist);
        }
      }
      uploadFilesSet.add(distFilePath);
    });
  
  // `src/pages/` 配下の HTML・Markdown 以外の画像ファイルなどに変更がある場合 : 未来日のブログに関する画像などのみ除外する
  changedFiles
    .filter(sourceFilePath => {
      // `src/pages/` 配下の HTML・Markdown 以外の画像ファイルなどのみ
      if(!sourceFilePath.includes(constants.pages.src)) return false;
      if(['.html', '.md'].includes(path.extname(sourceFilePath))) return false;
      
      // 未来日のブログ関連のファイルは除外する
      const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
      if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
      const blogYear  = Number(match[1]);
      const blogMonth = Number(match[2]);
      const blogDate  = Number(match[3]);
      if(!isNotFuture(blogYear, blogMonth, blogDate)) return false;
      
      return true;
    })
    .forEach(sourceFilePath => {
      console.log(`Update : Pages Asset … [${sourceFilePath}]`);
      const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
      copyFile(sourceFilePath, distFilePath);
      uploadFilesSet.add(distFilePath);
    });
  
  if(!uploadFilesSet.size) return console.log('Upload Files Not Exist');
  
  // サイトマップはアップロード対象があれば常に一緒にアップロードする
  buildMarkdown(`${constants.pages.src}/about/sitemap.md`);
  uploadFilesSet.add(`${constants.pages.dist}/about/sitemap.html`);
  uploadFilesSet.add(constants.sitemap.dist);
  
  // アップロード対象のファイルパスの配列を作る
  const filePaths = Array.from(uploadFilesSet).sort();
  console.log('Target File Paths :\n', filePaths);
  
  // `./temp/upload.json` ファイルが存在すれば後続の GitHub Actions Step が実行されるようにしているのでファイルを書き出しておく
  makeDirectory(path.resolve(__dirname, '../../temp'));  // 手前の Step で作成済だがテストしやすくするためにも入れておく
  fs.writeFileSync(path.resolve(__dirname, '../../temp/upload.json'), JSON.stringify(filePaths, null, '  ') + '\n', 'utf-8');
  console.log('Deploy On Commit : Succeeded');
})();
