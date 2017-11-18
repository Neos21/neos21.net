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
