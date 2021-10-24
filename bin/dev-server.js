const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();

const buildCss = require('../lib/build-css');
const buildHtml = require('../lib/build-html');
const buildMarkdown = require('../lib/build-markdown');
const constants = require('../lib/constants');
const copyFile = require('../lib/copy-file');
const isExist = require('../lib/is-exist');

/*!
 * 開発サーバを起動する
 */

browserSync.init({
  server: constants.dist,
  port: 3000,
  watch: true,  // `dist/` ディレクトリの変更時に自動リロードする
  open: false,  // ブラウザを開かない
  middleware: [
    // 勝手に `/path/to/file.html` へのリンクを `/path/to/file/` でアクセスしようとしてエラーになりやがるので置換する
    (req, _res, next) => {
      if(isExist(`${constants.dist}${req.url}index.html`)) {
        req.url = `${req.url}index.html`;
      }
      else if(isExist(`${constants.dist}${req.url.replace((/\/$/u), '.html')}`)) {
        req.url = `${req.url.replace((/\/$/u), '.html')}`;
      }
      next();
    }
  ],
  files: [  // 変更検知時の処理を定義する
    {
      match: [`${constants.pages.src}/**/*`],
      // event : `add`・`change`・`unlink`・`addDir`・`unlinkDir`
      // sourdePath : ex. `src/pages/index.html`
      fn: (event, sourceFilePath) => {
        if(event === 'addDir') return;  // Do Nothing
        if(event === 'unlink') return unlinkFunc(sourceFilePath);
        if(event === 'unlinkDir') return unlinkDirFunc(sourceFilePath);
        
        // 以降 `add` or `change` のみ
        
        if(sourceFilePath.endsWith('.html')) {
          console.log(`Build HTML : [${sourceFilePath}]`);
          return buildHtml(sourceFilePath);
        }
        
        if(sourceFilePath.endsWith('.md')) {
          console.log(`Build Markdown : [${sourceFilePath}]`);
          buildMarkdown(sourceFilePath);
          buildForBlog(sourceFilePath);  // 必要に応じて Index ページもビルドする
          return;
        }
        
        // ビルド不要なファイルはコピーのみ
        const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
        copyFile(sourceFilePath, distFilePath);
      }
    },
    {
      match: [`${path.dirname(constants.styles.src)}/**/*`],
      fn: (event, sourceFilePath) => {
        console.log(`Build CSS : [${event}] [${sourceFilePath}]`)
        buildCss();
      }
    },
    {
      match: [constants.templates.src],
      fn: (event, sourceFilePath) => {
        // テンプレートファイルを更新時は全量ビルドが必要になるが、うまくファイル更新されないので諦める
        console.warn(`Warning : Template Changes Does Not Supported, So Do Nothing. Please Build All Manually … [${event}] [${sourceFilePath}]`);
      }
    }
  ]
});


// ================================================================================


/**
 * ファイルを削除する
 * 
 * @param {string} sourceFilePath 変更があったファイルパス
 */
function unlinkFunc(sourceFilePath) {
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
  try {
    fs.unlinkSync(distFilePath);
    console.log(`Remove File : [${distFilePath}]`);
  }
  catch(error) {
    console.warn(`Failed To Remove File [${distFilePath}]`, error);
  }
}

/**
 * ディレクトリを削除する
 * 
 * @param {string} sourceFilePath 変更があったディレクトリパス
 */
function unlinkDirFunc(sourceFilePath) {
  const distDirectoryPath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
  try {
    fs.rmdirSync(distDirectoryPath, { recursive: true });
    console.log(`Remove Directory : [${distDirectoryPath}]`);
  }
  catch(error) {
    console.warn(`Failed To Remove Directory [${distDirectoryPath}]`, error);
  }
}

/**
 * `/blog/YYYY/MM/DD-00.md` ファイルの更新時は `index.md` も更新する
 * 
 * @param {string} sourceFilePath 変更があったファイルパス
 */
function buildForBlog(sourceFilePath) {
  const match = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/[0-9]{2}-[0-9]{2}\.md/u));
  if(!match) return;
  
  console.log(`Build Index Pages For Blog`);
  const year  = match[1];
  const month = match[2];
  buildMarkdown(`${constants.pages.src}/blog/${year}/${month}/index.md`);
  buildMarkdown(`${constants.pages.src}/blog/${year}/index.md`);
  buildMarkdown(`${constants.pages.src}/blog/index.md`);
  buildHtml(`${constants.pages.src}/index.html`);
}
