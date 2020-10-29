const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();
const log = require('../lib/create-log')('START_DEV_SERVER');
const buildPage = require('../lib/build-page');

/*!
 * 開発サーバを起動する
 */

log('Start Dev Server : Start');

// ./dist/ ディレクトリがなさそうなら全量ビルドする
try {
  fs.statSync(path.resolve(__dirname, '../dist'));
}
catch(_error) {
  require('./build-pages-all');
  require('./copy-pages-assets');
}

// 開発サーバを起動する
browserSync.init({
  // ./dist/ ディレクトリを表示する
  server: path.resolve(__dirname, '../dist'),
  // ./dist/ ディレクトリの変更時に自動リロードする
  watch: true,
  // 変更検知時の処理を定義する TODO : 現状 ./src/pages/ の HTML の変更しか見ていない
  files: [
    {
      match: [path.resolve(__dirname, '../src/pages/**/*.html')],
      fn: async (event /* 'add'・'change'・'unlink' */, fileName /* ex. 'src/pages/index.html' */) => {
        if(['add', 'change'].includes(event)) {
          buildPage(fileName);
          return log(`  [${fileName}] Build`);
        }
        
        const distFileName = fileName.replace('src/pages', 'dist');
        await fs.promises.unlink(distFileName).catch(error => { log('  Failed To Remove'); log(error); });
        log(`  [${distFileName}] Removed`);
      }
    }
  ]
});
