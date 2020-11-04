const path = require('path');

const constants = require('../lib/constants');
const listFiles = require('../lib/list-files');
const ftp = require('../lib/ftp');

/*!
 * `./dist/` 配下の HTML・CSS・XML ファイルを全てアップロードする
 */

(async () => {
  const targetFilePaths = listFiles(path.resolve(__dirname, `../${constants.dist}`))
    .filter(filePath => ['.html', '.css', '.xml'].includes(path.extname(filePath)))  // HTML・CSS・XML (フィードとサイトマップ) を対象にする
    .map(filePath => filePath.replace(new RegExp(`.*/${constants.dist}/`, 'u'), `${constants.dist}/`));  // `dist/` から始まるように調整する
  if(!targetFilePaths.length) return console.error('Not Uploading Files, Aborted');
  console.log('Target File Paths :\n', targetFilePaths);
  
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, targetFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
})();
