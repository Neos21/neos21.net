const path = require('path');

const FtpClient = require('ftp-client');

const listFiles = require('../lib/list-files');

/*!
 * `./dist/` 配下の HTML ファイルと CSS ファイルを全てアップロードする
 */

const distHtmlFiles = listFiles(path.resolve(__dirname, '../dist'))
  .filter((filePath) => filePath.endsWith('.html') || filePath.endsWith('.css'))
  .map((filePath) => filePath.replace((/.*\/dist\//u), 'dist/'));

const ftpClient = new FtpClient({
  user    : 'neo',
  password: process.env['FTP_PASSWORD'],
  host    : 's21.xrea.com'
}, {
  logging: 'debug',
  overwrite: 'all'
});
ftpClient.connect(() => {
  console.log('Connected');
  ftpClient.upload(
    distHtmlFiles,
    '/public_html/',
    {
      baseDir: 'dist',
      overwrite: 'all'
    },
    (result) => {
      if(result.errors && Object.keys(result.errors).length) {
        console.error('Upload Error');
        console.error(result);
        throw new Error('Upload Error');
      }
      
      console.log('Uploaded')
      console.log(result);
    }
  );
});
