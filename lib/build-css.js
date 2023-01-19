import childProcess from 'node:child_process';

/**
 * CSS ファイルをビルドする
 * 
 * - `clean-css` の API は `process.cwd` の位置に影響されて `@import` が解釈できないことがあるので
 *   `clean-css-cli` を使った `npm run` スクリプトを呼び出すことにする
 */
export const buildCss = () => {
  const result = childProcess.execFileSync('npm', ['run', 'build-css']);
  console.log(result.toString());
};
