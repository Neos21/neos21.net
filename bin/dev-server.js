const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();

const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');

const copyFile = require('../lib/copy-file');

/*!
 * 開発サーバを起動する : TODO : 見直し
 */

browserSync.init({
  server: path.resolve(__dirname, '../dist'),  // `./dist/` ディレクトリを表示する
  port: 3000,
  watch: true,  // `./dist/` ディレクトリの変更時に自動リロードする
  open: false,  // ブラウザを開かない
  files: [  // 変更検知時の処理を定義する
    {
      match: [path.resolve(__dirname, '../src/pages/**/*')],
      // event : 'add'・'change'・'unlink'・'addDir'・'unlinkDir'
      // sourdePath : ex. 'src/pages/index.html'
      fn: async (event, sourcePath) => {
        if(event === 'addDir') return;  // Do Nothing
        if(event === 'unlink') {
          const distFilePath = sourcePath.replace('src/pages', 'dist');
          return await fs.promises.unlink(distFilePath).catch(error => console.warn(`Failed To Remove File [${distFilePath}]`, error));
        }
        if(event === 'unlinkDir') {
          const distDirectoryPath = sourcePath.replace('src/pages', 'dist');
          return await fs.promises.rmdir(distDirectoryPath, { recursive: true }).catch(error => console.warn(`Failed To Remove Directory [${distFilePath}]`, error));
        }
        
        // 以降 'add' or 'change' のみ
        if(sourcePath.endsWith('.css')) return buildCss();
        if(sourcePath.endsWith('.html')) return buildHtml(sourcePath);
        if(sourcePath.endsWith('.md')) return buildMarkdown(sourcePath);
        
        copyFile(sourcePath);  // ビルド不要なファイルはコピーのみ
      }
    },
    {
      match: [path.resolve(__dirname, '../src/templates/templates.html')],
      fn: (_event, _sourcePath) => {
        // FIXME : テンプレートファイルを更新時は全量ビルドが必要になるが、うまくファイル更新されないので諦める
        console.warn('WARNING : Template Changes Does Not Supported, So Do Nothing. Please Build All Manually');
      }
    }
  ]
});
