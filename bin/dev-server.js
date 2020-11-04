const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();

const constants = require('../lib/constants');
const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');

const copyFile = require('../lib/copy-file');

/*!
 * 開発サーバを起動する
 */

browserSync.init({
  server: constants.dist,
  port: 3000,
  watch: true,  // `./dist/` ディレクトリの変更時に自動リロードする
  open: false,  // ブラウザを開かない
  files: [  // 変更検知時の処理を定義する
    {
      match: [
        `${constants.pages.src}/**/*`,
        `${path.dirname(constants.styles.src)}/**/*`
      ],
      // event : `add`・`change`・`unlink`・`addDir`・`unlinkDir`
      // sourdePath : ex. `src/pages/index.html`
      fn: (event, sourcePath) => {
        if(event === 'addDir') return;  // Do Nothing
        if(event === 'unlink') {
          const distFilePath = sourcePath.replace(constants.pages.src, constants.pages.dist);
          try {
            fs.unlinkSync(distFilePath);
          }
          catch(error) {
            console.warn(`Failed To Remove File [${distFilePath}]`, error);
          }
          return;
        }
        if(event === 'unlinkDir') {
          const distDirectoryPath = sourcePath.replace(constants.pages.src, constants.pages.dist);
          try {
            fs.rmdirSync(distDirectoryPath, { recursive: true });
          }
          catch(error) {
            console.warn(`Failed To Remove Directory [${distFilePath}]`, error);
          }
          return;
        }
        
        // 以降 `add` or `change` のみ
        if(sourcePath.endsWith('.css')) return buildCss();
        if(sourcePath.endsWith('.html')) return buildHtml(sourcePath);
        if(sourcePath.endsWith('.md')) return buildMarkdown(sourcePath);
        copyFile(sourcePath);  // ビルド不要なファイルはコピーのみ
      }
    },
    {
      match: [constants.templates.src],
      fn: (_event, _sourcePath) => {
        // FIXME : テンプレートファイルを更新時は全量ビルドが必要になるが、うまくファイル更新されないので諦める
        console.warn('WARNING : Template Changes Does Not Supported, So Do Nothing. Please Build All Manually');
      }
    }
  ]
});
