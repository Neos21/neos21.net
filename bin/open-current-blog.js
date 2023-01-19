import childProcess from 'node:child_process';

import { constants } from '../lib/constants.js';
import { jstCurrentYear, zeroPadJstCurrentMonth } from '../lib/jst-now.js';

/*!
 * VSCode で現在月のディレクトリを開く
 */

try {
  const currentBlogIndexPath = `${constants.pages.src}/blog/${jstCurrentYear}/${zeroPadJstCurrentMonth}/index.md`;
  childProcess.execFileSync('code', ['-a', currentBlogIndexPath]);
}
catch(error) {
  console.error('Error', error);
}
