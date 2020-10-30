const fs = require('fs');
const path = require('path');

const yaml = require('yaml');
const unified = require('unified');
const remarkParse = require('remark-parse');  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkSlug = require('remark-slug');
const remarkToc = require('remark-toc');
const remarkRehype = require('remark-rehype');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const log = require('./create-log')('BUILD_BLOG');
const makeDirectory = require('./make-directory');

// テンプレートファイルを読み込んでおく
const templateFilePath = path.resolve(__dirname, '../src/templates/templates.html');
const template = fs.readFileSync(templateFilePath, 'utf-8');

/**
 * 指定のブログファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/blog/` から指定する)
 */
module.exports = function buildBlog(sourceFilePath) {
  log('Build Blog : Start');
  
  // プロジェクトルートから対象のソースファイルのパスを特定する
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  log(`  Source [${resolvedSourceFilePath}]`);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  const html = build(source);
  
  // 出力先ファイルパスを作る
  const distFilePath = resolvedSourceFilePath.replace('src/blog', 'dist/blog').replace('.md', '.html');
  log(`  Dist [${distFilePath}]`);
  
  // 出力先ファイルのディレクトリがなければ作る
  makeDirectory(distFilePath);
  
  fs.writeFileSync(distFilePath, html, 'utf-8');
  log('Build Blog : Finished');
};

/**
 * テンプレートファイル内のプレースホルダに、ソースファイルの内容を当てはめて返す
 * 
 * @param {string} source ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} テンプレートファイルをベースにソースファイルの内容に置換した文字列
 * @throws Front Matter がない場合、置換に失敗した場合
 */
function build(source) {
  const frontMatter = extractFrontMatter(source);
  
  return template
    .replace(/>{{ ([^\s]+) }}</g, (_match, name) => {
      // テンプレートファイルで、終了タグ `>`・`{{ name }}`・開始タグ `<` が配置されている行
      // タグを含めて検索しているので、返す値の前後にはタグ `>`・`<` を必ず含めること
      log(`    Inline [${name}]`);
      
      // Front Matter から対象のデータを取得する
      const targetKey = (name === 'page-title') ? 'title' : name;
      const data = frontMatter[targetKey];
      // 対象のデータがなければエラーとする
      if(!data) {
        log(`      Error : Inline [${name}] Front Matter Key [${targetKey}] Not Found`);
        throw new Error(`Inline [${name}] Front Matter Key [${targetKey}] Not Found`);
      }
      
      // ページタイトルを置換する場合は ` - Neo's World` を付与する
      return '>' + data + (name === 'page-title' ? " - Neo's World<" : '<');
    })
    .replace((/\n(\s*){{ ([^\s]+) }}/g), (_match, indent, name) => {
      // テンプレートファイルで、改行・スペースの後 `{{ name }}` が配置されている行
      log(`    Block [${name}] : Indent [${indent.length}]`);
      
      // content : コンテンツの場合は Markdown パースした内容を利用する
      if(name === 'content') {
        const content = generateContent(source);
        return '\n' + content;
      }
      
      // Front Matter から対象のデータを取得する
      const data = frontMatter[name];
      // ソースファイルに対象データがなかった場合は、テンプレートファイルの `{{ name }}` の行を削除して終了する
      if(!data) {
        log(`      Front Matter Key [${name}] Not Found`);
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
            log(`      Error : Invalid Path Line [${line}]`);
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
}

/**
 * Markdown ファイルから Front Matter 部分を抽出する
 * 
 * @param {string} source ソース
 * @return {object} Front Matter の連想配列
 */
function extractFrontMatter(source) {
  const processor = unified()
    .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
    .use(remarkFrontmatter, [{ type: 'yaml', marker: '-', anywhere: false }])
    .use(remarkExtractFrontmatter, { yaml: yaml.parse, name: 'frontMatter' })
    .use(remarkRehype)
    .use(rehypeStringify);
  const result = processor.processSync(source);
  const frontMatter = result.data.frontMatter;
  log('    Extract Front Matter');
  return frontMatter;
}

/**
 * Markdown ファイルをパースして HTML を生成する
 * 
 * @param {string} source ソース
 * @return {string} HTML ソース
 */
function generateContent(source) {
  const processor = unified()
    .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
    .use(remarkFrontmatter)  // パースしておかないと Frontmatter の情報が HTML に出力されてしまう
    .use(remarkSlug)  // 見出しに ID を振る
    .use(remarkToc, {
      heading: '目次',  // '## 目次' と書くとその下に Table of Contents を出力してくれる
      tight: true
    })
    .use(remarkRehype, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
    .use(rehypePrism, { ignoreMissing: false })  // 存在しない言語名を書いた時にエラーにする (false)
    .use(rehypeAutolinkHeadings, {  // 見出し要素に Slug のパーマリンク要素を追加する
      behavior: 'wrap',  // 'prepend'・'append'・'wrap'・'before'・'after' で位置を選べる
      properties: {  // `a` 要素に付与する属性
        className: ['header-link']
      },
      content: {  // hast Node として `a` 要素の子要素を定義する
        type: 'text',
        value: '$'
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
    .use(rehypeFormat, { indent: 2, indentInitial: true });
  
  const result = processor.processSync(source);
  log('    Markdown Parsed');
  return result.contents;
}