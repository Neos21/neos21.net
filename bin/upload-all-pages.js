const path = require('path');

const constants = require('../lib/constants');
const isNotFuture = require('../lib/is-not-future');
const listFiles = require('../lib/list-files');
const ftp = require('../lib/ftp');

/*!
 * `./dist/` 配下の HTML・CSS・XML ファイルを全てアップロードする (ブログは未来日記事を除く)
 */

(async () => {
  const targetFilePaths = listFiles(constants.dist)
    .filter(filePath => ['.html', '.css', '.xml'].includes(path.extname(filePath)))  // HTML・CSS・XML (フィードとサイトマップ) を対象にする
    .filter(filePath => {  // 未来日のブログ記事を除外する
      const match = filePath.match((/\/blog\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/u));
      if(!match) return true;  // マッチしなかったファイルはアップロード対象にする
      const blogYear  = Number(match[1]);
      const blogMonth = Number(match[2]);
      const blogDate  = Number(match[3]);
      return isNotFuture(blogYear, blogMonth, blogDate);
    })
    .map(filePath => filePath.replace(new RegExp(`.*${constants.dist}`, 'u'), constants.dist));  // `dist/` から始まるように調整する
  if(!targetFilePaths.length) return console.error('Not Uploading Files, Aborted');
  console.log('Target File Paths :\n', targetFilePaths);
  
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, targetFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
})();
