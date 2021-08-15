---
title        : Linux
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
  - /tech/programming/knowledges/index.html プログラミング関連ナレッジ
---

Linux 全般の情報。「[Bash](./bash.html)」も参照。


## 目次


## ファイルタイプの整理

### `ls -l` の1桁目

- `-` : 普通のファイル
- `d` : ディレクトリ
- `l` : シンボリックリンク
- `c` : 特殊ファイル キャラクタ型デバイスファイル
- `b` : 特殊ファイル ブロック型デバイスファイル

### パーミッション

- `-`・`0` : 許可なし
- `x`・`1` : 実行可能 (ディレクトリの場合はそのディレクトリに `cd` できるかどうか)
- `w`・`2` : 書込可能 (ディレクトリの場合はファイルの追加・削除ができるかどうか)
- `r`・`4` : 読出可能 (ディレクトリの場合はファイル一覧の表示ができるかどうか)
- 例
  - `-wx`・`3`
  - `r-x`・`5`
  - `rw-`・`6`
  - `rwx`・`7`
- その他のパーミッション
  - `s` : Set User ID (setuid) or Set Group ID の実行可
  - `S` : Set User ID (setuid) or Set Group ID の実行不可
  - `t` : Sticky の実行可
  - `T` : Sticky の実行不可

### Sticky Bit

ディレクトリに設定されるアクセス権。全ユーザがファイル・ディレクトリを書き込めるが、root と所有者しか削除できない。`/tmp/` ディレクトリは Sticky Bit が設定されている。
