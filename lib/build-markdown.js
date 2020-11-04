const fs = require('fs');
const path = require('path');

const unified = require('unified');
const remarkParse = require('remark-parse');  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
const remarkFrontmatter = require('remark-frontmatter');
const remarkSlug = require('remark-slug');
const remarkToc = require('remark-toc');
const remarkRehype = require('remark-rehype');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const constants = require('./constants');
const markdownExtractFrontMatter = require('./markdown-extract-front-matter');
const replaceBlogLatests = require('./replace-blog-latests');
const listFiles = require('./list-files');
const templateReplacers = require('./template-replacers');
const makeDirectory = require('./make-directory');

/** Processor : Markdown をパース → Slug・ToC 付与 → HTML 変換 → Prism.js・パーマリンク付与 → フォーマット */
const processor = unified()
  .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
  .use(remarkFrontmatter)  // パースしておかないと Front Matter の情報が HTML に出力されてしまう
  .use(remarkSlug)  // 見出しに ID を振る
  .use(remarkToc, { heading: '目次', tight: true })  // `## 目次` と書くとその下に Table of Contents を出力してくれる
  .use(remarkRehype, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
  .use(rehypeAutolinkHeadings, {  // 見出し要素に Slug のパーマリンク要素を追加する
    behavior: 'prepend',  // `prepend`・`append`・`wrap`・`before`・`after` で位置を選べる
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
  .use(rehypePrism, { ignoreMissing: false })  // 存在しない言語名を書いた時にエラーにする (`false`)
  .use(rehypeStringify, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
  .use(rehypeFormat, { indent: 2, indentInitial: true });

/** ソースファイルパスからルート相対パスに変換するための正規表現 */
const sourceToRootPathRegExp = new RegExp(`.*${constants.pages.src}`, 'u');

/**
 * ソース内にあるブログ用のプレースホルダを置換する
 * 
 * @param {string} sourceFilePath ソースファイルのパス
 * @param {string} source ソースファイルの内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
function replaceBlogPlaceholders(sourceFilePath, source) {
  source = replaceBlogLatests(source, '', post => `- <time>${post.date}</time>  \n  [${post.title}](${post.href})`, '', 5);
  return source
    .replace((/{{ blog-list-years }}/), _match => {
      // `/blog/index.md` 用のプレースホルダ : 年ごとの記事一覧へのリンクリストを作る
      const yearIndexFilePaths = listFiles(path.resolve(__dirname, `../${constants.pages.src}/blog`))
        .filter(filePath => filePath.match((/\/blog\/[0-9]{4}\/index\.md/u)))  // 年ごとのインデックスファイルのみに絞り込む
        .sort()
        .reverse();  // 新しい順にする
      // `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const yearIndexesText = yearIndexFilePaths.map(filePath => {
        const yearMonthText = filePath.replace((/.*\/blog\/([0-9]{4})\/.*/u), '<time datetime="$1-01-01">$1年</time>');
        return `- [${yearMonthText}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      return yearIndexesText;
    })
    .replace((/{{ blog-list-months }}/), _match => {
      // `/blog/YYYY/index.md` 用のプレースホルダ : 月ごとの記事一覧へのリンクリストを作る
      const currentYearMatch = sourceFilePath.match((/\/blog\/([0-9]{4})\//u));
      // ソースファイルパスから西暦が見つけられなかったので空文字で返す
      if(!currentYearMatch || !currentYearMatch[1]) return '';
      const currentYear = currentYearMatch[1];
      // ソースファイルパスの西暦配下にある月ごとのインデックスファイルのみに絞り込む
      const monthIndexFilePaths = listFiles(path.resolve(__dirname, `../${constants.pages.src}/blog/${currentYear}`))
        .filter(filePath => filePath.match(new RegExp(`/blog/${currentYear}/[0-9]{2}/index.md`, 'u')))
        .sort()
        .reverse();  // 新しい順にする
      // `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const monthIndexesText = monthIndexFilePaths.map(filePath => {
        const yearMonthText = filePath.replace((/.*\/blog\/([0-9]{4})\/([0-9]{2})\/.*/u), '<time datetime="$1-$2-01">$1年$2月</time>');
        return `- [${yearMonthText}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      return monthIndexesText;
    })
    .replace((/{{ blog-list-dates }}/), (_match) => {
      // `/blog/YYYY/MM/index.md` 用のプレースホルダ : その月の記事一覧のリンクリストを作る
      const currentYearMonthMatch = sourceFilePath.match((/\/blog\/([0-9]{4}\/[0-9]{2})\//u));
      // ソースファイルパスから西暦と月が見つけられなかったので空文字で返す
      if(!currentYearMonthMatch || !currentYearMonthMatch[1]) return '';
      const currentYearMonth = currentYearMonthMatch[1];  // `'YYYY/MM'` 形式
      // 指定の月配下の記事ファイルのみに絞り込む
      const postFilePaths = listFiles(path.resolve(__dirname, `../${constants.pages.src}/blog/${currentYearMonth}`))
        .filter(filePath => filePath.match(new RegExp(`/blog/${currentYearMonth}/[0-9]{2}-[0-9]{2}.md`, 'u')))
        .sort()
        .reverse();  // 新しい順にする
      // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const postsText = postFilePaths.map(filePath => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = markdownExtractFrontMatter(post);
        return `- <time>${postFrontMatter.created}</time>  \n  [${postFrontMatter.title}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      return postsText;
    });
};

/**
 * Markdown ファイルをパースしてコンテンツ部分を生成する
 * 
 * @param {string} source ソースファイルの内容
 * @return {string} HTML
 */
const generateContents = source => {
  const result = processor.processSync(source);
  return `\n${result.contents}`;
};

/**
 * テンプレートファイルをベースにソースファイルの内容に置換する
 * 
 * @param {string} sourceFilePath ソースファイルのパス
 * @param {string} source ソースファイルの内容
 * @return {string} テンプレートファイルをベースにソースファイルの内容に置換した文字列
 * @throws Front Matter がない場合・置換に失敗した場合
 */
const build = (sourceFilePath, source) => {
  const frontMatter = markdownExtractFrontMatter(source);
  
  // ソース側にあるプレースホルダを Markdown 形式で置換しておく
  source = replaceBlogPlaceholders(sourceFilePath, source);
  
  // テンプレートをベースに置換していく
  return templateReplacers.template
    .replace(templateReplacers.regExpInline, (_match, name) => templateReplacers.replaceInline(frontMatter, name))
    .replace(templateReplacers.regExpBlock, (_match, indent, name) => (name === 'contents') ? generateContents(source) : templateReplacers.replaceBlock(frontMatter, indent, name));
};

/**
 * 指定の Markdown ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function buildMarkdown(sourceFilePath) {
  const resolvedSourceFilePath = path.resolve(sourceFilePath);
  const source = fs.readFileSync(resolvedSourceFilePath, 'utf-8');
  
  const output = build(resolvedSourceFilePath, source);
  
  const distFilePath = resolvedSourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
  try {
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
};
