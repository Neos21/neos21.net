const fs = require('fs');
const path = require('path');

const cleanCss = require('clean-css');

const log = require('./create-log')('BUILD_CSS');
const makeDirectory = require('./make-directory');

/**
 * CSS ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 * @param {string} distFilePath 出力先ファイルのパス (`dist/` から指定する)
 */
module.exports = function buildCss(sourceFilePath, distFilePath) {
  log('Build CSS : Start');
  
  // プロジェクトルートから対象のソースファイルのパスを特定する
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  log(`  Source [${resolvedSourceFilePath}]`);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  // @import が相対パスで解釈できないため一時的に移動する
  // Note : https://github.com/jakubpawlowicz/clean-css/issues/1029
  const beforeCwd = process.cwd();
  const stylesDirectory = path.resolve(__dirname, '../src/styles');
  process.chdir(stylesDirectory);
  
  const output = new cleanCss({
    inline: ['all']
  }).minify(source);
  
  // 元のパスに戻す
  process.chdir(beforeCwd);
  
  if(output.warnings.length) { console.warn('  Clearn CSS Warnings', output.warnings); }
  if(output.errors.length) { console.warn('  Clean CSS Errors', output.errors); }
  
  const minifiedCss = output.styles;
  
  // 出力先ファイルパスを作る
  const resolvedDistFilePath = path.resolve(distFilePath);
  log(`  Dist [${resolvedDistFilePath}]`);
  
  // 出力先ファイルのディレクトリがなければ作る
  makeDirectory(resolvedDistFilePath);
  
  fs.writeFileSync(resolvedDistFilePath, minifiedCss, 'utf-8');
  log('Build CSS : Finished');
};
