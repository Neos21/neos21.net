/**
 * FTP Upload Files
 */

const productionConfig = require('./production-config');
const userName = productionConfig.ftp.userName;
const password = productionConfig.ftp.password;
const host     = productionConfig.ftp.host;

// https://www.npmjs.com/package/ftp-client
const FtpClient = require('ftp-client');
const ftpClient = new FtpClient({
  user    : userName,
  password: password,
  host    : host
}, {
  logging: 'debug',
  overwrite: 'all'
});

ftpClient.connect(() => {
  console.log('★ Connected');
  
  ftpClient.upload(
    [
      'dist/test.html'
    ],
    '/public_html/',
    {
      baseDir: 'dist',
      overwrite: 'all'
    }, (result) => {
      console.log('★ Uploaded \n', result);
    });
});
