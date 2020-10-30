const log = require('../lib/create-log')('BUILD_BLOG_ALL');
const listFiles = require('../lib/list-files');
const buildBlog = require('../lib/build-blog');

/*!
 * ./src/blog/ 配下の全ての Markdown ファイルをビルドする
 */
log('Build Blog All : Start');

const mdFilePaths = listFiles('src/blog').filter(filePath => filePath.endsWith('.md'));
mdFilePaths.forEach((mdFilePath) => {
  try {
    log(`  [${mdFilePath}]`);
    buildBlog(mdFilePath);
  }
  catch(error) {
    log(`  Failed To Build [${mdFilePath}]`);
    log(error);
  }
});

log('Build Blog All : Finished');
