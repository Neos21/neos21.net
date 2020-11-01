const FtpClient = require('ftp-client');

const uploadFiles = require('../../temp/upload-files.json');

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
    uploadFiles,
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
