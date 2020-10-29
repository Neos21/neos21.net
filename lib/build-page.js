const fs = require('fs');
const path = require('path');

const log = require('./create-log')('BUILD_PAGE');
const replaceTemplateHtml = require('./replace-template-html');

// テンプレートファイルを読み込んでおく
const templateFilePath = path.resolve(__dirname, '../src/templates/template-pages.html');
const template = fs.readFileSync(templateFilePath, 'utf-8');

/**
 * 指定のファイルをビルドし書き出す
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function buildPage(sourceFilePath) {
  log('Build Page : Start');
  
  // プロジェクトルートから対象のソースファイルのパスを特定する
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  log(`  Source [${resolvedSourceFilePath}]`);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  const replacedHtml = replaceTemplateHtml(template, source);
  
  // 出力先ファイルパスを作る
  const distFilePath = resolvedSourceFilePath.replace('src/pages', 'dist');
  log(`  Dist [${distFilePath}]`);
  
  // 出力先ファイルのディレクトリがなければ作る
  const distDirName = path.dirname(distFilePath);
  try {
    fs.statSync(distDirName);
  }
  catch(_error) {
    fs.mkdirSync(distDirName, { recursive: true });
  }
  
  fs.writeFileSync(distFilePath, replacedHtml, 'utf-8');
  log('Build Page : Finished');
};
