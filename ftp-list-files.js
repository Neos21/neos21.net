/**
 * FTP List Files
 */

const productionConfig = require('./production-config');
const userName = productionConfig.ftp.userName;
const password = productionConfig.ftp.password;
const host     = productionConfig.ftp.host;

// https://www.npmjs.com/package/promise-ftp
const PromiseFtp = require('promise-ftp');
const promiseFtp = new PromiseFtp();

promiseFtp.connect({
  user    : userName,
  password: password,
  host    : host
})
  .then((serverMessage) => {
    console.log('★ Connected ', serverMessage);
    return promiseFtp.cwd('public_html');
  })
  .then((currentDir) => {
    console.log('★ Change Working Directory ', currentDir);
    return promiseFtp.list();
  })
  .then((list) => {
    console.log('★ Directory Listing');
    list.forEach((file) => {
      console.log(`--- ${file.name}${file.type === 'd' ? '/' : ''}`);
    });
  })
  .catch((error) => {
    console.log('★ エラー \n', error);
  })
  .then(() => {
    console.log('★ 切断');
    return promiseFtp.end();
  })
  .then((endResult) => {
    console.log(`★ ${endResult ? '異常終了' : '正常終了'}`);  // false なら正常終了
  })
  .catch((error) => {
    console.log('★ 切断失敗 \n', error);
  });
