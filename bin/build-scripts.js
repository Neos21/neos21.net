import fs from 'node:fs';

import { minify } from 'terser';

import { constants } from '../lib/constants.js';

/*!
 * JS をビルドする・ビルドしたファイルは `src/pages/` 直下に出力され、`dist/` 直下への出力はしない点に留意
 */

(async () => {
  console.log('Build Scripts : Start');
  
  const source = fs.readFileSync(constants.scripts.src, 'utf-8');
  const result = await minify(source, {
    format: {
      quote_style: 1  // シングルクォートにする
    }
  });
  fs.writeFileSync(constants.scripts.dist, result.code, 'utf-8');
  
  console.log('Build Scripts : Succeeded');
})();
