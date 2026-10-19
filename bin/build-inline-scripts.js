import fs from 'node:fs';

import { minify } from 'terser';

import { constants } from '../lib/constants.js';

/*!
 * インライン JS コードをビルドする・ビルド後のテンプレート HTML への埋め込みは手動で行うこと
 */

(async () => {
  console.log('Build Inline Scripts : Start');
  
  const source = fs.readFileSync(constants.inlineScripts.src, 'utf-8');
  const result = await minify(source, {
    format: {
      quote_style: 1  // シングルクォートにする
    }
  });
  fs.writeFileSync(constants.inlineScripts.dist, result.code, 'utf-8');
  
  console.log('Build Inline Scripts : Succeeded (テンプレート HTML への埋め込みは手動で行ってください)');
})();
