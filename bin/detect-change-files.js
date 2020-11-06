const childProcess = require('child_process');

/*!
 * Git の差分ファイル一覧を表示する
 */

const result = childProcess.execFileSync('git', ['status', '--short', '--branch']).toString();
const lines = result
  .split('\n')
  .filter(line => !line.startsWith('## ') && line.trim())
  .map(line => line.slice(3))
  .join('\n');

console.log(lines);
