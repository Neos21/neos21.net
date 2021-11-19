const childProcess = require('child_process');

const constants = require('../lib/constants');
const jstNow = require('../lib/jst-now');

/*!
 * VSCode で現在月のディレクトリを開く
 */

try {
  const currentBlogIndexPath = `${constants.pages.src}/blog/${jstNow.jstCurrentYear}/${jstNow.zeroPadJstCurrentMonth}/index.md`;
  childProcess.execFileSync('code', ['-a', currentBlogIndexPath]);
}
catch(error) {
  console.error('Error', error);
}
