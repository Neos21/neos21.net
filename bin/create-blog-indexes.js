import fs from 'node:fs';
import path from 'node:path';

import { constants } from '../lib/constants.js';
import { isExist } from '../lib/is-exist.js';
import { listDirectories } from '../lib/list-directories.js';

/*!
 * `src/pages/blog/` 配下に年月のディレクトリがあるのに `index.md` がなければ作る
 */

const templateYearIndex  = fs.readFileSync(`${constants.src}/templates/blog-year-index.md` , 'utf-8');
const templateMonthIndex = fs.readFileSync(`${constants.src}/templates/blog-month-index.md`, 'utf-8');

listDirectories(`${constants.pages.src}/blog`).forEach(directoryPath => {
  // 年
  if(directoryPath.match((/([0-9]{4})$/u))) {
    const yearIndexFilePath = path.resolve(directoryPath, './index.md');
    if(!isExist(yearIndexFilePath)) {
      const match = directoryPath.match((/([0-9]{4})$/u));
      const year = match[1];
      const output = templateYearIndex.replace((/YYYY/gu), year);
      fs.writeFileSync(yearIndexFilePath, output, 'utf-8');
      console.log(`Write Year Index : [${yearIndexFilePath}]`);
    }
    return;
  }
  
  if(directoryPath.match((/([0-9]{4})\/([0-9]{2})$/u))) {  // 月
    const monthIndexFilePath = path.resolve(directoryPath, './index.md');
    if(!isExist(monthIndexFilePath)) {
      const match = directoryPath.match((/([0-9]{4})\/([0-9]{2})$/u));
      const year = match[1];
      const month = match[2];
      const output = templateMonthIndex.replace((/YYYY/gu), year).replace((/MM/gu), month);
      fs.writeFileSync(monthIndexFilePath, output, 'utf-8');
      console.log(`Write Month Index : [${monthIndexFilePath}]`);
    }
    return;
  }
  
  console.log(`Unknown Path : [${directoryPath}]`);
});

console.log('Create Blog Indexes : Succeeded');
