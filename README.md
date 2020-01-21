# Neo's World : neo.s21.xrea.com

__[Enter This Website](http://neo.s21.xrea.com/)__

- __[Mirror (GitHub Pages)](https://neos21.github.io/neo.s21.xrea.com/)__


## 開発環境

```sh
# Git 管理除外
$ git update-index --skip-worktree production-config.js ftp-deploy.js ftp-detect-files.js ftp-list-files.js ftp-upload-files.js

# ライブリロード開発
$ npm start

# リンク切れチェック
$ npm run lint-link

# 全ファイルのビルド
$ npm run build

# HTMLHint チェック
$ npm run lint-html
```


## ソースの公開

以下のコマンドで FTP 接続・アップロードが可能。

```sh
# FTP サーバの内容確認 (ftp-list-files.js)
$ npm run list

# ファイルを指定して FTP アップロード (ftp-upload-files.js)
$ npm run upload

# docs ディレクトリの全量を FTP アップロード (ftp-deploy.js)
$ npm run deploy
```


## GitHub Pages ミラーについて

<https://neos21.github.io/neo.s21.xrea.com/> でミラーサイトを公開している。

`link`・`script`・`a`・`img` 要素の属性値において、ルート相対パスで表記している箇所が多数存在するが、GitHub Pages におけるルートは <https://neos21.github.io/> と見なされてしまうため、正しくファイルが読み込まれない。

- 例 : `<a href="/index.html">`
    - 期待する値 : `https://neos21.github.io/neo.s21.xrea.com/index.html`
    - 実際の解釈 : `https://neos21.github.io/index.html`
    - `<base href="https://neos21.github.io/neo.s21.xrea.com/">` などでの制御もできなかった

全ての HTML ページは `<script src="/scripts.js">` を読み込もうとしていることを利用して、[Neo's GitHub Pages](https://github.com/Neos21/neos21.github.io) のルート直下に `scripts.js` を作成し、このファイルを読み込ませるようにした。

<https://neos21.github.io/scripts.js> では、ルート相対パスの表記を探し出して一括置換する他、XREA の広告コードを削除している。


## Author

[Neo](http://neo.s21.xrea.com/) ([@Neos21](https://twitter.com/Neos21))


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](http://neos21.hatenablog.com/)
- [Murga](http://neos21.hatenablog.jp/)
- [El Mylar](http://neos21.hateblo.jp/)
- [Neo's GitHub Pages](https://neos21.github.io/)
- [GitHub - Neos21](https://github.com/Neos21/)
- [GitHub - Neos21 - neo.s21.xrea.com](https://github.com/Neos21/neo.s21.xrea.com)
