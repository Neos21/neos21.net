const yaml = require('yaml');
const unified = require('unified');
const remarkParse = require('remark-parse');  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkRehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');

/** Front Matter 情報を抽出する際のキー */
const frontMatterDataKey = 'frontMatter';

/** Markdown を扱う Processor */
const processor = unified()
  .use(remarkParse, { commonmark: true, gfm: true, pedantic: false })
  .use(remarkFrontmatter, [{ type: 'yaml', marker: '-', anywhere: false }])
  .use(remarkExtractFrontmatter, { yaml: yaml.parse, name: frontMatterDataKey })
  .use(remarkRehype)
  .use(rehypeStringify);

/**
 * Markdown から Front Matter 部分を抽出する
 * 
 * @param {string} source Markdown ソース
 * @return {object} Front Matter の連想配列
 */
module.exports = function markdownExtractFrontMatter(source) {
  const result = processor.processSync(source);
  return result.data[frontMatterDataKey];
};
