const fs = require('fs');
const path = require('path');

const yaml = require('yaml');

const listFiles = require('../lib/list-files');
const extractMarkdownFrontMatter = require('../lib/extract-markdown-front-matter');
const makeDirectory = require('../lib/make-directory');

/** ホスト名・後ろに `/` 始まりのルート相対パスを付与できるよう末尾スラッシュなし */
const host = 'https://neos21.net';
/** 取得するデータの件数 */
const latestNum = 30;

/** メイン処理 */
function main() {
  const news = getLatestNews();
  const blogPosts = getLatestBlogPosts();
  const merged = [...news, ...blogPosts];
  const sorted = merged.sort((a, b) => {  // 降順ソートになるよう記述する
    if(a.updated > b.updated) return -1;
    if(a.updated < b.updated) return  1;
    return 0;
  });
  const sliced = sorted.slice(0, latestNum);  // マージ後絞る
  const entries = createEntries(sliced);
  
  const atomTemplate = fs.readFileSync(path.resolve(__dirname, '../src/feeds/atom.xml'), 'utf-8');
  const atomFeed = atomTemplate
    .replace('{{ updated }}', sliced[0].updated)
    .replace('{{ entries }}', entries);
  makeDirectory(path.resolve(__dirname, '../dist/feeds/.gitkeep'));  // `path.dirname()` を使っているので適当なファイル名を与えておく
  fs.writeFileSync(path.resolve(__dirname, '../dist/feeds/atom.xml'), atomFeed, 'utf-8');
}

/**
 * 最新の更新履歴を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
function getLatestNews() {
  const rawNews = fs.readFileSync(path.resolve(__dirname, '../src/news/news.yaml'), 'utf-8');
  const allNews = yaml.parse(rawNews);
  return allNews
    .slice(0, latestNum)  // 最新の指定件数のみ取得する
    .map((newsItem) => {
      const summary = newsItem.news.map((listItem) => listItem.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')).join('・');  // HTML タグを消して結合する
      return {
        title  : `Neo's World ${newsItem.date} の更新情報`,
        link   : host + '/index.html?t=' + newsItem.date,  // 一律でトップページに案内するが、ID をユニークにしたいのでパラメータを付与する
        updated: newsItem.date + 'T00:00:00Z',  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
        summary: summary
      };
    });
}

/**
 * 最新のブログ投稿を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
function getLatestBlogPosts() {
  return listFiles(path.resolve(__dirname, '../src/pages/blog'))
    .filter((filePath) => filePath.match((/\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-[0-9]{2}\.md/u)))  // 記事ファイルのみに絞り込む
    .sort()     // ソートする
    .reverse()  // 新しい順にする
    .slice(0, latestNum)  // 最新の指定件数のみ取得する
    .map((filePath) => {
      const post = fs.readFileSync(filePath, 'utf-8');
      const postFrontMatter = extractMarkdownFrontMatter(post);
      const time = filePath.replace((/.*\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-([0-9]{2})\.md/u), '$1');  // ファイル名の連番部分を時間に利用する
      return {
        title  : postFrontMatter.title,
        link   : host + filePath.replace((/.*\/src\/pages/u), '').replace('.md', '.html'),  // `/blog/` からのルート相対パスを生成してくっつける
        updated: postFrontMatter.created + 'T' + time + ':00:00Z',  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
        summary: postFrontMatter.title
      };
    });
}

/**
 * 配列からエントリ部分の文字列を構築する
 * 
 * @param {Array<object>} latests フィード情報
 * @return {string} フィードのエントリ部分の文字列
 */
function createEntries(latests) {
  return latests
    .map((item) => `  <entry>
    <title>${item.title}</title>
    <id>${item.link}</id>
    <link rel="alternate" type="text/html" href="${item.link}" />
    <updated>${item.updated}</updated>
    <summary>${item.summary}</summary>
  </entry>`)
    .join('\n');
}

// 実行
main();
