const yaml = require('yaml');

const log = require('./create-log')('REPLACE_TEMPLATE_HTML');

/**
 * テンプレートファイル内のプレースホルダに、ソースファイルの内容を当てはめて返す
 * 
 * @param {string} template テンプレートファイル (./src/templates/ 配下の HTML) の内容
 * @param {string} source ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} テンプレートファイルをベースにソースファイルの内容に置換した文字列
 */
module.exports = function replaceTemplateHtml(template, source) {
  log('Replace Template HTML');
  
  // ソースファイルから Front Matter セクションを抽出する
  const frontMatterRegExp = (/^---\n((.|[\n])+)\n---\n\n/u);
  const frontMatterMatch = source.match(frontMatterRegExp);
  if(!frontMatterMatch || !frontMatterMatch[1]) {
    throw new Error('Front Matter Section Not Found');
  }
  
  const frontMatter = yaml.parse(frontMatterMatch[1]);
  return template
    .replace(/>{{ ([^\s]+) }}</g, (_match, name) => {
      // テンプレートファイルで、終了タグ `>`・`{{ name }}`・開始タグ `<` が配置されている行
      // タグを含めて検索しているので、返す値の前後にはタグ `>`・`<` を必ず含めること
      log(`  Inline [${name}]`);
      
      // Front Matter から対象のデータを取得する
      const targetKey = (name === 'page-title') ? 'title' : name;
      const data = frontMatter[targetKey];
      // 対象のデータがなければエラーとする
      if(!data) {
        log(`    Error : Inline [${name}] Front Matter Key [${targetKey}] Not Found`);
        throw new Error(`Inline [${name}] Front Matter Key [${targetKey}] Not Found`);
      }
      
      // トップページ以外のページタイトルを置換する場合は ` - Neo's World` を付与する
      return '>' + data + (name === 'page-title' && data !== "Neo's World" ? " - Neo's World<" : '<');
    })
    .replace((/\n(\s*){{ ([^\s]+) }}/g), (_match, indent, name) => {
      // テンプレートファイルで、改行・スペースの後 `{{ name }}` が配置されている行
      log(`  Block [${name}] : Indent [${indent.length}]`);
      
      // content : コンテンツの場合は FrontMatter セクションを除去した部分を利用する
      // インデントは開けず、前後に空行が開くようにしておく
      if(name === 'content') {
        const content = source.replace(frontMatterRegExp, '\n\n');
        return content;  // 手前に空行を付けておけば後ろには既に空行ができている
      }
      
      // Front Matter から対象のデータを取得する
      const data = frontMatter[name];
      // ソースファイルに対象データがなかった場合は、テンプレートファイルの `{{ name }}` の行を削除して終了する
      if(!data) {
        log(`   Front Matter Key [${name}] Not Found`);
        return '';
      }
      
      const replaceForBlock = (text) => {
        return `\n${text}`                    // 先頭に改行を追加する
          .replace((/\n$/u), '')              // 末尾の改行を消す
          .replace((/\n/gu), '\n' + indent);  // インデントを付与する
      };
      
      // path : 配列で `/PATH/TO/FILE.html Example Title` という並びで記載されているので HTML 変換する
      if(name === 'path') {
        const lineMatch = (/(.+?)\s(.*)/u);
        const path = data.map(line => {
          if(!line.match(lineMatch)) {
            log(`    Error : Invalid Path Line [${line}]`);
            throw new Error(`Invalid Path Line [${line}]`);
          }
          return line.replace(lineMatch, '<li><a href="$1">$2</a></li>\n');
        }).join('');
        return replaceForBlock(path);
      }
      
      // head : 先頭に空行を開ける
      if(name === 'head') {
        return '\n' + indent + replaceForBlock(data);
      }
      
      // それ以外 (現状ないが) : 空行を開けたりせず改行・インデントして挿入する
      return replaceForBlock(data);
    });
};
