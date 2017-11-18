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
    console.dir(list);
    return promiseFtp.end();
  })
  .then((endResult) => {
    console.log('★ End ', endResult); // false なら正常終了
  })
  .catch((error) => {
    console.log('★ Error \n', error);
  });
