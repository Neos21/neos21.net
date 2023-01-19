import fs from 'node:fs';

import { makeDirectory } from './make-directory.js';

/**
 * 指定のファイルを `dist/` ディレクトリにコピーする
 * 
 * @param {string} sourceFilePath ソースファイルのパス (`src/pages/` から指定する)
 * @param {string} distFilePath コピー先ファイルパス
 */
export const copyFile = (sourceFilePath, distFilePath) => {
  try {
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
  catch(_error) {
    makeDirectory(distFilePath, true);
    fs.copyFileSync(sourceFilePath, distFilePath);
  }
};
