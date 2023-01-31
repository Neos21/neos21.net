---
title        : Git
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

## 目次


## `git add` を取り消す

```bash
$ git reset HEAD ./src/something.html
```

- `--soft` と同じ


## `git commit` を取り消す・直前のコミットをなかったことにする

```bash
$ git reset --soft HEAD^
```

- `--soft` 指定しているので、直前にコミットしていた分のファイル変更は保持され、直後に `git status` すればそのコミットしていた内容が差分で見える。`git add` はした状態になっている
- `--hard` にすると戻したコミット時点のファイルたちに書き換えられる


## 過去のバージョンのファイルを取得する

```bash
# git log などでコミット ID を調べておき指定する (短いヤツで大丈夫)
$ git checkout 1ad35ce -- src/something.html
```


## リポジトリごとにコミッタ (ユーザ名・メールアドレス) を変更する

カレントディレクトリ配下の `./.git/config` に記載される。

```bash
$ git config user.name 'Neos21'
$ git config user.email 'neos21@example.com'
```


## タグ打ち・Push

```bash
$ git tag -a 【タグ名】 -m '【コメント】' 【コミット ID】
$ git push origin 【タグ名】

# 以下は一例
$ git tag -a release/v1.1.0 -m 'release/v1.1.0' cfsae229
$ git push origin release/v1.1.0
```

- 参考 : [git tagの使い方まとめ - Qiita](https://qiita.com/growsic/items/ed67e03fda5ab7ef9d08)


## CI・CD 用に一時ブランチを Push する

ブランチの Push でしか発火させられない CI・CD サービスがあったので、その時に使った。

```bash
$ git push origin 【既存ブランチ名】:【一時ブランチ名】

# 以下は一例。「release/v1.1.0」ブランチを、ビルド用に「build-v1.1.0-2020-01-02-13-45」とおいうブランチ名を付けて Push する
$ git push origin release/v1.1.0:build-v1.1.0-2020-01-02-13-45
```
