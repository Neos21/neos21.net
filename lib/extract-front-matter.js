import yaml from 'yaml';

/**
 * HTML or Markdown ファイルから Front Matter 部分を抽出する
 * 
 * @param {string} source ソースファイルの内容
 * @return {object} Front Matter の連想配列
 */
export const extractFrontMatter = source => {
  const frontMatterMatch = source.match((/^---\n((.|[\n])+)\n---\n\n/u));
  if(!frontMatterMatch || !frontMatterMatch[1]) throw new Error('Front Matter Section Not Found');
  try {
    const result = yaml.parse(frontMatterMatch[1]);
    return result;
  }
  catch(error) {
    console.error({ source, error });
    throw error;
  }
};
