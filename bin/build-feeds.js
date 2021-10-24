const fs = require('fs');

const yaml = require('yaml');

const constants = require('../lib/constants');
const isNotFuture = require('../lib/is-not-future');
const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');
const markdownExtractFrontMatter = require('../lib/markdown-extract-front-matter');

/*!
 * Atom フィードを生成する
 */

const news = getLatestNews();
const blogPosts = getLatestBlogPosts();
const latests = mergeLatests(news, blogPosts);
const entries = createEntries(latests);

const template = fs.readFileSync(constants.feeds.src, 'utf-8');
const feeds = template
  .replace((/{{ host }}/g)   , `${constants.protocol}${constants.host}/`)
  .replace('{{ site-name }}' , constants.siteName)
  .replace('{{ author }}'    , constants.author)
  .replace('{{ feeds-path }}', `${constants.protocol}${constants.host}${constants.feeds.canonical}`)
  .replace('{{ updated }}'   , latests[0].updated)
  .replace('{{ entries }}'   , entries);

makeDirectory(constants.feeds.dist, true);
fs.writeFileSync(constants.feeds.dist, feeds, 'utf-8');

console.log('Build Feeds : Succeeded');


// ================================================================================


/**
 * 最新の更新履歴を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
function getLatestNews() {
  const rawNews = fs.readFileSync(constants.news.src, 'utf-8');
  const allNews = yaml.parse(rawNews);
  return allNews
    .filter(newsItem => {
      // 未来日のデータを除外する
      const match = newsItem.date.match((/^([0-9]{4})-([0-9]{2})-([0-9]{2})/u));
      const newsYear  = Number(match[1]);
      const newsMonth = Number(match[2]);
      const newsDate  = Number(match[3]);
      return isNotFuture(newsYear, newsMonth, newsDate);
    })
    .slice(0, constants.feeds.feedsCount)  // 最新の指定件数のみ取得する
    .map(newsItem => ({
        title  : `${constants.siteName} ${newsItem.date} の更新情報`,
        link   : `${constants.protocol}${constants.host}/index.html?t=${newsItem.date}`,  // 一律でトップページに案内するが、ID をユニークにしたいのでパラメータを付与する
        updated: `${newsItem.date}T00:00:00Z`,  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
        summary: newsItem.news.map(listItem => listItem.replace((/<("[^"]*"|'[^']*'|[^'">])*>/g), '')).join('・')  // HTML タグを消して結合する
    }));
}

/**
 * 最新のブログ投稿を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
function getLatestBlogPosts() {
  return listFiles(`${constants.pages.src}/blog`)
    .filter(filePath => !filePath.includes('_'))  // ファイルパスにアンダースコアを含んでいれば除外する
    .filter(filePath => {
      // 未来日でない記事ファイルのみに絞り込む
      const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})-[0-9]{2}\.md/u));
      if(!match) return false;  // 記事ファイル以外は除外する
      const blogYear  = Number(match[1]);
      const blogMonth = Number(match[2]);
      const blogDate  = Number(match[3]);
      return isNotFuture(blogYear, blogMonth, blogDate);
    })
    .sort()
    .reverse()  // 新しい順にする
    .slice(0, constants.feeds.feedsCount)  // 最新の指定件数のみ取得する
    .map(filePath => {
      const post = fs.readFileSync(filePath, 'utf-8');
      const postFrontMatter = markdownExtractFrontMatter(post);
      const time = filePath.replace((/.*\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-([0-9]{2})\.md/u), '$1');  // ファイル名の連番部分を時間に利用する
      return {
        title  : postFrontMatter.title,
        link   : `${constants.protocol}${constants.host}${filePath.replace(new RegExp(`.*${constants.pages.src}`, 'u'), '').replace('.md', '.html')}`,  // `/blog/` からのルート相対パスを生成して結合する
        updated: `${postFrontMatter.created}T${time}:00:00Z`,  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
        summary: postFrontMatter.title
      };
    });
}

/**
 * 更新履歴とブログ投稿をマージする
 * 
 * @param {Array<*>} news 更新履歴
 * @param {Array<*>} blogPosts ブログ投稿
 */
function mergeLatests(news, blogPosts) {
  return [...news, ...blogPosts]
    .sort((a, b) => {  // 降順ソートになるよう記述する
      if(a.updated > b.updated) return -1;
      if(a.updated < b.updated) return  1;
      return 0;
    })
    .slice(0, constants.feeds.feedsCount);  // マージ後絞る
}

/**
 * 配列からエントリ部分の文字列を構築する
 * 
 * @param {Array<object>} latests フィード情報
 * @return {string} フィードのエントリ部分の文字列
 */
function createEntries(latests) {
  return latests
    .map(item => `  <entry>
    <title>${item.title}</title>
    <id>${item.link}</id>
    <link rel="alternate" type="text/html" href="${item.link}" />
    <updated>${item.updated}</updated>
    <summary>${item.summary}</summary>
  </entry>`)
    .join('\n');
}
