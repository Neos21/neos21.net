const fs = require('fs');

const yaml = require('yaml');
const unified = require('unified');
const rehypeParse = require('rehype-parse');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('rehype-toc');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypePrism = require('@neos21/rehype-prism');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const constants = require('../lib/constants');
const replaceBlogLatests = require('./replace-blog-latests');
const templateReplacers = require('./template-replacers');
const makeDirectory = require('./make-directory');

/** Front Matter 部分を抽出する正規表現 */
const frontMatterRegExp = (/^---\n((.|[\n])+)\n---\n\n/u);

/**
 * Processor を生成する
 * 
 * @param {boolean} isNeedToC ToC を付与する Processor を生成する場合は `true`
 * @return {object} Processor
 */
const createProcessor = isNeedToC => {
  /**
   * `rehype-toc` にて `ol` 要素ではなく `ul` 要素でレンダリングするための置換処理
   * 
   * @param {Array<object>} children 子要素
   */
  const replaceToC = children => {
    children.forEach(child => {
      if(child.type === 'element' && child.tagName === 'ol') child.tagName = 'ul';
      if(child.children) replaceToC(child.children);
    });
  };
  
  let processor = unified()
    .use(rehypeParse, { fragment: true })  // `html`・`head`・`body` 要素を自動付与しない
    .use(rehypeSlug);
  
  if(isNeedToC) {
    processor = processor
      .use(rehypeToc, {  // `remark-toc` と違って HTML の先頭に固定で配置される
        nav: false,
        cssClasses: { toc: '', list: '', listItem: '', link: '' },
        customizeTOC: toc => replaceToC([toc])
      });
  }
  
  processor = processor
    .use(rehypeAutolinkHeadings, {  // 見出し要素に Slug のパーマリンク要素を追加する
      behavior: 'prepend',  // `prepend`・`append`・`wrap`・`before`・`after'`で挿入位置を選べる
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
    .use(rehypePrism, {
      ignoreMissing: false,  // 存在しない言語名を書いた時にエラーにする (false)
      aliases: {
        bash: 'sh'
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })  // `script`・`style` 要素が記述されていても流す
    .use(rehypeFormat, { indent: 2, indentInitial: true });
  
  return processor;
};

/** ToC を付与する Processor */
const processorWithToC = createProcessor(true);

/** ToC を付与しない Processor */
const processorWithoutToC = createProcessor(false);

/**
 * HTML ファイルから Front Matter 部分を抽出する
 * 
 * @param {string} source ソースファイルの内容
 * @return {object} Front Matter の連想配列
 */
const extractFrontMatter = source => {
  const frontMatterMatch = source.match(frontMatterRegExp);
  if(!frontMatterMatch || !frontMatterMatch[1]) throw new Error('Front Matter Section Not Found');
  return yaml.parse(frontMatterMatch[1]);
};

/**
 * ソース内にある更新履歴用のプレースホルダを置換する
 * 
 * @param {string} source ソースファイルの内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
const replaceNewsPlaceholders = source => {
  /**
   * 変換関数
   * 
   * @param {number} sliceNum 指定件数のみ抽出する場合は指定する。全県取得する場合は `null` を渡す
   * @return {string} 置換文字列
   */
  const replaceFunction = sliceNum => {
    const rawNews = fs.readFileSync(constants.news.src, 'utf-8');
    const allNews = yaml.parse(rawNews);
    
    let newsItems = allNews;
    if(sliceNum != null) newsItems = allNews.slice(0, sliceNum);
    
    const newsText = newsItems.map(newsItem => {
      const newsList = newsItem.news.map(listItem => `      <li>${listItem}</li>`).join('\n');
      return `  <dt><time>${newsItem.date}</time></dt>\n  <dd>\n    <ul>\n${newsList}\n    </ul>\n  </dd>\n`;
    }).join('\n');
    return `<dl class="nested-list">\n${newsText}</dl>`;
  };
  
  return source
    .replace((/{{ news-latests ([0-9]*) }}/), (_match, num) => {
      if(num == null || num <= 0) {  // 異常値はデフォルト値にしておく
        console.warn(`Warning : {{ news-latests 【num】 }} Placeholder Has Wrong Number : [${num}]`);
        num = 1;
      }
      return replaceFunction(num);
    })
    .replace('{{ news-all }}', _match => replaceFunction(null));
};

/**
 * HTML ファイルから余分な部分を除去してコンテンツ部分を生成する
 * 
 * @param {string} source ソース
 * @param {object} frontMatter Front Matter
 * @return {string} HTML
 */
const generateContents = (source, frontMatter) => {
  const html = source.replace(frontMatterRegExp, '');
  const processor = (frontMatter.toc === false) ? processorWithoutToC : processorWithToC;
  const result = processor.processSync(html);
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
  const frontMatter = extractFrontMatter(source);
  
  // canonical 属性値を用意して Front Matter に混ぜ込む
  const rootPath = sourceFilePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), '');
  if(!rootPath.startsWith('/')) throw new Error(`Invalid HTML Path [${rootPath}]`);
  frontMatter.canonical = `${constants.protocol}${constants.host}${rootPath}`;
  
  // ソース側にあるプレースホルダを HTML 形式で置換しておく
  source = replaceBlogLatests(source, '<ul>\n', post => `  <li><time>${post.date}</time><br><a href="${post.href}">${post.title}</a></li>`, '\n</ul>', 3);
  source = replaceNewsPlaceholders(source);
  
  // テンプレートをベースに置換していく
  return templateReplacers.template
    .replace(templateReplacers.regExpInline, (_match, name) => templateReplacers.replaceInline(frontMatter, name))
    .replace(templateReplacers.regExpBlock, (_match, indent, name) => (name === 'contents') ? generateContents(source, frontMatter) : templateReplacers.replaceBlock(frontMatter, indent, name));
};

/**
 * 指定の HTML ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
module.exports = function buildHtml(sourceFilePath) {
  const source = fs.readFileSync(sourceFilePath, 'utf-8');
  const output = build(sourceFilePath, source);
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist);
  try {
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
};
