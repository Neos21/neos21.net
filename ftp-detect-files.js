const childProcess = require('child_process');

childProcess.exec('git status --short', (error, stdout, stderr) => {
  if(error) {
    console.error('Error', stderr);
    return;
  }
  
  console.log('    [');
  stdout.split('\n')
    .map((line) => {
      return line.slice(3);
    })
    .filter((line) => {
      return line.startsWith('docs/');
    })
    .forEach((line) => {
      console.log(`      '${line}',`);
    });
  console.log('    ],');
});
