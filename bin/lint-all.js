import fs from 'node:fs';

import { HtmlValidate } from 'html-validate';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';

import { constants } from '../lib/constants.js';
import { extractFrontMatter } from '../lib/extract-front-matter.js';
import { listFiles } from '../lib/list-files.js';

/*!
 * Markdown・HTML ファイルの構文チェックを行う
 * 
 * 時々手動で流してチェックすること
 */

/** HTML-Validate のルール https://html-validate.org/rules/index.html */
const htmlvalidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'element-permitted-order': 'off',  // `tbody` 要素を `tfoot` 要素より後に書くと怒られるのは解せない
    'form-dup-name': 'off',  // `test.html` でのみ引っかかるので無視する (`name="checkbox"` が重複しているのが怒られてる)
    'no-inline-style': 'off',  // インラインスタイルを許容する
    'prefer-button': 'off',  // `input[type="button"]` で良いじゃねえか
    'script-type': 'off',  // `old-diary-2005.html` でのみ引っかかるので無視する (`type="text/javascript"` と書かせてくれ)
    'wcag/h30': 'off',  // 中にテキストがない (画像だけの) `a` 要素を許容する
    'wcag/h37': 'off',  // `alt` 属性のない `img` 要素を許容する
    'wcag/h63': 'off'  // `table` 要素内のセルに必要とされる属性などを強制しない
  }
});

/** Rehype 前の Markdown についてアスタリスクによる強調構文が正しくパースできていない可能性がある場所を検出する */
const remarkLintAsterisk = () => (tree, file) => {
  const walk = node => {
    if(node == null || typeof node !== 'object' || node.type === 'yaml') return;
    if(node.type === 'text' && typeof node.value === 'string' && node.value.includes('*')) file.message('アスタリスク強調が CommonMark として成立していない可能性があります', node);
    if(Array.isArray(node.children)) for(const child of node.children) walk(child);
  };
  walk(tree);
};

/** Rehype 前の Markdown 内に含まれる HTML ソースコードを抽出し検証する */
const remarkLintHtmlValidate = () => (tree, file) => {
  const extractRawHtml = treeNode => {
    const blocks = [];
    const walk = node => {
      if(node == null || typeof node !== 'object') return;
      if(node.type === 'html' && typeof node.value === 'string') blocks.push(node.value);
      if(Array.isArray(node.children)) for(const child of node.children) walk(child);
    };
    walk(treeNode);
    return blocks.join('\n');
  };
  
  const rawHtml = extractRawHtml(tree);
  if(rawHtml == null || rawHtml === '') return;
  
  const report = htmlvalidate.validateStringSync(rawHtml);
  if(!report.valid) report.results.forEach(result => {
    result.messages.forEach(message => {
      file.message(`[${message.ruleId}] ${message.message}`, tree);
    });
  });
};

/** Rehype 後の HTML 要素について `h1` 要素の使用箇所があったらメッセージを出力する */
const rehypeLintNoH1 = () => (tree, file) => {
  const walk = node => {
    if(node.type === 'element' && node.tagName === 'h1') file.message('h1 要素は使用禁止です', node);
    if(node.children) node.children.forEach(walk);
  };
  walk(tree);
};

/** Markdown ファイルを読み込むための Unified プロセッサ */
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)  // パースしておかないと Front Matter の情報が HTML に出力されてしまうのでココで除去する
  .use(remarkLintAsterisk)
  .use(remarkLintHtmlValidate)
  .use(remarkRehype, { allowDangerousHtml: true })  // `script` や `style` 要素が記述されていても流す
  .use(rehypeLintNoH1)
  .use(rehypeStringify, { allowDangerousHtml: true });  // `script` や `style` 要素が記述されていても流す

/** Markdown ファイルをチェックする */
const lintMarkdown = sourceFilePath => {
  const source = fs.readFileSync(sourceFilePath, 'utf-8');
  
  // Front Matter 部分を抽出する
  const frontMatter = extractFrontMatter(source);
  
  // HTML-Validate を使用して Front Matter 内の HTML ソースコードをチェックする
  if(frontMatter.head != null) {
    const headReport = htmlvalidate.validateStringSync(frontMatter.head);
    if(!headReport.valid) headReport.results.forEach(result => {
      result.messages.forEach(message => {
        const column = message.column != null ? message.column : '??';
        console.log(`${sourceFilePath} [Front Matter Head:${column}]  [${message.ruleId}] ${message.message}`);
      });
    });
  }
  
  // Remark・Rehype を使用してチェックする
  const bodyResult = markdownProcessor.processSync(source);
  bodyResult.messages?.forEach(message => {
    const line = message.line != null ? message.line : '??';  // 行番号をそのまま使用する
    const column = message.column != null ? message.column : '??';
    console.log(`${sourceFilePath}:${line}:${column}  ${message.reason}`);
  });
};

/** HTML ファイルを読み込むための Unified プロセッサ */
const htmlProcessor = unified()
  .use(rehypeParse, { fragment: true })  // `html`・`head`・`body` 要素を自動付与しない
  .use(rehypeLintNoH1)
  .use(rehypeStringify, { allowDangerousHtml: true })  // `script`・`style` 要素が記述されていても流す

/** HTML ファイルをチェックする */
const lintHtml = sourceFilePath => {
  const source = fs.readFileSync(sourceFilePath, 'utf-8');
  
  // Front Matter 部分を抽出する
  const frontMatter = extractFrontMatter(source);
  
  // HTML-Validate を使用して Front Matter 内の HTML ソースコードをチェックする
  if(frontMatter.head != null) {
    const headReport = htmlvalidate.validateStringSync(frontMatter.head);
    if(!headReport.valid) headReport.results.forEach(result => {
      result.messages.forEach(message => {
        const column = message.column != null ? message.column : '??';
        console.log(`${sourceFilePath} [Front Matter Head:${column}]  [${message.ruleId}] ${message.message}`);
      });
    });
  }
  if(frontMatter.description != null) {
    const descriptionReport = htmlvalidate.validateStringSync(frontMatter.description);
    if(!descriptionReport.valid) descriptionReport.results.forEach(result => {
      result.messages.forEach(message => {
        const column = message.column != null ? message.column : '??';
        console.log(`${sourceFilePath} [Front Matter Description:${column}]  [${message.ruleId}] ${message.message}`);
      });
    });
  }
  
  // エラー行数を出力するために Front Matter 部分の行数を取得しておく
  const frontMatterLinesMatch = source.match((/^---\n((.|[\n])+)\n---\n\n/u));
  const frontMatterLines = frontMatterLinesMatch != null ? frontMatterLinesMatch[0].split('\n').length - 1 : 0;
  // Front Matter 部分を除去した HTML ソースコードを用意する
  const html = source.replace((/^---\n((.|[\n])+)\n---\n\n/u), '');
  
  // HTML-Validate を使用して閉じタグの漏れを主目的にチェックする
  const report = htmlvalidate.validateStringSync(html);
  if(!report.valid) report.results.forEach(result => {
    result.messages.forEach(message => {
      const line = message.line != null ? message.line + frontMatterLines : '??';
      const column = message.column != null ? message.column : '??';
      console.log(`${sourceFilePath}:${line}:${column}  [${message.ruleId}] ${message.message}`);
    });
  });
  
  // Rehype を使用してチェックする
  const bodyResult = htmlProcessor.processSync(html);
  bodyResult.messages?.forEach(message => {
    const line = message.line != null ? message.line + frontMatterLines : '??';
    const column = message.column != null ? message.column : '??';
    console.log(`${sourceFilePath}:${line}:${column}  ${message.reason}`);
  });
};

// Main
console.log('Lint All : Start');

const sourceFilePaths = listFiles(constants.pages.src);

console.log('Lint All : HTML');
sourceFilePaths
  .filter(sourceFilePath => sourceFilePath.endsWith('.html'))
  .forEach(sourceFilePath => lintHtml(sourceFilePath));

console.log('Lint All : Markdown');
sourceFilePaths
  .filter(sourceFilePath => sourceFilePath.endsWith('.md'))
  .forEach(sourceFilePath => lintMarkdown(sourceFilePath));

console.log('Lint All : Finished');
