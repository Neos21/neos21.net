const fs = require('fs');
const path = require('path');

const listFiles = require('../lib/list-files');
const makeDirectory = require('../lib/make-directory');

/** ホスト名・後ろに `/` 始まりのルート相対パスを付与できるよう末尾スラッシュなし */
const host = 'https://neos21.net';

const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
const pages = listFiles(path.resolve(__dirname, '../src/pages'))
  .filter((filePath) => filePath.endsWith('.html') || filePath.endsWith('.md'))
  .filter((filePath) => !filePath.includes('403.html') && !filePath.includes('404.html') && !filePath.includes('500.html'))
  .map((filePath) => filePath.replace((/.*\/src\/pages/u), host).replace('.md', '.html'))
  .map((filePath) => `  <url><loc>${filePath}</loc></url>`)
  .sort()
  .join('\n');
const footer = `\n</urlset>\n`;

const sitemap = header + pages + footer;

makeDirectory(path.resolve(__dirname, '../dist/.gitkeep'));  // `path.dirname()` を使っているので適当なファイル名を与えておく
fs.writeFileSync(path.resolve(__dirname, '../dist/sitemap.xml'), sitemap, 'utf-8');