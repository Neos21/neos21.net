# [neos21.net](https://neos21.net/) : Neo's World


## [Enter The Website](https://neos21.net/)

- **<https://neos21.net/>**
- <https://www.neos21.net/>
- <http://neos21.net/>
- <http://www.neos21.net/>
  - 2020-11-01 に Value Domain で取得した独自ドメイン
  - [GitHub Pages](https://neos21.github.io/neos21.net) にてホスティングしている
  - GitHub Pages の Enforce HTTPS 機能で HTTPS 化している
  - Value Domain の DNS 設定にて、Apex ドメインには GitHub の IP を4つ指定し、`www` には `CNAME` で `neos21.github.io` を指定している
- <https://neos21.github.io/neos21.net/>
  - 実際にホスティングされている GitHub Pages の URL。`neos21.net` にリダイレクトされる


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
  - **Front Matter にて `header-date: true` の指定がある場合のみ、`created` プロパティの値を利用して配置する**
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
  - **HTML の場合、`toc` プロパティに `false` を指定してあると ToC を配置しないようにできる**
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

- `{{ blog-list-years 【year】 }}`
- `{{ blog-list-months }}`
- `{{ blog-list-dates }}`


## その他ファイルのプレースホルダ

その他、フィードやサイトマップ XML などのファイル向けにもプレースホルダがある。


## ローカルでのファイル管理

ローカル開発時は `./dist/` ディレクトリを「`gh-pages` ブランチを `git clone` しているディレクトリ」とすることで柔軟に `gh-pages` へのデプロイを行えるようにする。

後述の GitHub Actions によるデプロイのため、`.gitignore` では `./dist/` ディレクトリを管理対象外とはしていないので、ローカルでは `./dist/` をコミットに含めないよう設定しておく。

```bash
$ echo 'dist/' >> ./.git/info/exclude
$ rm -rf ./dist
$ git clone -b gh-pages https://Neos21@github.com/Neos21/neos21.net.git dist
$ npm run build

$ cd ./dist
# git add・git commit・git push…
```


## GitHub Actions によるデプロイ

### Deploy On Commit

`master` ブランチへの Push 時に `./.github/workflows/deploy-on-commit.yaml` が動作する。そのコミットで追加・変更したファイルをデプロイする。

- `./src/` 配下のファイルの追加・変更を検知して `./dist/` ディレクトリにビルドする
  - ファイルの削除に対しては何も処理しないので、別途手動でデプロイすること
- `git stash` で退避し、`gh-pages` ディレクトリに切替後、Pop して `./dist/` ディレクトリを復元する
- `./dist/` ディレクトリ配下のファイルをプロジェクトディレクトリ直下にコピーする
  - コレにより、都度全量ビルドするのを避け、差分のみ配置する
- `gh-pages` ブランチに対して Add・Commit・Push を行う

### Daily Deploy

日本時間の毎朝8時に `./.github/workflows/daily-deploy.yaml` が動作する。ブログ等の予約投稿処理用。

- `./src/pages/` 配下の HTML・Markdown ファイル内の `last-modified` が当日日付のファイルを抽出し `./dist/` 配下にビルドする
- `./src/pages/blog/` 配下の画像ファイル等について、ファイル名が当日日付のファイルを抽出し `./dist/` 配下にコピーする
  - CSS の変更は検知しない
  - `src/documents/` 配下は無視する
  - `src/pages/` 配下の、ブログ以外の画像ファイルなどは無視する (新規ファイルなのか特定ができないため・必要なら別途手作業でデプロイする)
- `./dist/` ディレクトリが出来上がってから `gh-pages` ブランチへ Push するまでの処理は、上述の Deploy On Commit と同じ


## Author

[Neo](https://neos21.net/)


## Links

- [Neo's World](https://neos21.net/)
- [Neo's GitHub Pages](https://neos21.github.io/)
