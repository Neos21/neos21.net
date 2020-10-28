const fs = require('fs');

const buildPage = require('./build-page');

/**
 * デバッグログ出力する
 * 
 * @param {string} text テキスト
 */
function log(text) {
  if(process.env.DEBUG || process.env.DEBUG_BUILD_ALL_PAGES) {
    console.log(text);
  }
}

/**
 * 指定のディレクトリパス配下のファイルを全て列挙する
 * 
 * @param {string} dir ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ファイルパスの配列
 */
function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(dirent => {
    const name = `${dir}/${dirent.name}`;
    return dirent.isFile() ? [name] : listFiles(name);
  });
};

/**
 * ./src/pages/ 配下の全ての HTML ファイルをビルドする
 */
module.exports = () => {
  log('Build All Pages');
  
  const htmlFileNames = listFiles('src/pages').filter(fileName => fileName.endsWith('.html'));
  htmlFileNames.forEach((htmlFileName) => {
    try {
      //log(`  [${htmlFileName}]`);
      buildPage(htmlFileName);
    }
    catch(error) {
      log(`  Failed To Build [${htmlFileName}]`);
      log(error);
    }
  });
};
