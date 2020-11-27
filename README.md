# Neo's World


## [Enter This Website](https://neos21.net/)

- <http://neos21.net/>
- __<https://neos21.net/>__
- <http://www.neos21.net/>
- <https://www.neos21.net/>
  - 2020-11-01 に Value Domain で取得した独自ドメイン
  - XREA 上のサイトに紐付けている (ミラーサーバがあるワケではない)
  - XREA の無料 SSL で HTTPS 化している
  - `www` あり版の対応は DNS に A レコードを追加した上で XREA 管理画面で行っている
- <http://neo.s21.xrea.com/>
  - 2002年10月に XREA サーバをレンタルし始めた時の URL
  - HTTP のみ
- <http://neos21.tk/>
- <https://neos21.tk/>
- <http://www.neos21.tk/>
- <https://www.neos21.tk/>
  - 2020-08-22 に Freenom で取得した無料の独自ドメイン
  - XREA 上のサイトに紐付けている (ミラーサーバがあるワケではない)
  - XREA の無料 SSL で HTTPS 化している
  - `www` あり版の対応は DNS に A レコードを追加した上で XREA 管理画面で行っている
- <https://ss1.xrea.com/neo.s21.xrea.com/>
  - XREA が提供する「SSL 対応ページ」の URL
  - ドキュメントルートがズレるため CSS が読み込めなくなっていたり、リンクパスが不正なモノになっていたりして、使い物にならず


## テンプレートの仕様

`./src/templates/templates.html` が HTML・Markdown の共通テンプレート。二重ブレース `{{ }}` でプレースホルダを定義してある。

HTML・Markdown ファイルの先頭には YAML 形式の Front Matter が記述されており、コレを利用してプレースホルダを埋めている。マッピング仕様は以下のとおり。

- `{{ page-title }}`
  - 「インライン・プレースホルダ」 : `title` 要素で囲んでいる
  - マッピング : Front Matter の `title` プロパティ・記述必須
  - ページタイトル
  - トップページ (`title` が `Neo's World`) 以外は `【title プロパティ】 - Neo's World` を挿入するようにしてある
- `{{ head }}`
  - 「ブロック・プレースホルダ」 : `head` 要素の終了タグ直前に配置してある
  - マッピング : Front Matter の `head` プロパティ・任意
  - ページ独自の `style` 要素や `script` 要素などを挿入できるようにしてある
- `{{ path }}`
  - 「ブロック・プレースホルダ」 : `nav#path > ul` の配下に配置してある
  - マッピング : Front Matter の `path` プロパティ・記述必須
  - プロパティは配列で記述し、トップページからのパンくずリストを `【リンクパス】 【ページ名】` (スペース区切り) で記述する
- `{{ date }}`
  - 「ブロック・プレースホルダ」 : `h1#page-title` 要素の直前に配置してある
  - マッピング : Front Matter の `created` プロパティ・記述必須
  - 主にブログ用に、公開日時をページタイトル上部に配置するためのプロパティ。`div#header-date > time > 【created プロパティ】` という HTML を配置する
  - __Front Matter にて `header-date: true` の指定がある場合のみ、`created` プロパティの値を利用して配置する__
- `{{ title }}`
  - 「インライン・プレースホルダ」 : `h1#page-title` 要素で囲んでいる
  - マッピング : Front Matter の `title` プロパティ・記述必須
  - ページタイトル
- `{{ description }}`
  - 「ブロック・プレースホルダ」 : `main#main` の配下、`h1#page-title` と `aside.adsense` の直後に配置してある
  - マッピング : Front Matter の `description` プロパティ・任意
  - HTML の ToC が `{{ contents }}` の先頭に付いてしまうため、ToC の前段に書きたい内容があれば書けるようにしてある
  - Markdown の場合は `## 目次` 見出しの位置に自由に挿入できるため利用機会がないが、記述したい場合は Markdown ではなく HTML で書くこと
- `{{ contents }}`
  - 「ブロック・プレースホルダ」 : `main#main` の直下に配置してある
  - マッピング : HTML・Markdown の先頭にある Front Matter 部分を除去した残りの部分
  - HTML・Markdown ともに、Slug、ToC、Prism.js、見出しリンクを付与し、HTML 形式で挿入される
  - __HTML の場合、`toc` プロパティに `false` を指定してあると ToC を配置しないようにできる__
  - Markdown は HTML パースされる。ToC は `## 目次` という見出しを配置した位置に挿入される
- `{{ created }}`
  - 「インライン・プレースホルダ」 : `dl#date-time > dd > time` 要素で囲んでいる
  - マッピング : Front Matter の `created` プロパティ・記述必須
  - ページの初版作成日
- `{{ last-modified }}`
  - 「インライン・プレースホルダ」 : `dl#date-time > dd > time` 要素で囲んでいる
  - マッピング : Front Matter の `last-modified` プロパティ・記述必須
  - ページの最終更新日


## ソースファイルのプレースホルダ

ソースファイル側にプレースホルダを用意している箇所がある。

### HTML

- `{{ blog-latests 【num】 }}`
- `{{ news-latests 【num】 }}`
- `{{ news-all }}`

### Markdown

- `{{ blog-latests 【num】 }}`
- `{{ blog-list-years }}`
- `{{ blog-list-months }}`
- `{{ blog-list-dates }}`


## Author

[Neo](https://neos21.net/)


## Links

- [Neo's World](https://neos21.net/)
- [Neo's GitHub Pages](https://neos21.github.io/)
- [Corredor](https://neos21.hatenablog.com/)
