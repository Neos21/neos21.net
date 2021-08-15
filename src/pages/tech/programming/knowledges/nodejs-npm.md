---
title        : Node.js npm
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
  - /tech/programming/knowledges/index.html プログラミング関連ナレッジ
---

Node.js の中でも npm に関する情報。


## 目次


## npm パッケージのバージョニング表記 (SemVer)

npm パッケージのバージョンには慣例的に SemVer (Semantic Versioning) と呼ばれるバージョン体系が採用されることが多い。

- `Major.Minor.Patch` と表記する (ex. `1.0.2`)
  - Major : 後方互換性のない変更 (メジャーバージョンアップ)
  - Minor : 後方互換性のある機能追加 (マイナーバージョンアップ)
  - Patch : 後方互換性のあるバグ修正 (パッチバージョンアップ)
- 参考：[semverとnpm - tohashi's blog](http://64.hateblo.jp/entry/2014/04/25/045940)
- 参考：[npm semantic version calculator](https://semver.npmjs.com/)

`package.json` のチルダ `~` とキャレット `^` の見方まとめ。

- チルダ `~` : 記載した以下のバージョニングが上がることを許容する
  - `~1.1.2` : 1.1.2 <= version < 1.2.0
  - `~1.1` : = 1.1.x
  - `~1` : = 1.x
- キャレット `^` : 一番左にあるゼロでないバージョニングを変えない
  - `^1.2.3` : 1.2.3 <= version < 2.0.0
  - `^0.2.3` : 0.2.3 <= version < 0.3.0
  - `^0.0.3` : 0.0.3 <= version < 0.0.4
