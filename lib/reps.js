const fs = require('fs')

const listFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const name = `${dir}/${dirent.name}`;
    return dirent.isFile() ? [name] : listFiles(name);
  });
};

const htmlFileNames = listFiles('src/pages').filter(fileName => fileName.endsWith('.html'));

htmlFileNames.forEach((htmlFileName) => {
//const htmlFileName = htmlFileNames[1];
  console.log(htmlFileName);
  const originalHtml = fs.readFileSync(htmlFileName, 'utf-8');
  const pathRegExp = (/\n\{\{ path \}\}\n((.|[\n])+)\n\{\{ \/path \}\}/u);
  const pathMatch = originalHtml.match(pathRegExp);
  if(!pathMatch) {
    return console.log('  Not Match');
  }
  
  const paths = pathMatch[1].split('\n').map((line) => {
    return line.replace((/<li><a href="(.+?)">(.*)<\/a><\/li>/u), '  - $1 $2');
  }).join('\n');
  
  const html = originalHtml.replace(pathRegExp, (match) => {
    return 'path:\n' + paths;
  });
  
  //console.log(html);
  fs.writeFileSync(htmlFileName, html, 'utf-8');
});

/*
    .replace('{{ title }}', '---\ntitle        : ')
    .replace('{{ /title }}', '')
    .replace((/\{\{ cls \}\}(.*)\{\{ \/cls \}\}\n/u), '')
    .replace('{{ created }}', 'created      : ')
    .replace('{{ /created }}', '')
    .replace('{{ last-modified }}', 'last-modified: ')
    .replace('{{ /last-modified }}', '')
    .replace('\n{{ head }}\n{{ /head }}\n', '')
    .replace('{{ /path }}', '{{ /path }}\n---')
    .replace('{{ content }}\n', '')
    .replace('{{ /content }}\n', '');
 */