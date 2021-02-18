const yaml = require('yaml');

/**
 * HTML ファイルから Front Matter 部分を抽出する
 * 
 * @param {string} source ソースファイルの内容
 * @return {object} Front Matter の連想配列
 */
module.exports = function htmlExtractFrontMatter(source) {
  const frontMatterMatch = source.match((/^---\n((.|[\n])+)\n---\n\n/u));
  if(!frontMatterMatch || !frontMatterMatch[1]) throw new Error('HTML Front Matter Section Not Found');
  return yaml.parse(frontMatterMatch[1]);
};
