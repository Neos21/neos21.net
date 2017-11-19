/**
 * FTP Deploy
 */

const productionConfig = require('./production-config');
const userName = productionConfig.ftp.userName;
const password = productionConfig.ftp.password;
const host     = productionConfig.ftp.host;

// https://www.npmjs.com/package/ftp-deploy
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

ftpDeploy.on('uploading', (data) => {
  console.log('★ Uploading \n', data);
});
ftpDeploy.on('uploaded', (data) => {
  console.log('★ Uploaded \n' , data);
});
ftpDeploy.on('upload-error', (data) => {
  console.log('★ Upload Error \n', data);
});

ftpDeploy.deploy({
  username  : userName,
  password  : password,
  host      : host,
  localRoot : 'dist',
  remoteRoot: '/public_html',
  include   : [],
  exclude   : []
}, (error) => {
  if(error) {
    console.log('★ Error', error);
    return;
  }
  
  console.log('★ Deployed');
});
