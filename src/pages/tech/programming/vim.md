---
title        : Vim
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

## 目次


## 覚えておきたい Vim コマンド

個人的に忘れやすいけど、使えると便利な Vim コマンドをまとめておく。個人的に覚えていること、使わなくていいと思っているモノは書かない。

- `:!ls` など
  - コマンドが実行できる
- `:set enc?` (もしくは `:set fileencoding`)
  - 開いているファイルのエンコーディングを確認できる
  - `encoding=utf-8` (`fileencoding=utf-8`) のように表示される
- `:e ++enc=euc-jp`
  - 開いているファイルのエンコーディングを変更する
- `:set fenc=euc-jp`
  - 保存する際のエンコーディングを変更する
