const fs = require('fs');
const path = require('path');

const yaml = require('yaml');
const unified = require('unified');
const rehypeParse = require('rehype-parse');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('rehype-toc');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const templateReplacers = require('./template-replacers');
const makeDirectory = require('./make-directory');

// Front Matter 部分を抽出する正規表現
const frontMatterRegExp = (/^---\n((.|[\n])+)\n---\n\n/u);
// rehype-toc を ol ではなく ul 要素でレンダリングするための置換処理
const replaceToC = (children) => {
  children.forEach(child => {
    if(child.type === 'element' && child.tagName === 'ol') child.tagName = 'ul';
    if(child.children) replaceToC(child.children);
  });
};
// HTML をパース → Slug・ToC 付与 → Prism.js・パーマリンク付与 → 再フォーマット
const processorWithToC = unified()
  .use(rehypeParse, { fragment: true })  // html・head・body 要素を自動付与しない
  .use(rehypeSlug)
  .use(rehypeToc, {  // remark-toc と違って HTML の先頭に固定で配置される
    nav: false,
    cssClasses: {
      toc: '',
      list: '',
      listItem: '',
      link: ''
    },
    customizeTOC: (toc) => { replaceToC([toc]); }
  })
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
// HTML をパース → Slug 付与 (ToC は付与しない) → Prism.js・パーマリンク付与 → 再フォーマット
const processorWithoutToC = unified()
  .use(rehypeParse, { fragment: true })  // html・head・body 要素を自動付与しない
  .use(rehypeSlug)
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
 * 指定の HTML ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function buildHtml(sourceFilePath) {
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  const output = build(source);
  
  const resolvedDistFilePath = resolvedSourceFilePath.replace('src/pages', 'dist');
  makeDirectory(resolvedDistFilePath);
  fs.writeFileSync(resolvedDistFilePath, output, 'utf-8');
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
      if(name === 'content') {
        return generateContent(source, frontMatter);
      }
      
      return templateReplacers.replaceBlock(frontMatter, indent, name);
    });
}

/**
 * HTML ファイルから Front Matter 部分を抽出する
 * 
 * @param {string} source ソース
 * @return {object} Front Matter の連想配列
 */
function extractFrontMatter(source) {
  const frontMatterMatch = source.match(frontMatterRegExp);
  if(!frontMatterMatch || !frontMatterMatch[1]) {
    console.log(source);
    throw new Error('Front Matter Section Not Found');
  }
  const frontMatter = yaml.parse(frontMatterMatch[1]);
  return frontMatter;
}

/**
 * HTML ファイルから余分な部分を除去してコンテンツ部分を生成する
 * 
 * @param {string} source ソース
 * @param {object} frontMatter Front Matter
 * @return {string} HTML ソース
 */
function generateContent(source, frontMatter) {
  const html = source.replace(frontMatterRegExp, '');
  const processor = (frontMatter.toc === false) ? processorWithoutToC : processorWithToC;
  const result = processor.processSync(html);
  return '\n' + result.contents;
}
