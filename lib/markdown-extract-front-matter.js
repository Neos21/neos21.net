import yaml from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/** Front Matter 情報を抽出する際のキー */
const frontMatterDataKey = 'frontMatter';

/** Markdown を扱う Processor */
const processor = unified()
  .use(remarkParse)
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
export const markdownExtractFrontMatter = (source) => {
  const result = processor.processSync(source);
  if(result?.data?.[frontMatterDataKey] == null) {
    console.error('Failed To Parse Markdown Front Matter', result)
    throw new Error('Failed To Parse Markdown Front Matter');
  }
  return result.data[frontMatterDataKey];
};
