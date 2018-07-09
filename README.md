# neo.s21.xrea.com

__[Neo's World](http://neo.s21.xrea.com/)__ のソースコードを管理するリポジトリ。


## 開発環境

```sh
# ライブリロード開発
$ npm start

# リンク切れチェック
$ npm run lint-link

# 全ファイルのビルド
$ npm run build

# HTMLHint チェック
$ npm run lint-html

# TextLint チェック
$ npm run lint-text
```


## ソースの公開

以下のコマンドで FTP 接続・アップロードが可能。

```sh
# FTP サーバの内容確認 (ftp-list-files.js)
$ npm run ftp-list

# ファイルを指定して FTP アップロード (ftp-upload-files.js)
$ npm run ftp-upload

# dist ディレクトリの全量を FTP アップロード (ftp-deploy.js)
$ npm run ftp-deploy
```


## Author

[Neo](http://neo.s21.xrea.com/) ([@Neos21](https://twitter.com/Neos21))


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](http://neos21.hatenablog.com/)
- [Murga](http://neos21.hatenablog.jp/)
- [El Mylar](http://neos21.hateblo.jp/)
- [Bit-Archer](http://bit-archer.hatenablog.com/)
- [GitHub - Neos21](https://github.com/Neos21/)
