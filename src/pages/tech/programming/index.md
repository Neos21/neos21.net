---
title        : プログラミング
created      : 2021-01-27
last-modified: 2021-11-18
path:
  - /index.html Neo's World
  - /tech/index.html Tech
---

プログラミング、実装工程、開発環境構築に関するナレッジやノウハウ。


## 目次


## プログラミングナレッジ

いわゆる「チートシート」集。よく忘れるコマンドや、便利なワンライナーなどの備忘。以下の分類は何となく。

### OS

- [Linux](./linux.html)
- [MacOS](./macos.html)
- [iOS](./ios.html)

### Linux 寄り

- [Bash](./bash.html)
- [Git](./git.html)
- [sed](./sed.html)
- [SSH](./ssh.html)
- [Vim](./vim.html)

### Web

- [BASIC 認証](./basic-auth.html)

### フロントエンド

- [CSS](./css.html)
- [JavaScript](./javascript.html)
  - [Node.js npm](./nodejs-npm.html)

### 特集

- [Scripts Comparison](./scripts-comparison.html)
  - 「あの処理はあのスクリプト言語でどう書くの？」のまとめ。Windows 向けのスクリプト言語多め
- [Unix Like Commands For Windows](./unix-like-commands-for-windows.html)
  - Bash コマンド名と、それを Windows で再現する方法をまとめた一覧表
- [Windows と Mac で開発環境を揃える Tips 集](./windows-mac-environment.html)
- [プログラミング関連ブックマーク](./bookmarks.html)


## プログラミングノウハウ

- __[プログラミングに関する著名な原理・原則の一覧](./principles.html)__
- [コードのネストを深くしない](./dont-write-deep-nested-code.html)
- [命名ベストプラクティス](./naming-best-practices.html)
- [命名アンチパターン](./naming-anti-patterns.html)
- [コードの短さよりも可読性を重視する](./rather-readability-than-short-coding.html)
- [Git は最初に空コミットする](./git-first-commit.html)
- [アノテーションコメント (TODO・FIXME・XXX) を使う](./use-annotation-comment.html)


---


## 雑多なメモ

トピックにまとめられそうになったらまとめます。

- [ブログ: 業界6年目で考えが変わったソフトウェア開発のトピック](https://okuranagaimo.blogspot.com/2021/01/6.html)
  - 様々な経験レベルを持つ人がいるチームで仕事をする場合は、型付き言語の方が適している
  - Javaはそれほどひどい言語ではない
  - ソフトウェア・アーキテクチャは、おそらく他の何よりも重要である。優れた抽象化のクソみたいな実装は、コードベースに正味の害を与えません。悪い抽象化や欠落したレイヤーは、すべてのものを腐らせる
  - 巧みなコードは通常、良いコードではない。明瞭さは、他のすべての懸念事項に勝る
  - 必要ないのにスケーラブルなシステムを設計すると、困ったエンジニアになる
  - DRYは特定の問題を回避するためのものであり、それ自体が最終目的ではない
  - YAGNI、SOLID、DRY。その順番で
  - 鉛筆と紙は最高のプログラミング・ツールであり、あまり使われていない
  - テクノロジーを追加することはめったに正しい判断ではない
  - 「スケーラブル」という言葉は、ソフトウェア・エンジニアの心に神秘的で呆れるほどの力を持っている。その言葉を口にしただけで、彼らを堕落した狂乱に巻き込む可能性があります。この言葉を使った容赦のない行動は正当化される
  - コード網羅率はコード品質とはまったく関係ない
  - モノリスは大抵の状況でかなり優秀
  - TDD(テスト駆動開発)純粋主義者は最悪である。彼らの心の弱さは、様々なワークフローの存在を処理することはできない
- プログラミングの進展をコードの行数で測るのは、飛行機建造の進展を重量で測るようなものだ - ビル・ゲイツ
- 今日のプログラミングは、馬鹿でも使える、より重大かつ高度なプログラムを構築する努力をしているソフトウェアエンジニアと、より重大かつ高度な馬鹿を生み出そうとする宇宙との間の競争である。今のところ、宇宙が勝っている - Rich Cook
- あなたのコードをメンテナンスすることになる人が、あなたの住所を知る強烈なサイコパスになりうるのを常に想定してコーディングしなさい - Rick Osborne
- 一つの問題に直面するとき、「そうだ。正規表現を使おう。」と考える人たちは、二つの問題に直面する - Jamie Zawinski
- そもそも、デバッギングはコーディングよりも2倍難しい。従って、あなたが可能な限り賢くコードを書くとしたら、定義からして、あなたはそれをデバッグできるほど賢くない - ブライアン・カーニハン
- 上品で美しい設計ができる人、たいてい最前線の激務に耐えられないし、そういう理由で社会を支えるシステムはテストや設計が壊滅していたりして脳筋な世界が完成する
- telnetの切り方のコメンド打つのがとても難しいのでいつも「そquit」と入力すると切っている。多分ひらがなの中の「そ」のエンコーディングでtelnetのコマンド入力モードになるコマンドと等価なものが入っているのだろう
- Remove は「取り除く」。Unix の rm はディレクトリからエントリを取り除き、参照カウントが0になった時に実体が回収される。名前の通りの動作。
- おっさんプログラマのダメなとこはなんか楽にできる方法あるんじゃねえの？って探して力技しかない結論に達しても楽にしたい欲を捨てられずそこで手が止まることです
- 部屋とお姉さんとソースコードはきれいな方がいいと思います
- テストでは品質は上がらないですよ。テストはあくまでも品質をあげるきっかけ。品質をあげるのはプログラミングです
- 考えてみると、「クラウドコンピューティング」って言葉は、MSがOfficeにあの雲のオートシェイプを仕込んでたからこそ生まれた言葉じゃねぇの？
- [Sebastian AaltonenさんはTwitterを使っています 「A good practice is to copy-paste code three times, and then refactor (extract) if all three instances are still doing the same thing. Before this, you don’t want to add unit tests, because your code has no dependencies. Code without dependencies is the best code. Safe to modify.」 / Twitter](https://twitter.com/SebAaltonen/status/1080076144089665537)
  - コードの共通化は3回同じコード片が登場してから
  - [Sebastian Aaltonen氏のプログラミング観 - Qiita](https://qiita.com/ktnyt/items/0605b5b867f970057939)
- [コードを書く際の指針として見返すサイトまとめ - Qiita](https://qiita.com/kenichi_cc/items/c3ecca7b7d5fc5c6bf2e)
- [JavaScriptの非同期処理をキャッシュする場合の注意点 - Qiita](https://qiita.com/YSRKEN/items/f808ef7597b95bdc5879) … __セマフォ__
- [型変換用メソッドは受け取り側クラスに作る | まくまくいろいろノート](https://maku77.github.io/memo/api-convert-type.html)
- [単位を明確にする | まくまくいろいろノート](https://maku77.github.io/memo/clarify-unit.html) … コメントではなくてシンボル名から単位を読み取れるのが理想
- [肯定形で表現する | まくまくいろいろノート](https://maku77.github.io/memo/prefer-positive-sentence.html)
- [時制や単数形・複数形を考慮して命名する | まくまくいろいろノート](https://maku77.github.io/memo/tense-and-plural.html)
- [大手Webサービスがクライアント側で発生したJavaScriptのエラーをどう収集しているのか まとめ - Qiita](https://qiita.com/grapswiz/items/4e97968f3d3df97a4c76)
- [文字列変数の引用符の展開ルール | まくまくSassノート](https://maku77.github.io/sass/string.html)
