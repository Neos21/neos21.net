---
title        : MacOS
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
  - /tech/programming/knowledges/index.html プログラミング関連ナレッジ
---

主に MacOSX 以降で通用する情報。


## 目次


## iOS シミュレータを起動する

```bash
# インストールされているデバイスと UUID を確認できる
$ xcrun simctl list

# 次のように UUID を指定して起動する
$ open -a Simulator --args -CurrentDeviceUDID XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```


## 「ターミナル.app」のショートカットキー

- `Control + a` : 行頭に移動
- `Control + e` : 行末に移動
- `Control + k` : カーソル位置から行末までを切り取る
- `Control + u` : カーソル位置から行頭までを切り取る
- `Control + y` : 切り取った文字列を貼り付ける
- `Cmd + k` : 画面クリア・以前のモノが見えなくなる
- `Cmd + ↑`・`Cmd + ↓` : 入力をハイライトする
