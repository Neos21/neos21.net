import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { constants } from './constants.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** Private : Front Matter の `path` プロパティの配列1要素から、ルート相対パスとページ名を抽出するための正規表現 */
const pathLineMatch = (/(.+?)\s(.*)/u);

/**
 * Private : ブロック・プレースホルダ向けの汎用置換処理
 * 
 * @param {string} text 処理対象の文字列
 * @param {string} indent インデントのスペース
 * @return {string} インデントを付与し、前後に適切な改行が作れるようにする (空行は作らない)
 */
const adjustBlock = (text, indent) => {
  return `\n${text}`                    // 先頭に改行を追加する
    .replace((/\n$/u), '')              // 末尾の改行を消す
    .replace((/\n/gu), `\n${indent}`);  // インデントを付与する
};

/** テンプレートファイルの内容 */
const template = fs.readFileSync(path.resolve(__dirname, `../${constants.templates.src}`), 'utf-8');

/**
 * タグ内のインライン・プレースホルダを抽出する正規表現
 * 
 * 終了タグ `>`・`{{ name }}`・開始タグ `<` と配置されている行を抽出する
 * タグ `>`・`<` を含めて検索しているので、返す値の前後には必ずタグ `>`・`<` を含めること
 */
const regExpInlineTag = (/>{{ ([^\s]+) }}</g);

/**
 * 属性内のインライン・プレースホルダを抽出する正規表現
 * 
 * 属性名の後ろ `="`・`{{ name }}`・属性値の後ろ `">` と配置されている行を抽出する
 * 属性記法と閉じタグ `="`・`">` を含めて検索しているので、返す値の前後には必ず `="`・`">` を含めること
 */
const regExpInlineAttribute = (/="{{ ([^\s]+) }}">/g);

/**
 * テンプレートファイルからブロックのプレースホルダを抽出する正規表現
 * 
 * 改行・スペースの後に `{{ name }}` が配置されている行を抽出する
 */
const regExpBlock = (/\n(\s*){{ ([^\s]+) }}/g);

/**
 * タグ内のインライン・プレースホルダ向けの置換処理 : 現状 `{{ page-title }}` のみ
 * 
 * @param {object} frontMatter Front Matter
 * @param {string} name プレースホルダの名前。Front Matter に対応するキーが存在すること
 * @return {string} 置換後の文字列
 * @throws Front Matter に対応するキーがない場合
 */
const replaceInlineTag = (frontMatter, name) => {
  // Front Matter から対象のデータを取得する
  const targetKey = (name === 'page-title') ? 'title' : name;
  const data = frontMatter[targetKey];
  if(!data) throw new Error(`Inline Tag [${name}] Front Matter Key [${targetKey}] Not Found`);
  
  // トップページ以外のページタイトルを置換する場合はサイト名を後ろに付与する
  return '>' + data + (name === 'page-title' && data !== constants.siteName ? ` - ${constants.siteName}<` : '<');
};

/**
 * 属性内のインライン・プレースホルダ向けの置換処理 : 現状 `{{ page-title }}` と `{{ canonical }}`
 * 
 * @param {object} frontMatter Front Matter
 * @param {string} name プレースホルダの名前。Front Matter に対応するキーが存在すること
 * @return {string} 置換後の文字列
 * @throws Front Matter に対応するキーがない場合
 */
const replaceInlineAttribute = (frontMatter, name) => {
  // Front Matter から対象のデータを取得する
  const targetKey = (name === 'page-title') ? 'title' : name;
  const data = frontMatter[targetKey];
  if(!data) throw new Error(`Inline Attribute [${name}] Front Matter Key [${targetKey}] Not Found`);
  
  // トップページ以外のページタイトルを置換する場合はサイト名を後ろに付与する
  return '="' + data + (name === 'page-title' && data !== constants.siteName ? ` - ${constants.siteName}">` : '">');
};

/**
 * ブロック・プレースホルダ向けの置換処理
 * 
 * @param {object} frontMatter Front Matter
 * @param {string} indent プレースホルダの手前にあったインデントスペースの文字列
 * @param {string} name プレースホルダの名前。Front Matter に対応するキーが存在すること
 * @return {string} 置換後の文字列
 */
const replaceBlock = (frontMatter, indent, name) => {
  // date : Front Matter に header-date: true の記述があれば、created の値を利用する
  if(name === 'date') {
    if(frontMatter['header-date'] !== true) return '';
    const dateData = frontMatter['created'];
    if(!dateData) return '';
    const dateLine = `<div id="header-date"><time>${dateData}</time></div>`;
    return adjustBlock(dateLine, indent);
  }
  
  const data = frontMatter[name];
  
  // path : 配列で `/PATH/TO/FILE.html Example Title` という並びで記載されているので HTML 変換する
  if(name === 'path') {
    if(!data) throw new Error(`Block [${name}] Front Matter Key [${name}] Not Found`);
    const path = data.map(line => {
      if(!line.match(pathLineMatch)) throw new Error(`Invalid Path Line [${line}]`);
      return line.replace(pathLineMatch, '<li><a href="$1">$2</a></li>');
    }).join('\n');
    return adjustBlock(path, indent);
  }
  
  // 以降のプロパティは任意・ソースファイルに対象データがなかった場合はテンプレートファイルの `{{ name }}` の行を削除して終了する
  if(!data) return '';
  
  // 先頭に空行を開ける
  // head : `</head>` との間には空行はできない
  // description: : 後続の contents との間には空行ができる
  if(['head', 'description'].includes(name)) return `\n${indent}${adjustBlock(data, indent)}`;
  
  // それ以外 (現状ないが) : 空行を開けたりせず改行・インデントして挿入する
  return adjustBlock(data, indent);
};

/** HTML・Markdown のビルドに必要な共通処理 */
export {
  template,
  regExpInlineTag,
  regExpInlineAttribute,
  regExpBlock,
  replaceInlineTag,
  replaceInlineAttribute,
  replaceBlock
};
