const FtpClient = require('ftp-client');

const constants = require('./constants');

/**
 * FTP クライアントを生成する
 * 
 * @return {FtpClient} FTP クライアント
 */
const create = () => new FtpClient({
  user    : constants.ftp.userName,
  password: process.env['FTP_PASSWORD'],
  host    : constants.ftp.host
}, {
  logging: 'debug',
  overwrite: 'all'
});

/**
 * FTP 接続する
 * 
 * @param {FtpClient} ftpClient FTP クライアント
 * @return {Promise<void>} 接続後 Resolve する
 */
const connect = ftpClient => new Promise(resolve => ftpClient.connect(() => resolve()));

/**
 * FTP アップロードする
 * 
 * @param {FtpClient} ftpClient FTP クライアント
 * @param {Array<string>} targetFilePaths アップロードするファイルパスの配列
 * @return {Promise<object>} アップロード結果
 */
const upload = (ftpClient, targetFilePaths) => new Promise((resolve, reject) => ftpClient.upload(
  targetFilePaths,
  constants.ftp.baseDirectoryPath,
  { baseDir: constants.dist, overwrite: 'all' },
  result => (result.errors && Object.keys(result.errors).length) ? reject(result.errors) : resolve(result)
));

/** FTP */
const ftp = { create, connect, upload };
module.exports = ftp;
