const fs = require('fs');
const path = require('path');

/** Private : 'path' の1行を変換するための正規表現 */
const pathLineMatch = (/(.+?)\s(.*)/u);

/**
 * Private : ブロックのプレースホルダ向けの置換処理
 * 
 * @param {string} text 処理対象の文字列
 * @param {string} indent インデントのスペース
 * @return {string} インデントを付与し、前後に適切な改行が作れるようにする (空行は作らない)
 */
const adjustBlock = (text, indent) => {
  return `\n${text}`                    // 先頭に改行を追加する
    .replace((/\n$/u), '')              // 末尾の改行を消す
    .replace((/\n/gu), '\n' + indent);  // インデントを付与する
};

/** テンプレートファイルの内容 */
const template = fs.readFileSync(path.resolve(__dirname, '../src/templates/templates.html'), 'utf-8');

/**
 * テンプレートファイルからインラインのプレースホルダを抽出する正規表現
 * 
 * 終了タグ `>`・`{{ name }}`・開始タグ `<` と配置されている行を抽出する
 * タグ `>`・`<` を含めて検索しているので、返す値の前後には必ずタグ `>`・`<` を含めること
 */
const regExpInline = (/>{{ ([^\s]+) }}</g);

/**
 * テンプレートファイルからブロックのプレースホルダを抽出する正規表現
 * 
 * 改行・スペースの後に `{{ name }}` が配置されている行を抽出する
 */
const regExpBlock = (/\n(\s*){{ ([^\s]+) }}/g);

/**
 * インラインのプレースホルダ向けの置換処理
 * 
 * @param {object} frontMatter Front Matter
 * @param {string} name プレースホルダの名前。Front Matter に対応するキーが存在すること
 * @return {string} 置換後の文字列
 * @throws Front Matter に対応するキーがない場合
 */
const replaceInline = (frontMatter, name) => {
  // Front Matter から対象のデータを取得する
  const targetKey = (name === 'page-title') ? 'title' : name;
  const data = frontMatter[targetKey];
  if(!data) throw new Error(`Inline [${name}] Front Matter Key [${targetKey}] Not Found`);
  
  // トップページ以外のページタイトルを置換する場合は ` - Neo's World` を付与する
  return '>' + data + (name === 'page-title' && data !== "Neo's World" ? " - Neo's World<" : '<');
};

const replaceBlock = (frontMatter, indent, name) => {
  const data = frontMatter[name];
  // ソースファイルに対象データがなかった場合は、テンプレートファイルの `{{ name }}` の行を削除して終了する
  if(!data) return '';
  
  // path : 配列で `/PATH/TO/FILE.html Example Title` という並びで記載されているので HTML 変換する
  if(name === 'path') {
    const path = data.map(line => {
      if(!line.match(pathLineMatch)) throw new Error(`Invalid Path Line [${line}]`);
      return line.replace(pathLineMatch, '<li><a href="$1">$2</a></li>\n');
    }).join('');
    return adjustBlock(path, indent);
  }
  
  // head : 先頭にのみ空行を開ける
  if(name === 'head') {
    return '\n' + indent + adjustBlock(data, indent);
  }
  
  // それ以外 (現状ないが) : 空行を開けたりせず改行・インデントして挿入する
  return adjustBlock(data, indent);
}

/** HTML・Markdown のビルドに必要な共通処理 */
module.exports = {
  template,
  regExpInline,
  regExpBlock,
  replaceInline,
  replaceBlock
};
