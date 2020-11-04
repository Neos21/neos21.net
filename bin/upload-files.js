const constants = require('../lib/constants');
const ftp = require('../lib/ftp');

/*!
 * 引数で指定されたファイル (1つ以上) をアップロードする
 */

(async () => {
  const args = process.argv.slice(2);
  if(!args.length) return console.error('Please Select Dist File(s)');
  
  // `./dist/` 配下のファイルのみ対象にする
  const targetFilePaths = args.filter(targetFilePath => targetFilePath.includes(constants.dist));
  if(!targetFilePaths.length) return console.error('Not Uploading Files, Aborted');
  console.log('Target File Paths :\n', targetFilePaths);
  
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, targetFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
})();
