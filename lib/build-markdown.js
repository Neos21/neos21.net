import fs from 'node:fs';
import path from 'node:path';

import { unified } from 'unified';
import remarkParse from 'remark-parse';  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import remarkRehype from 'remark-rehype';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from '@neos21/rehype-prism';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';

import { constants } from './constants.js';
import { htmlExtractFrontMatter } from './html-extract-front-matter.js';
import { isNotFuture } from './is-not-future.js';
import { jstCurrentYear, jstCurrentMonth } from './jst-now.js';
import { listFiles } from './list-files.js';
import { makeDirectory } from './make-directory.js';
import { markdownExtractFrontMatter } from './markdown-extract-front-matter.js';
import { template, regExpInline, regExpBlock, replaceInline, replaceBlock } from './template-replacers.js';

/** Processor : Markdown をパース → Slug・ToC 付与 → HTML 変換 → Prism.js・パーマリンク付与 → フォーマット */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
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
  .use(rehypePrism, {
    ignoreMissing: false,  // 存在しない言語名を書いた時にエラーにする (false)
    aliases: {
      bash: 'sh'
    }
  })
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
const replaceBlogPlaceholders = (sourceFilePath, source) => {
  return source
    .replace((/{{ blog-list-years ([0-9]{4}) }}/g), (_match, targetYear) => {
      // `/blog/index.md` 用のプレースホルダ : 指定の年配下の記事一覧のリンクリストを作る
      // 原則、現在年を指定しておく。過去年分は予め本置換を利用して Markdown を出力しておき、静的に記述しておく
      
      const headline = `## [${targetYear}](/blog/${targetYear}/index.html)`;
      
      const postFilePaths = listFiles(`${constants.pages.src}/blog/${targetYear}`)
        .filter(filePath => filePath.match(new RegExp(`/blog/${targetYear}/[0-9]{2}/[0-9]{2}-[0-9]{2}.md`, 'u')))
        .filter(filePath => {  // 今年の未来月・未来日は除外する
          const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
          const blogYear  = Number(match[1]);
          const blogMonth = Number(match[2]);
          const blogDate  = Number(match[3]);
          return isNotFuture(blogYear, blogMonth, blogDate);
        })
        .sort()
        .reverse();  // 新しい順にする
      if(!postFilePaths.length) return '';  // 指定年に記事ファイルが一つもなければ何も出力しない
      // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const postsText = postFilePaths.map(filePath => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = markdownExtractFrontMatter(post);
        return `- <time>${postFrontMatter.created}</time>  \n  [${postFrontMatter.title}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      
      const result = `${headline}\n\n${postsText}`;  // NOTE : 過去年分を出力する際はこの定数を `console.log()` 出力する
      //console.log(`{{ blog-list-years ${targetYear} : Start ========`);
      //console.log(result);
      //console.log(`{{ blog-list-years ${targetYear} : Finished =====`);
      return result;
    })
    .replace('{{ blog-list-months }}', _match => {
      // `/blog/YYYY/index.md` 用のプレースホルダ : 月ごとの記事一覧へのリンクリスト、およびその年の記事一覧のリンクリストを作る
      const currentYearMatch = sourceFilePath.match((/\/blog\/([0-9]{4})\//u));
      // ソースファイルパスから西暦が見つけられなかったので空文字で返す
      if(!currentYearMatch || !currentYearMatch[1]) return '';
      const currentYear = currentYearMatch[1];
      
      // ソースファイルパスの西暦配下にある月ごとのインデックスファイルのみに絞り込む
      const monthIndexFilePaths = listFiles(`${constants.pages.src}/blog/${currentYear}`)
        .filter(filePath => filePath.match(new RegExp(`/blog/${currentYear}/[0-9]{2}/index.md`, 'u')))
        .filter(filePath => {  // 今年の未来月は除外する
          if(currentYear < jstCurrentYear) return true;  // 去年以前は全部通す
          const blogMonth = Number(filePath.match((/\/blog\/[0-9]{4}\/([0-9]{2})/u))[1]);
          return blogMonth <= jstCurrentMonth;  // 今月以前のみ
        })
        .sort()
        .reverse();  // 新しい順にする
      if(!monthIndexFilePaths.length) return '記事はありません';
      // `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const monthIndexesText = monthIndexFilePaths.map(filePath => {
        const yearMonthText = filePath.replace((/.*\/blog\/([0-9]{4})\/([0-9]{2})\/.*/u), '<time datetime="$1-$2-01">$1年$2月</time>');
        return `- [${yearMonthText}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      
      // 指定の年配下の記事ファイルのみ絞り込む
      const postFilePaths = listFiles(`${constants.pages.src}/blog/${currentYear}`)
        .filter(filePath => filePath.match(new RegExp(`/blog/${currentYear}/[0-9]{2}/[0-9]{2}-[0-9]{2}.md`, 'u')))
        .filter(filePath => {  // 今年の未来月・未来日は除外する
          const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
          const blogYear  = Number(match[1]);
          const blogMonth = Number(match[2]);
          const blogDate  = Number(match[3]);
          return isNotFuture(blogYear, blogMonth, blogDate);
        })
        .sort()
        .reverse();  // 新しい順にする
      if(!postFilePaths.length) return '記事はありません';
      // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
      const postsText = postFilePaths.map(filePath => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = markdownExtractFrontMatter(post);
        return `- <time>${postFrontMatter.created}</time>  \n  [${postFrontMatter.title}](${filePath.replace(sourceToRootPathRegExp, '').replace('.md', '.html')})`;
      }).join('\n');
      return `${monthIndexesText}\n\n---\n\n${postsText}`;
    })
    .replace('{{ blog-list-dates }}', _match => {
      // `/blog/YYYY/MM/index.md` 用のプレースホルダ : その月の記事一覧のリンクリストを作る
      const currentYearMonthMatch = sourceFilePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\//u));
      // ソースファイルパスから西暦と月が見つけられなかったので空文字で返す
      if(!currentYearMonthMatch || !currentYearMonthMatch[1] || !currentYearMonthMatch[2]) return '';
      const currentYear  = currentYearMonthMatch[1];
      const currentMonth = currentYearMonthMatch[2];
      // 指定の月配下の記事ファイルのみに絞り込む
      const postFilePaths = listFiles(`${constants.pages.src}/blog/${currentYear}/${currentMonth}`)
        .filter(filePath => filePath.match(new RegExp(`/blog/${currentYear}/${currentMonth}/[0-9]{2}-[0-9]{2}.md`, 'u')))
        .filter(filePath => {  // 今月の未来日は除外する
          const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
          const blogYear  = Number(match[1]);
          const blogMonth = Number(match[2]);
          const blogDate  = Number(match[3]);
          return isNotFuture(blogYear, blogMonth, blogDate);
        })
        .sort()
        .reverse();  // 新しい順にする
      if(!postFilePaths.length) return '記事はありません';
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
 * ソース内にあるサイトマップ用のプレースホルダを置換する
 * 
 * - `src/pages/` 配下のファイルを見てサイトマップを生成する (`src/documents/` は対象外)
 * - `bin/build-sitemap.js` に似た抽出条件だが出力方法が異なる
 * 
 * @param {string} source ソースファイルの内容
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
const replaceSitemapPlaceholders = source => source.replace('{{ sitemap }}', _match => {
  const pagesFilePaths = listFiles(constants.pages.src)
    .filter(filePath => ['.html', '.md'].includes(path.extname(filePath)))
    .filter(filePath => {
      // エラーページ、またはファイルパスにアンダースコアを含んでいれば除外する
      if(filePath.includes('403.html') ||
         filePath.includes('404.html') ||
         filePath.includes('500.html') ||
         filePath.includes('_')) {
        return false;
      }
      
      // ブログトップは対象、ブログ記事は除外する
      if(filePath.includes('/blog/index.md')) return true;
      if(filePath.includes('/blog/')) return false;
      
      // `created` が未来日のファイルを除外する
      // 作成日が未来日なファイルは公開しておらずサイトマップには載せられないため
      const text = fs.readFileSync(filePath, 'utf-8');
      const matchLine = text.split('\n').find(line => line.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u)));
      const created      = matchLine.match((/^created(\s*): ([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
      const createdYear  = Number(created[2]);
      const createdMonth = Number(created[3]);
      const createdDate  = Number(created[4]);
      return isNotFuture(createdYear, createdMonth, createdDate);
    })
    .map(filePath => filePath.replace(constants.pages.src, ''))
    .sort();
  
  // ツリー構造に変換する
  const pagesFilePathTree = pagesFilePaths.reduce((pagesFilePathTree, pagesFilePath) => {
    const directoryPaths = pagesFilePath.split('/');
    if(directoryPaths[0] !== '') throw new Error(`Invalid Pages File Path [${pagesFilePath}] [${directoryPaths}]`);
    directoryPaths.shift();  // 先頭は `/` が空文字になったモノなので削除する
    directoryPaths.pop();  // 末尾はファイル名なので除去する
    
    // ツリー階層を掘り下げていく
    let tree = pagesFilePathTree;
    while(directoryPaths.length > 0) {
      const directoryPath = directoryPaths.splice(0, 1);
      if(tree.sub[directoryPath] == null) tree.sub[directoryPath] = { path: '', files: [], sub: {} };
      tree = tree.sub[directoryPath];
    }
    
    // ディレクトリへのフルパス
    tree.path = path.dirname(pagesFilePath);
    // ファイルパス : Index を先頭に配置する
    const fileName = path.basename(pagesFilePath);
    if(['index.html', 'index.md'].includes(fileName)) {
      tree.files.unshift(pagesFilePath);
    }
    else {
      tree.files.push(pagesFilePath);
    }
    return pagesFilePathTree;
  }, { path: '/', files: [], sub: {} });
  
  // Markdown 形式のリストで出力する
  const outputList = (tree, indentLevel) => {
    // 先にファイル一覧を出力する
    const spaces = ' '.repeat(indentLevel * 4);
    const currentFiles = tree.files.map(filePath => {
      // Front Matter からページタイトルを抽出する
      const text = fs.readFileSync(`${constants.pages.src}${filePath}`, 'utf-8');
      const frontMatter = filePath.endsWith('.html') ? htmlExtractFrontMatter(text) : markdownExtractFrontMatter(text);
      const title = frontMatter.title;
      // ルート相対パスの URL を作る
      const linkPath = filePath.replace('.md', '.html');
      
      // Index ページはインデントを下げて出力する (スラッシュから書くことで `hoge-index.html` なページを除外する)
      if(linkPath.endsWith('/index.html')) {
        const indentLevelForIndex = (indentLevel - 1) < 0 ? 0 : (indentLevel - 1);
        const spacesForIndex = ' '.repeat(indentLevelForIndex * 4);
        return `${spacesForIndex}- [${title}](${linkPath})`;
      }
      else {
        return `${spaces}- [${title}](${linkPath})`;
      }
    }).join('\n');
    
    // サブディレクトリを再帰的に出力する
    const subDirectoryFiles = Object.keys(tree.sub).reduce((subDirectoryFiles, key) => {
      return subDirectoryFiles + outputList(tree.sub[key], indentLevel + 1);
    }, '');
    
    return currentFiles + '\n' + subDirectoryFiles;
  };
  return outputList(pagesFilePathTree, 0);
});

/**
 * Markdown ファイルをパースしてコンテンツ部分を生成する
 * 
 * @param {string} source ソースファイルの内容
 * @return {string} HTML
 */
const generateContents = source => {
  const result = processor.processSync(source);
  if(result.value == null) {
    console.error('Failed To Parse Markdown', result)
    throw new Error('Failed To Parse Markdown');
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
  const frontMatter = markdownExtractFrontMatter(source);
  
  // canonical 属性値を用意して Front Matter に混ぜ込む
  const rootPath = sourceFilePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), '').replace('.md', '.html');
  if(!rootPath.startsWith('/')) throw new Error(`Invalid Markdown Path [${rootPath}]`);
  frontMatter.canonical = `${constants.protocol}${constants.host}${rootPath}`;  // Front Matter の `title` プロパティにミスがあるとココでつまづく
  
  // ソース側にあるプレースホルダを Markdown 形式で置換しておく
  source = replaceBlogPlaceholders(sourceFilePath, source);
  source = replaceSitemapPlaceholders(source);
  
  // テンプレートをベースに置換していく
  return template
    .replace(regExpInline, (_match, name) => replaceInline(frontMatter, name))
    .replace(regExpBlock, (_match, indent, name) => (name === 'contents') ? generateContents(source) : replaceBlock(frontMatter, indent, name));
};

/**
 * 指定の Markdown ファイルをビルドする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 */
export const buildMarkdown = (sourceFilePath) => {
  const source = fs.readFileSync(sourceFilePath, 'utf-8');
  const output = build(sourceFilePath, source);
  const distFilePath = sourceFilePath.replace(constants.pages.src, constants.pages.dist).replace('.md', '.html');
  try {
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.writeFileSync(distFilePath, output, 'utf-8');
  }
};
