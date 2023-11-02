---
title        : 命名による区別が重要
created      : 2023-02-16
last-modified: 2023-02-16
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/design/index.html 設計
---

名著「プログラマが知るべき97のこと」にも「**名前重要**」というエッセイがある。

- [名前重要 | プログラマが知るべき97のこと](https://xn--97-273ae6a4irb6e2hsoiozc2g4b8082p.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/%E5%90%8D%E5%89%8D%E9%87%8D%E8%A6%81/)

機能や画面、変数名などに命名するということは、そのモノを定義し、*他のモノと区別する*ことも含まれる。

名前は原則として一つのモノに一つしか与えられない。システム内での定義にもよるが、「一般ユーザ」と「会員メンバ」は会員登録の有無で区別されるだろうし、「ログイン画面」から新規登録や退会処理ができるような動線設計は*命名が不自然*といえる。コレは「**単一責務の原則**」にも通じるモノがある。

クラス名や変数名のように英語で命名する場合もそうだし、設計書のファイル名や見出しのように日本語で書く場合も同じ。どこからどこまでのことを「ソレ」と呼び、「アレ」や「コレ」とは違うモノであると定義付ける、その最初の入口は「命名」なのである。

- 関連ブログ記事 : 2016-12-08 [エンジニア必須スキル : 名前を正しく付け、正確に区別する](/blog/2016/12/08-01.html)
- 関連ブログ記事 : 2018-01-11 [命名：名前を付けることの大切さ](/blog/2018/01/11-01.html)