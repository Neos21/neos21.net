const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp-client');

const listFiles = require('../lib/list-files');


/*!
 * 引数で指定されたファイル (1つ以上) をアップロードする
 */

const argFiles = process.argv.slice(2);
if(!argFiles.length) return console.error('Please Select Dist File(s)');

// `./dist/` 配下のファイルのみ対象にする
const targetFiles = argFiles.filter((targetPath) => {
  if(targetPath.includes('dist/')) {
    try {
      fs.statSync(targetPath);
      return true;
    }
    catch(_error) {
      console.warn(`Not Exists, Ignore [${targetPath}]`);
      return false;
    }
  }
  console.warn(`Not Dist File, Ignore [${targetPath}]`);
  return false;
});

if(!targetFiles.length) return console.error('Not Uploading Files, Aborted');

console.log('Target Files :\n', targetFiles);

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
    targetFiles,
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
