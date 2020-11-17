const constants = require('../lib/constants');
const jstNow = require('../lib/jst-now');
const detectDirectoryPathsFromFilePaths = require('../lib/detect-directory-paths-from-file-paths');
const ftp = require('../lib/ftp');

/*!
 * 引数で指定されたファイル (1つ以上) をアップロードする
 */

const args = process.argv.slice(2);
if(!args.length) return console.error('Please Select Dist File(s)');

// `dist/` 配下のファイルのみ対象にする
const targetFilePaths = args.filter(targetFilePath => targetFilePath.includes(constants.dist));
if(!targetFilePaths.length) return console.error('Not Uploading Files. Aborted');

// 更新を知らせるためのファイルを追加する
targetFilePaths.push(constants.feeds.dist);
targetFilePaths.push(constants.sitemap.dist);
targetFilePaths.push(`${constants.pages.dist}/index.html`);
targetFilePaths.push(`${constants.pages.dist}/about/new.html`);
targetFilePaths.push(`${constants.pages.dist}/blog/index.html`);
targetFilePaths.push(`${constants.pages.dist}/blog/${jstNow.jstCurrentYear}/index.html`);
targetFilePaths.push(`${constants.pages.dist}/blog/${jstNow.jstCurrentYear}/${jstNow.zeroPadJstCurrentMonth}/index.html`);
console.log('Target File Paths :\n', targetFilePaths);

// アップロード対象のディレクトリパス・ファイルパスの配列を作る
const directoryPaths = detectDirectoryPathsFromFilePaths(targetFilePaths);
const uploadFilePaths = [...directoryPaths, ...targetFilePaths];

(async () => {
  const ftpClient = ftp.create();
  await ftp.connect(ftpClient);
  await ftp.upload(ftpClient, uploadFilePaths)
    .then(result => console.log(result))
    .catch(error => console.error(error));
  console.log('Upload Files : Succeeded');
})();
