const fs = require('fs');
const path = require('path');

const constants = require('./constants');
const listFiles = require('./list-files');
const markdownExtractFrontMatter = require('./markdown-extract-front-matter');

/**
 * ソース中に `{{ blog-latests 【num】 }}` のプレースホルダがあれば最新記事のリンクリストに置換する
 * 
 * `/index.html` や `/blog/index.md` 用のプレースホルダ
 * 
 * @param {string} source HTML or Markdown ソースファイルの内容
 * @param {string} prefix 置換文字列の手前に付与する文字列
 * @param {function} mapFn HTML か Markdown 形式に整形するための `Array#map()` に指定する関数
 * @param {string} prefix 置換文字列の後ろに付与する文字列
 * @param {number} defaultNum プレースホルダ側に指定がなかった場合に使用する件数
 * @return {string} ソースファイルをベースにプレースホルダを置換した文字列
 */
module.exports = function replaceBlogLatests(source, prefix, mapFn, suffix, defaultNum) {
  if(defaultNum == null || defaultNum <= 0) defaultNum = 3;
  return source.replace((/{{ blog-latests ([0-9]*) }}/), (_match, num) => {
    if(num == null || num <= 0) {  // 異常値はデフォルト値にしておく
      console.warn(`Warning : {{ blog-latests 【num】 }} Placeholder Has Wrong Number : [${num}]`);
      num = defaultNum;
    }
    
    const latestPostFilePaths = listFiles(`${constants.pages.src}/blog`)
      .filter(filePath => filePath.match((/\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-[0-9]{2}\.md/u)))  // 記事ファイルのみに絞り込む
      .sort()
      .reverse()  // 新しい順にする
      .slice(0, num);  // 最新の指定件数のみ取得する
    
    // 各ファイルの Front Matter からタイトルと日付を取得し `/blog/` からのルート相対パスで Markdown リスト・リンクを組み立てる
    const latestPostsText = latestPostFilePaths
      .map(filePath => {
        const post = fs.readFileSync(filePath, 'utf-8');
        const postFrontMatter = markdownExtractFrontMatter(post);
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
