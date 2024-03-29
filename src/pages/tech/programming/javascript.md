---
title        : JavaScript
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

ECMAScript 全般。ブラウザでも Node.js 上でも変わらない、言語仕様的な情報。


## 目次


## Truthy・Falsy まとめ

- Truthy
  - `{}` (オブジェクト)
  - `'hoge'` (文字列)
  - `1`
  - `-1`
  - `[]` (配列)
- Falsy
  - `''` (空文字)
  - `0` (数値のゼロ)
  - `null`
  - `undefined`

`null` と `undefined` は `if(variable == null)` でまとめて検出できる。

`'0'` (文字列のゼロ) は Truthy。`!` で型反転させても数値にはならないようだが、扱いには注意。必ず文字列に変換するようにしてから扱うと間違いがないかも。

```javascript
const zeroNum = 0;
console.log(  zeroNum ? 'Truthy' : 'Falsy');  // → Falsy
console.log(!!zeroNum ? 'Truthy' : 'Falsy');  // → Falsy

const zeroStr = '0';
console.log(  zeroStr ? 'Truthy' : 'Falsy');  // → Truthy
console.log(!!zeroStr ? 'Truthy' : 'Falsy');  // → Truthy
```
