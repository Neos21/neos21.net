const fs = require('fs');
const path = require('path');

const yaml = require('yaml');

const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');
const markdownExtractFrontMatter = require('../lib/markdown-extract-front-matter');
const makeDirectory = require('../lib/make-directory');

/*!
 * Atom フィードを生成する
 */

/**
 * 最新の更新履歴を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
const getLatestNews = () => {
  const rawNews = fs.readFileSync(path.resolve(__dirname, `../${constants.news.src}`), 'utf-8');
  const allNews = yaml.parse(rawNews);
  return allNews
    .slice(0, constants.feeds.feedsCount)  // 最新の指定件数のみ取得する
    .map(newsItem => ({
        title  : `${constants.siteName} ${newsItem.date} の更新情報`,
        link   : `${constants.protocol}${constants.host}/index.html?t=${newsItem.date}`,  // 一律でトップページに案内するが、ID をユニークにしたいのでパラメータを付与する
        updated: newsItem.date + 'T00:00:00Z',  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
        summary: newsItem.news.map(listItem => listItem.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')).join('・')  // HTML タグを消して結合する
    }));
};

/**
 * 最新のブログ投稿を取得する
 * 
 * @return {Array<object>} 最新のブログ投稿情報
 */
const getLatestBlogPosts = () => listFiles(path.resolve(__dirname, `../${constants.pages.src}/blog`))
  .filter(filePath => filePath.match((/\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-[0-9]{2}\.md/u)))  // 記事ファイルのみに絞り込む
  .sort()
  .reverse()  // 新しい順にする
  .slice(0, constants.feeds.feedsCount)  // 最新の指定件数のみ取得する
  .map(filePath => {
    const post = fs.readFileSync(filePath, 'utf-8');
    const postFrontMatter = markdownExtractFrontMatter(post);
    const time = filePath.replace((/.*\/blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}-([0-9]{2})\.md/u), '$1');  // ファイル名の連番部分を時間に利用する
    return {
      title  : postFrontMatter.title,
      link   : `${constants.protocol}${constants.host}${filePath.replace((/.*\/src\/pages/u), '').replace('.md', '.html')}`,  // `/blog/` からのルート相対パスを生成して結合する
      updated: postFrontMatter.created + 'T' + time + ':00:00Z',  // 'YYYY-MM-DDTHH:mm:ssZ' 形式にする
      summary: postFrontMatter.title
    };
  });

/**
 * 配列からエントリ部分の文字列を構築する
 * 
 * @param {Array<object>} latests フィード情報
 * @return {string} フィードのエントリ部分の文字列
 */
const createEntries = latests => latests
  .map(item => `  <entry>
    <title>${item.title}</title>
    <id>${item.link}</id>
    <link rel="alternate" type="text/html" href="${item.link}" />
    <updated>${item.updated}</updated>
    <summary>${item.summary}</summary>
  </entry>`)
  .join('\n');

const news = getLatestNews();
const blogPosts = getLatestBlogPosts();
const latests = [...news, ...blogPosts]
  .sort((a, b) => {  // 降順ソートになるよう記述する
    if(a.updated > b.updated) return -1;
    if(a.updated < b.updated) return  1;
    return 0;
  })
  .slice(0, constants.feeds.feedsCount);  // マージ後絞る
const entries = createEntries(latests);

const template = fs.readFileSync(path.resolve(__dirname, `../${constants.feeds.src}`), 'utf-8');
const feeds = template
  .replace((/{{ host }}/g), `${constants.protocol}${constants.host}/`)
  .replace('{{ site-name }}', constants.siteName)
  .replace('{{ author }}', constants.author)
  .replace('{{ feeds-path }}', `${constants.protocol}${constants.host}${constants.feeds.canonical}`)
  .replace('{{ updated }}', latests[0].updated)
  .replace('{{ entries }}', entries);
const distFilePath = path.resolve(__dirname, `../${constants.feeds.dist}`);
makeDirectory(distFilePath, true);
fs.writeFileSync(distFilePath, feeds, 'utf-8');

console.log('Build Feeds : Succeeded');
