const childProcess = require('child_process');
const fs = require('fs');

const constants = require('../lib/constants');
const isExist = require('../lib/is-exist');
const isNotFuture = require('../lib/is-not-future');
const makeDirectory = require('../lib/make-directory');

/*!
 * 指定日付のブログ記事の雛形ファイルを配置する
 */

/**
 * プロンプトでユーザ入力を受け付ける
 * 
 * https://qiita.com/suin/items/f18a7dd291d1e1319f44
 * 
 * @param {string} questionText 質問文
 * @return {Promise<string>} ユーザが入力した文字列・改行や空白は除去しておく
 */
const readText = (questionText) => {
  process.stdout.write(`${questionText ? questionText + ' ' : ''}> `);
  process.stdin.resume();
  return new Promise(resolve => process.stdin.once('data', resolve)).finally(() => process.stdin.pause()).then(text => text.toString().trim());
};

/**
 * 指定年月日のブログ記事の雛形ファイルを作成する
 * 
 * @param {string} year 西暦・数字4桁の文字列
 * @param {string} month 月・ゼロパディング2桁の文字列
 * @param {string} date 日・ゼロパディング2桁の文字列
 */
const createBlogPost = (year, month, date) => {
  if(!year || !month || !date) return console.log('Invalid Arguments');
  
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
    if(num >= 99) throw new Error(`Cannot Write File [${distFilePath}]`);
  }
  
  // 年の `index.md` がなければ作る
  const yearIndexFilePath = `${constants.pages.src}/blog/${year}/index.md`;
  if(!isExist(yearIndexFilePath)) {
    const templateYearIndex = fs.readFileSync(`${constants.src}/templates/blog-year-index.md`, 'utf-8');
    const output = templateYearIndex.replace((/YYYY/gu), year);
    fs.writeFileSync(yearIndexFilePath, output, 'utf-8');
    console.log(`Write Year Index : [${yearIndexFilePath}]`);
  }
  
  // 月の `index.md` がなければ作る
  const monthIndexFilePath = `${constants.pages.src}/blog/${year}/${month}/index.md`;
  if(!isExist(monthIndexFilePath)) {
    const templateMonthIndex = fs.readFileSync(`${constants.src}/templates/blog-month-index.md`, 'utf-8');
    const output = templateMonthIndex.replace((/YYYY/gu), year).replace((/MM/gu), month);
    fs.writeFileSync(monthIndexFilePath, output, 'utf-8');
    console.log(`Write Month Index : [${monthIndexFilePath}]`);
  }
  
  console.log('Create Blog Post : Succeeded');
  // 可能なら VSCode で対象ファイルを開く
  try {
    childProcess.execFileSync('code', ['-a', createdFilePath]);
  }
  catch(_error) {
    // Nothing To Do
  }
};

/**
 * 指定年月日の文字列が日付として正しいかどうか判定する
 * 
 * @param {string} year 西暦・数字4桁の文字列
 * @param {string} month 月・ゼロパディング2桁の文字列
 * @param {string} date 日・ゼロパディング2桁の文字列
 * @return {boolean} 指定年月日の文字列が正しい日付なら `true`・正しくなければ `false`
 */
const isValidDateString = (year, month, date) => {
  const newDateString = new Date(Number(year), Number(month) - 1, Number(date));
  if(newDateString.toString() === 'Invalid Date') return false;
  return (newDateString.getMonth() + 1) === Number(month);  // 月が同じなら正常値 (月末日付は翌月頭の日付として通るため)
};

(async () => {
  let input = process.argv[2];
  
  // 引数指定がない場合
  if(!input) {
    // 現在月の既にある日付の翌日日付で作成するかどうか (翌月の2日以降の日付は割り出せないので非対応)
    const currentYear  = String(new Date().getFullYear());
    const currentMonth = `0${new Date().getMonth() + 1}`.slice(-2);
    
    const currentMonthDirectory = `${constants.pages.src}/blog/${currentYear}/${currentMonth}`;
    if(isExist(currentMonthDirectory)) {
      const currentPostDates = fs.readdirSync(currentMonthDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md') && !dirent.name.startsWith('index'))  // 記事の Markdown ファイルのみに絞る
        .map((dirent) => dirent.name.replace('.md', '').replace((/-[0-9]{2}/u), ''))  // `31-01.md` などのファイル名を `31` と日付部分のみ抽出する
        .sort();  // 念のため昇順にする
      // 最新の日付から翌日を割り出す
      const latestDate = currentPostDates[currentPostDates.length - 1];
      const next = new Date(Number(currentYear), Number(currentMonth) - 1, Number(latestDate));
      next.setDate(next.getDate() + 1);  // 1日後
      const nextYear  = String(next.getFullYear());
      const nextMonth = `0${next.getMonth() + 1}`.slice(-2);
      const nextDate  = `0${next.getDate()     }`.slice(-2);
      // 「最新の日付の翌日」が未来日であるかどうか
      if(!isNotFuture(Number(nextYear), Number(nextMonth), Number(nextDate))) {
        const nextAnswer = await readText(`最新日付 ${nextYear}-${nextMonth}-${nextDate} で記事ファイルを作りますか？`);
        if(nextAnswer === 'y') return createBlogPost(nextYear, nextMonth, nextDate);
      }
    }
    
    // 明日日付で作成するかどうか
    const jstTomorrow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    jstTomorrow.setDate(jstTomorrow.getDate() + 1);  // 1日後
    const tomorrowYear  = String(jstTomorrow.getFullYear());
    const tomorrowMonth = `0${jstTomorrow.getMonth() + 1}`.slice(-2);
    const tomorrowDate  = `0${jstTomorrow.getDate()     }`.slice(-2);
    const tomorrowAnswer = await readText(`明日日付 ${tomorrowYear}-${tomorrowMonth}-${tomorrowDate} で記事ファイルを作りますか？`);
    if(tomorrowAnswer === 'y') return createBlogPost(tomorrowYear, tomorrowMonth, tomorrowDate);
    
    // 今日日付で作成するかどうか
    const currentDate  = `0${new Date().getDate()     }`.slice(-2);
    const currentAnswer = await readText(`今日日付 ${currentYear}-${currentMonth}-${currentDate} で記事ファイルを作りますか？`);
    if(currentAnswer === 'y') return createBlogPost(currentYear, currentMonth, currentDate);
    
    // 引数に相当する年月日の入力を受け付ける (この `if` ブロックを抜けて後続処理につなげる)
    input = await readText('年月日を入力してください (ex. YYYY-MM-DD, YYYYMMDD, MM-DD, MMDD, DD)');
  }
  
  // `YYYY-MM-DD` or `YYYYMMDD` : 過去日でもそのまま作成する
  const yyyyMmDdMatch = input.match((/^([0-9]{4})-?([0-9]{2})-?([0-9]{2})$/u));
  if(yyyyMmDdMatch && isValidDateString(yyyyMmDdMatch[1], yyyyMmDdMatch[2], yyyyMmDdMatch[3])) {
    return createBlogPost(yyyyMmDdMatch[1], yyyyMmDdMatch[2], yyyyMmDdMatch[3]);
  }
  
  // `MM-DD` or `MMDD` : 現在年を補完してあげる・過去日でもそのまま作成する
  const mmDdMatch   = input.match((/^([0-9]{2})-?([0-9]{2})$/u));
  const currentYear = String(new Date().getFullYear());
  if(mmDdMatch && isValidDateString(currentYear, mmDdMatch[1], mmDdMatch[2])) {
    return createBlogPost(currentYear, mmDdMatch[1], mmDdMatch[2]);
  }
  
  // `DD` : 現在年月を補完してあげる・過去日になった場合は翌月の指定日で作成するか過去日のまま作成するか問う
  const ddMatch = input.match((/^([0-9]{2})$/u));
  if(ddMatch) {
    const date = ddMatch[1];
    
    // 今月の今日以降の日付 : そのまま作成し終了する
    const currentMonth = `0${new Date().getMonth() + 1}`.slice(-2);
    const currentDate  = `0${new Date().getDate()     }`.slice(-2);
    if(isValidDateString(currentYear, currentMonth, date) && date >= currentDate) {
      return createBlogPost(currentYear, currentMonth, date);
    }
    
    // 今月の昨日以前の日付が入力された場合 : 翌月の日付で作成するか先に問い、拒否されたら過去日のまま作成するか問う
    
    // 12月時点に過去日の `DD` を書いた場合は翌年1月にする
    const nextYear  = currentMonth === '12' ? String(new Date().getFullYear() + 1) : currentYear;
    const nextMonth = currentMonth === '12' ? '01'                                 : `0${new Date().getMonth() + 2}`.slice(-2);
    
    // 翌月・現在月いずれでも不正な値であれば終了する
    if(!isValidDateString(nextYear, nextMonth, date) && !isValidDateString(currentYear, currentMonth, date)) {
      return console.log(`Invalid Date [${input}]`);
    }
    
    if(isValidDateString(nextYear, nextMonth, date)) {
      const futureAnswer = await readText(`翌月の ${nextYear}-${nextMonth}-${date} で記事ファイルを作りますか？`);
      if(futureAnswer === 'y') return createBlogPost(nextYear, nextMonth, date);
    }
    if(isValidDateString(currentYear, currentMonth, date)) {
      const pastAnswer = await readText(`過去日 ${currentYear}-${currentMonth}-${date} で記事ファイルを作りますか？`);
      if(pastAnswer === 'y') return createBlogPost(currentYear, currentMonth, date);
    }
    
    return console.log(`Aborted [${input}]`);
  }
  
  console.log(`Invalid Input [${input}]`);
})();
