import fs from 'node:fs';

import yaml from 'yaml';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from '@neos21/rehype-prism';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';

import { constants } from './constants.js';
import { extractFrontMatter } from './extract-front-matter.js';
import { isNotFuture } from './is-not-future.js';
import { listFiles } from './list-files.js';
import { makeDirectory } from './make-directory.js';
import { template, regExpInlineTag, regExpInlineAttribute, regExpBlock, replaceInlineTag, replaceInlineAttribute, replaceBlock } from './template-replacers.js';

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
 * ソース中に `{{ blog-latests 【num】 }}` のプレースホルダがあれば最新記事のリンクリストに置換する
 * 
 * @param {string} source ソース
 * @param {string} prefix 置換文字列の手前に付与する文字列
 * @param {function} mapFn 整形するための `Array#map()` に指定する関数
 * @param {string} prefix 置換文字列の後ろに付与する文字列
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
const replaceBlogLatests = (source, prefix, mapFn, suffix) => {
  return source.replace((/{{ blog-latests ([0-9]*) }}/), (_match, num) => {
    const latestPostFilePaths = listFiles(`${constants.pages.src}/blog`)
      .filter(filePath => filePath.match((/\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-[0-9]{2}\.md/u)))  // 記事ファイルのみに絞り込む
      .filter(filePath => {  // 未来日の記事を載せない
        const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
        if(!match) return false;  // マッチしない不正値は除外する
        const blogYear  = Number(match[1]);
        const blogMonth = Number(match[2]);
        const blogDate  = Number(match[3]);
        return isNotFuture(blogYear, blogMonth, blogDate);
      })
      .sort()
      .reverse()  // 新しい順にする
      .slice(0, num);  // 最新の指定件数のみ取得する
    
    // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスでリスト・リンクを組み立てる
    const latestPostsText = latestPostFilePaths
      .map(filePath => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = extractFrontMatter(post);
        return {
          date : postFrontMatter.created,
          title: postFrontMatter.title,
          href : filePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), '').replace('.md', '.html')
        };
      })
      .map(mapFn)
      .join('\n');
    return `${prefix}${latestPostsText}${suffix}`;
  });
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
   * @param {number} sliceNum 指定件数のみ抽出する場合は指定する。全件取得する場合は `null` を渡す
   * @return {string} 置換文字列
   */
  const replaceFunction = sliceNum => {
    const rawNews = fs.readFileSync(constants.news.src, 'utf-8');
    const allNews = yaml.parse(rawNews);
    
    // 未来日のデータは除外する
    let newsItems = allNews.filter(newsItem => {
      const match = newsItem.date.match((/^([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
      if(!match) return false;  // マッチしなかった不正値は除外する
      const newsYear  = Number(match[1]);
      const newsMonth = Number(match[2]);
      const newsDate  = Number(match[3]);
      return isNotFuture(newsYear, newsMonth, newsDate);
    });
    if(sliceNum != null) newsItems = newsItems.slice(0, sliceNum);
    
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
  const html = source.replace((/^---\n((.|[\n])+)\n---\n\n/u), '');  // Front Matter 部分を除去する
  const processor = (frontMatter.toc === false) ? processorWithoutToC : processorWithToC;
  const result = processor.processSync(html);
  if(result.value == null) {
    console.error('Failed To Parse HTML', result)
    throw new Error('Failed To Parse HTML');
  }
  return `\n${result.value}`;
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
  return template
    .replace(regExpInlineTag, (_match, name) => replaceInlineTag(frontMatter, name))
    .replace(regExpInlineAttribute, (_match, name) => replaceInlineAttribute(frontMatter, name))
    .replace(regExpBlock, (_match, indent, name) => (name === 'contents') ? generateContents(source, frontMatter) : replaceBlock(frontMatter, indent, name));
};

/**
 * 指定の HTML ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
export const buildHtml = sourceFilePath => {
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
