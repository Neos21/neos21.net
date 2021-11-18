const childProcess = require('child_process');
const fs = require('fs');

const constants = require('../lib/constants');
const isExist = require('../lib/is-exist');
const makeDirectory = require('../lib/make-directory');

/*!
 * 指定日付のブログ記事の雛形ファイルを配置する
 */

(async () => {
  let year  = '';
  let month = '';
  let date  = '';
  
  const inputDate = process.argv[2];
  if(!inputDate) {
    // 引数指定がない場合は明日日付のファイルを作るか尋ねる
    const jstTomorrow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    jstTomorrow.setDate(jstTomorrow.getDate() + 1);  // 1日後
    year  = jstTomorrow.getFullYear();
    month = ('0' + (jstTomorrow.getMonth() + 1)).slice(-2);
    date  = ('0' +  jstTomorrow.getDate()      ).slice(-2);
    
    // https://qiita.com/suin/items/f18a7dd291d1e1319f44
    const readText = () => {
      process.stdin.resume();
      return new Promise(resolve => process.stdin.once('data', resolve)).finally(() => process.stdin.pause()).then(text => text.toString().trim());
    };
    process.stdout.write(`明日日付 ${year}-${month}-${date} で記事ファイルを作りますか？ > `);
    const answer = await readText();
    if(answer !== 'y') return console.log('Please Input Date : ex. YYYY-MM-DD, YYYYMMDD, MM-DD, MMDD');
  }
  else {
    // 不正な日付だと toString() が 'Invalid Date' を返す
    const isValidDateString = (yearString, monthString, dateString) => {
      const newDateString = new Date(Number(yearString), Number(monthString) - 1, Number(dateString));
      if(newDateString.toString() === 'Invalid Date') return false;
      return (newDateString.getMonth() + 1) === Number(monthString);  // 月が同じなら正常値 (月末日付は翌月頭の日付として通るため)
    };
    
    const yyyyMmDdMatch = inputDate.match((/^([0-9]{4})-?([0-9]{2})-?([0-9]{2})$/u));  // `YYYY-MM-DD` or `YYYYMMDD`
    if(yyyyMmDdMatch && isValidDateString(yyyyMmDdMatch[1], yyyyMmDdMatch[2], yyyyMmDdMatch[3])) {
      year  = yyyyMmDdMatch[1];
      month = yyyyMmDdMatch[2];
      date  = yyyyMmDdMatch[3];
    }
    else {
      const mmDdMatch = inputDate.match((/^([0-9]{2})-?([0-9]{2})$/u));  // `MM-DD` or `MMDD`
      const currentYear = String(new Date().getFullYear());
      if(mmDdMatch && isValidDateString(currentYear, mmDdMatch[1], mmDdMatch[2])) {
        year  = currentYear;
        month = mmDdMatch[1];
        date  = mmDdMatch[2];
      }
    }
  }
  
  if(!year || !month || !date) return console.log('Invalid Input Date');
  
  const template = fs.readFileSync(`${constants.src}/templates/blog-post.md`, 'utf-8');
  let createdFilePath = '';
  for(let num = 1; num < 100; num++) {
    const padNum = `0${num}`.slice(-2);
    const distFilePath = `${constants.pages.src}/blog/${year}/${month}/${date}-${padNum}.md`;
    makeDirectory(distFilePath, true);  // 月までのディレクトリがない場合もあるので作っておく
    
    if(!isExist(distFilePath)) {
      const output = template.replace((/YYYY/gu), year).replace((/MM/gu), month).replace((/DD/gu), date);
      fs.writeFileSync(distFilePath, output, 'utf-8');
      createdFilePath = distFilePath;
      console.log(`Write : [${distFilePath}]`);
      break;
    }
    
    // 連番が振れなかった場合
    if(num >= 99) throw new Error(`Cannot Write File [${inputDate}] [${distFilePath}]`);
  }
  
  // 年の index.md がなければ作る
  const yearIndexFilePath = `${constants.pages.src}/blog/${year}/index.md`;
  if(!isExist(yearIndexFilePath)) {
    const templateYearIndex = fs.readFileSync(`${constants.src}/templates/blog-year-index.md`, 'utf-8');
    const output = templateYearIndex.replace((/YYYY/gu), year);
    fs.writeFileSync(yearIndexFilePath, output, 'utf-8');
    console.log(`Write Year Index : [${yearIndexFilePath}]`);
  }
  
  // 月の index.md がなければ作る
  const monthIndexFilePath = `${constants.pages.src}/blog/${year}/${month}/index.md`;
  if(!isExist(monthIndexFilePath)) {
    const templateMonthIndex = fs.readFileSync(`${constants.src}/templates/blog-month-index.md`, 'utf-8');
    const output = templateMonthIndex.replace((/YYYY/gu), year).replace((/MM/gu), month);
    fs.writeFileSync(monthIndexFilePath, output, 'utf-8');
    console.log(`Write Month Index : [${monthIndexFilePath}]`);
  }
  
  console.log('Create Blog Post : Succeeded');
  try {
    childProcess.execFileSync('code', ['-a', createdFilePath]);
  }
  catch(_error) {
    // Nothing To Do
  }
})();
