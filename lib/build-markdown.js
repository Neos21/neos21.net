const fs = require('fs');
const path = require('path');

const unified = require('unified');
const remarkParse = require('remark-parse');  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
const remarkFrontmatter = require('remark-frontmatter');
const remarkSlug = require('remark-slug');
const remarkToc = require('remark-toc');
const remarkRehype = require('remark-rehype');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const extractMarkdownFrontMatter = require('./extract-markdown-front-matter');
const replaceBlogLatests = require('./replace-blog-latests');
const listFiles = require('./list-files');
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
  
  const output = build(resolvedSourceFilePath, source);
  
  const distFilePath = resolvedSourceFilePath.replace('src/pages', 'dist').replace('.md', '.html');
  makeDirectory(distFilePath);
  fs.writeFileSync(distFilePath, output, 'utf-8');
};

/**
 * テンプレートファイル内のプレースホルダに、ソースファイルの内容を当てはめて返す
 * 
 * @param {string} rawSourceFilePath ソースファイルのパス
 * @param {string} rawSource ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} テンプレートファイルをベースにソースファイルの内容に置換した文字列
 * @throws Front Matter がない場合、置換に失敗した場合
 */
function build(rawSourceFilePath, rawSource) {
  const frontMatter = extractMarkdownFrontMatter(rawSource);
  
  // ソース側にあるブログ用のプレースホルダを Markdown 形式で置換しておく
  const source = replaceBlogPlaceholders(rawSourceFilePath, rawSource);
  
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
 * ソースファイル中にあるブログ用のプレースホルダを置換する
 * 
 * @param {string} rawSourceFilePath ソースファイルのパス
 * @param {string} rawSource ソースファイル (./src/pages/ 配下の Markdown) の内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
function replaceBlogPlaceholders(rawSourceFilePath, rawSource) {
  const replacedBlogLatests = replaceBlogLatests(rawSource, '', (post) => {
    return `- <time>${post.date}</time>  \n  [${post.title}](${post.href})`;
  }, '', 5);
  
  return replacedBlogLatests
    .replace((/{{ blog-list-years }}/), (_match) => {
      // `/blog/index.md` 用のプレースホルダ : 年ごとの記事一覧へのリンクリストを作る
      const yearIndexFilePaths = listFiles(path.resolve(__dirname, '../src/pages/blog'))
        .filter((filePath) => filePath.match((/\/blog\/[0-9]{4}\/index\.md/u)))  // 年ごとのインデックスファイルのみに絞り込む
        .sort()
        .reverse();  // 新しい順にする
      // `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const yearIndexesText = yearIndexFilePaths.map((filePath) => {
        const yearMonthText = filePath.replace((/.*\/blog\/([0-9]{4})\/.*/u), '<time datetime="$1-01-01">$1年</time>');
        return `- [${yearMonthText}](${filePath.replace((/.*\/src\/pages/u), '').replace('.md', '.html')})`;
      }).join('\n');
      return yearIndexesText;
    })
    .replace((/{{ blog-list-months }}/), (_match) => {
      // `/blog/YYYY/index.md` 用のプレースホルダ : 月ごとの記事一覧へのリンクリストを作る
      const currentYearMatch = rawSourceFilePath.match((/\/blog\/([0-9]{4})\//u));
      // ソースファイルパスから西暦が見つけられなかったので空文字で返す
      if(!currentYearMatch || !currentYearMatch[1]) { return ''; }
      
      const currentYear = currentYearMatch[1];
      // ソースファイルパスの西暦配下にある月ごとのインデックスファイルのみに絞り込む
      const monthIndexFilePaths = listFiles(path.resolve(__dirname, '../src/pages/blog/' + currentYear))
        .filter((filePath) => filePath.match(new RegExp('/blog/' + currentYear + '/[0-9]{2}/index.md', 'u')))
        .sort()
        .reverse();  // 新しい順にする
      // `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const monthIndexesText = monthIndexFilePaths.map((filePath) => {
        const yearMonthText = filePath.replace((/.*\/blog\/([0-9]{4})\/([0-9]{2})\/.*/u), '<time datetime="$1-$2-01">$1年$2月</time>');
        return `- [${yearMonthText}](${filePath.replace((/.*\/src\/pages/u), '').replace('.md', '.html')})`;
      }).join('\n');
      return monthIndexesText;
    })
    .replace((/{{ blog-list-dates }}/), (_match) => {
      // `/blog/YYYY/MM/index.md` 用のプレースホルダ : その月の記事一覧のリンクリストを作る
      const currentYearMonthMatch = rawSourceFilePath.match((/\/blog\/([0-9]{4}\/[0-9]{2})\//u));
      // ソースファイルパスから西暦と月が見つけられなかったので空文字で返す
      if(!currentYearMonthMatch || !currentYearMonthMatch[1]) { return ''; }
      
      const currentYearMonth = currentYearMonthMatch[1];  // 'YYYY/MM' 形式
      // 指定の月配下の記事ファイルのみに絞り込む
      const postFilePaths = listFiles(path.resolve(__dirname, '../src/pages/blog/' + currentYearMonth))
        .filter((filePath) => filePath.match(new RegExp('/blog/' + currentYearMonth + '/[0-9]{2}-[0-9]{2}.md', 'u')))
        .sort()
        .reverse();  // 新しい順にする
      // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const postsText = postFilePaths.map((filePath) => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = extractMarkdownFrontMatter(post);
        return `- <time>${postFrontMatter.created}</time>  \n  [${postFrontMatter.title}](${filePath.replace((/.*\/src\/pages/u), '').replace('.md', '.html')})`;
      }).join('\n');
      return postsText;
    });
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