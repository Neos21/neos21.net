const fs = require('fs');
const path = require('path');

const constants = require('../lib/constants');
const makeDirectory = require('../lib/make-directory');
const isExist = require('../lib/is-exist');

/*!
 * 指定日付のブログ記事の雛形ファイルを配置する
 */

const inputDate = process.argv[2];
if(!inputDate) return console.log('Please Input Date : ex. YYYY-MM-DD');

const match = inputDate.match((/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/u));
if(!match) return console.log(`Invalid Date [${inputDate}]`);

const year  = match[1];
const month = match[2];
const date  = match[3];

const template = fs.readFileSync('./src/templates/blog-post.md', 'utf-8');

for(let num = 1; num < 100; num++) {
  const padNum = `0${num}`.slice(-2);
  const distFilePath = `${constants.pages.src}/blog/${year}/${month}/${date}-${padNum}.md`;
  makeDirectory(distFilePath, true);  // 月までのディレクトリがない場合もあるので作っておく
  
  if(!isExist(distFilePath)) {
    const output = template.replace((/YYYY/gu), year).replace((/MM/gu), month).replace((/DD/gu), date);
    fs.writeFileSync(distFilePath, output, 'utf-8');
    console.log(`Write [${distFilePath}]`);
    break;
  }
  
  // 連番が触れなかった場合
  if(num >= 99) throw new Error(`Cannot Write File [${inputDate}] [${distFilePath}]`);
}

console.log('Create Blog Post Boilerplate : Succeeded');
