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

const replaceBlogLatests = require('./replace-blog-latests');
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
 * @param {string} rawSource ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} テンプレートファイルをベースにソースファイルの内容に置換した文字列
 * @throws Front Matter がない場合、置換に失敗した場合
 */
function build(rawSource) {
  const frontMatter = extractFrontMatter(rawSource);
  
  // ソース側にある更新地歴用のプレースホルダを HTML 形式で置換しておく
  const replacedBlogPlaceholders = replaceBlogPlaceholders(rawSource);
  const source = replaceNewsPlaceholders(replacedBlogPlaceholders);
  
  return templateReplacers.template
    .replace(templateReplacers.regExpInline, (_match, name) => {
      return templateReplacers.replaceInline(frontMatter, name);
    })
    .replace(templateReplacers.regExpBlock, (_match, indent, name) => {
      if(name === 'contents') {
        return generateContents(source, frontMatter);
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
 * ソースファイル中にあるブログ用のプレースホルダを置換する
 * 
 * @param {string} rawSource ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
function replaceBlogPlaceholders(rawSource) {
  const replacedBlogLatests = replaceBlogLatests(rawSource, '<ul>\n', (post) => {
    return `  <li><time>${post.date}</time><br><a href="${post.href}">${post.title}</a></li>`;
  }, '\n</ul>', 3);
  return replacedBlogLatests;
}

/**
 * ソースファイル中にある更新履歴用のプレースホルダを置換する
 * 
 * @param {string} rawSource ソースファイル (./src/pages/ 配下の HTML) の内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
function replaceNewsPlaceholders(rawSource) {
  /**
   * 変換関数
   * 
   * @param {number} sliceNum 指定件数のみ抽出する場合は指定する。全県取得する場合は `null` を渡す
   * @return {string} 置換文字列
   */
  const replaceFunction = (sliceNum) => {
    const rawNews = fs.readFileSync(path.resolve(__dirname, '../src/news/news.yaml'), 'utf-8');
    const allNews = yaml.parse(rawNews);
    
    let news = allNews;
    if(sliceNum != null) {
      news = allNews.slice(0, sliceNum);
    }
    
    const newsText = news.map((newsItem) => {
      const newsListText = newsItem.news.map((listItem) => `      <li>${listItem}</li>`).join('\n');
      return `  <dt><time>${newsItem.date}</time></dt>\n  <dd>\n    <ul>\n${newsListText}\n    </ul>\n  </dd>\n`;
    }).join('\n');
    return '<dl class="nested-list">\n' + newsText + '</dl>';
  };
  
  return rawSource
    .replace((/{{ news-latests ([0-9]*) }}/), (_match, num) => {
      // 異常値はデフォルト値にしておく
      if(num == null || num <= 0) {
        console.warn(`Warning : {{ news-latests 【num】 }} Placeholder Has Wrong Number : [${num}]`);
        num = 1;
      }
      return replaceFunction(num);
    })
    .replace((/{{ news-all }}/), (_match) => {
      return replaceFunction(null);
    });
}

/**
 * HTML ファイルから余分な部分を除去してコンテンツ部分を生成する
 * 
 * @param {string} source ソース
 * @param {object} frontMatter Front Matter
 * @return {string} HTML ソース
 */
function generateContents(source, frontMatter) {
  const html = source.replace(frontMatterRegExp, '');
  const processor = (frontMatter.toc === false) ? processorWithoutToC : processorWithToC;
  const result = processor.processSync(html);
  return '\n' + result.contents;
}
