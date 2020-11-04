const childProcess = require('child_process');

/**
 * CSS ファイルをビルドする
 * 
 * NOTE : `clean-css` の API は `process.cwd` の位置に影響されて `@import` が解釈できないことがあるので
 *        `clean-css-cli` を使った `npm run` スクリプトを呼び出すことにする
 */
module.exports = function buildCss() {
  const result = childProcess.execFileSync('npm', ['run', 'css']);
  console.log(result.toString());
};
