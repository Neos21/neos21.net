const ftp = require('../../lib/ftp');

const uploadFiles = require('../../temp/upload-files.json');

/*!
 * アップロード対象のファイルを FTP アップロードする
 */

(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFiles)
    .then(result => console.log(result))
    .catch(error => console.error(error));
})();
