---
title        : Vim の忘れっぽい Tips
created      : 2021-01-28
last-modified: 2021-01-28
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/cheat-sheets/index.html オレオレチートシート
---

個人的に忘れやすいけど、使えると便利な Vim コマンドをまとめます。個人的に覚えていること、使わなくていいと思っているモノはあえて書きません。

- `:!ls` など
  - コマンドが実行できる
- `:set enc?` (もしくは `:set fileencoding`)
  - 開いているファイルのエンコーディングを確認できる
  - `encoding=utf-8` (`fileencoding=utf-8`) のように表示される
- `:e ++enc=euc-jp`
  - 開いているファイルのエンコーディングを変更する
- `:set fenc=euc-jp`
  - 保存する際のエンコーディングを変更する
