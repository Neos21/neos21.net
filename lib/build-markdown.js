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

const templateReplacers = require('./template-replacers');
const makeDirectory = require('./make-directory');

// Markdown をパース → Slug・ToC 付与 → HTML 変換 → Prism.js・パーマリンク付与 → フォーマット
const processor = unified()
  .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
  .use(remarkFrontmatter)  // パースしておかないと Front Matter の情報が HTML に出力されてしまう
  .use(remarkSlug)  // 見出しに ID を振る
  .use(remarkToc, { heading: '目次', tight: true })  // '## 目次' と書くとその下に Table of Contents を出力してくれる
  .use(remarkRehype, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
  .use(rehypePrism, { ignoreMissing: false })  // 存在しない言語名を書いた時にエラーにする (false)
  .use(rehypeAutolinkHeadings, {  // 見出し要素に Slug のパーマリンク要素を追加する
    behavior: 'prepend',  // 'prepend'・'append'・'wrap'・'before'・'after' で位置を選べる
    properties: {  // `a` 要素に付与する属性
      className: ['header-link']
    },
    content: {  // hast Node として `a` 要素の子要素を定義する
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['header-link-mark']
      },
      children: []
    }
  })
  .use(rehypeStringify, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
  .use(rehypeFormat, { indent: 2, indentInitial: true });

/**
 * 指定の Markdown ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function buildMarkdown(sourceFilePath) {
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  const output = build(source);
  
  const distFilePath = resolvedSourceFilePath.replace('src/pages', 'dist').replace('.md', '.html');
  makeDirectory(distFilePath);
  fs.writeFileSync(distFilePath, output, 'utf-8');
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
  return templateReplacers.template
    .replace(templateReplacers.regExpInline, (_match, name) => {
      return templateReplacers.replaceInline(frontMatter, name);
    })
    .replace(templateReplacers.regExpBlock, (_match, indent, name) => {
      if(name === 'contents') {
        return generateContents(source);
      }
      
      return templateReplacers.replaceBlock(frontMatter, indent, name);
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
  return frontMatter;
}

/**
 * Markdown ファイルをパースしてコンテンツ部分を生成する
 * 
 * @param {string} source ソース
 * @return {string} HTML ソース
 */
function generateContents(source) {
  const result = processor.processSync(source);
  return '\n' + result.contents;
}