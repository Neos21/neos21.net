const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();
const log = require('../lib/create-log')('START_DEV_SERVER');
const buildPage = require('../lib/build-page');
const buildCss = require('../lib/build-css');
const copyFile = require('../lib/copy-file');

/*!
 * 開発サーバを起動する
 */
log('Start Dev Server : Start');

// 開発サーバを起動する
browserSync.init({
  // ./dist/ ディレクトリを表示する
  server: path.resolve(__dirname, '../dist'),
  // ./dist/ ディレクトリの変更時に自動リロードする
  watch: true,
  // ブラウザを開かない
  open: false,
  // 変更検知時の処理を定義する TODO : 現状 ./src/pages/ の HTML の変更しか見ていない
  files: [
    {
      match: [
        path.resolve(__dirname, '../src/pages/**/*'),
        path.resolve(__dirname, '../src/styles/**/*')
      ],
      fn: async (event /* 'add'・'change'・'unlink'・'addDir'・'unlinkDir' */, sourcePath /* ex. 'src/pages/index.html' */) => {
        if(event === 'addDir') {
          return;  // Do Nothing
        }
        if(event === 'unlink') {
          const distFilePath = sourcePath.replace('src/pages', 'dist');
          return await fs.promises.unlink(distFilePath)
            .catch((error) => console.warn(`  Failed To Remove File [${distFilePath}]`, error));
        }
        if(event === 'unlinkDir') {
          const distDirectoryPath = sourcePath.replace('src/pages', 'dist');
          return await fs.promises.rmdir(distDirectoryPath, { recursive: true })
            .catch(error => console.warn(`  Failed To Remove Directory [${distFilePath}]`, error));
        }
        
        // 'add' or 'change' Only
        if(sourcePath.endsWith('.html')) {
          buildPage(sourcePath);
          return log(`  Build HTML [${sourcePath}]`);
        }
        if(sourcePath.endsWith('.css')) {
          const distFilePath = sourcePath.replace('src/styles', 'dist').replace('index.css', 'styles.css');
          buildCss(sourcePath, distFilePath);
          return log(`  Build CSS [${sourcePath}]`);
        }
        
        // TODO : sourcePath.endsWith('.md'))
        
        copyFile(sourcePath);
        log(`  Copy File [${sourcePath}]`);
      }
    },
    {
      match: [path.resolve(__dirname, '../src/templates/**/*.html')],
      fn: (_event, _sourcePath) => {
        // build-pages-all.js を module.exports しておいても ./dist/ にうまく反映されない
        // ビルド処理自体は失敗していないので、このイベント内で大量ファイルを更新するのがうまくいかない様子・諦める
        console.warn('  WARNING : Template Changes Does Not Supported, So Do Nothing. Please Build All Manually');
      }
    }
  ]
});
