import fs  from 'node:fs';
import path  from 'node:path';
import url from 'node:url';

import { buildHtml } from '../../lib/build-html.js';
import { buildMarkdown } from '../../lib/build-markdown.js';
import { constants } from '../../lib/constants.js';
import { copyFile } from '../../lib/copy-file.js';
import { jstCurrentYear, zeroPadJstCurrentMonth, zeroPadJstCurrentDate } from '../../lib/jst-now.js';
import { listFiles } from '../../lib/list-files.js';
import { makeDirectory } from '../../lib/make-directory.js';

/*!
 * `last-modified` が今日日付のファイルをビルドしてアップロードする
 * 
 * - 対象外
 *   - CSS の変更
 *   - `src/documents/` 配下
 *   - `src/pages/` 配下、ブログ以外の画像ファイルなど (新規ファイルなのか特定ができないため)
 * - ブログと静的ページの予約投稿に対応するのみ
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// `return` で中断するため即時関数を使用している
(() => {
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
  
  if(!todaySourceFilePaths.length) return console.log('Maybe There Was No Assets Today. Aborted');
  console.log('Today Source Files :\n', todaySourceFilePaths);
  
  // 重複を除去するため一旦 Set を使う
  const uploadFilesSet = new Set();
  
  // 更新を通知するためトップ・更新履歴・サイトマップページと Atom フィード・サイトマップを対象にする
  buildHtml(`${constants.pages.src}/index.html`);
  buildHtml(`${constants.pages.src}/about/new.html`);
  buildMarkdown(`${constants.pages.src}/about/sitemap.md`);
  uploadFilesSet.add(`${constants.pages.dist}/index.html`);
  uploadFilesSet.add(`${constants.pages.dist}/about/new.html`);
  uploadFilesSet.add(`${constants.pages.dist}/about/sitemap.html`);
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
  
  // アップロード対象のファイルパスの配列を作る
  const filePaths = Array.from(uploadFilesSet).sort();
  console.log('Target File Paths :\n', filePaths);
  
  // `./temp/upload.json` ファイルが存在すれば後続の GitHub Actions Step が実行されるようにしているのでファイルを書き出しておく
  makeDirectory(path.resolve(__dirname, '../../temp'));
  fs.writeFileSync(path.resolve(__dirname, '../../temp/upload.json'), JSON.stringify(filePaths, null, '  ') + '\n', 'utf-8');
  console.log('Daily Deploy : Succeeded');
})();
