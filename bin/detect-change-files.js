import childProcess from 'node:child_process';
import fs from 'node:fs';

import { constants } from '../lib/constants.js';

/*!
 * Git の差分ファイル一覧を表示する
 */

const result = childProcess.execFileSync('git', ['status', '--short', '--branch']).toString();
const filePaths = result
  .split('\n')
  .filter(line => !line.startsWith('## ') && line.trim())
  .map(line => line.slice(3))  // `--short` オプションで出力される行頭3文字の記号とスペースを除去しファイルパスのみにする
console.log(filePaths.join('\n'));

// 更新履歴用のリンク文字列を生成する
const pageLinks = filePaths
  .filter(filePath => filePath.startsWith(constants.src) && (filePath.endsWith('.html') || filePath.endsWith('.md')))
  .map(filePath => {
    // 成果物のルートパスを組み立てる
    const distRootPath = filePath
      .replace(constants.pages.src, '')
      .replace(constants.documents.src, '/documents')
      .replace('.md', '.html');
    
    const text = fs.readFileSync(filePath, 'utf-8');
    
    let title = '【不明】';
    const frontMatterMatch = text.match((/\ntitle\s*: (.*)/u));
    if(frontMatterMatch != null) {
      title = frontMatterMatch[1];
    }
    else {
      const titleElementMatch = text.match((/<title>(.*)<\/title>/u));
      if(titleElementMatch != null) title = titleElementMatch[1];
    }
    return `<a href="${distRootPath}">${title}</a>`;
  });
console.log('\n' + pageLinks.join('\n'));
