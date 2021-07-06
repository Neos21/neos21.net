---
title        : Bash の忘れっぽい Tips
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/cheat-sheets/index.html オレオレチートシート
---

## 目次


## エンコードを変える

```bash
$ LANG='ja_JP.euc-JP'
$ LANG='ja_JP.UTF-8'
```


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


## `grep` のオプション

```bash
# 基本
$ grep -inR '調べたいこと' .

# 以下だとサブディレクトリを調べてくれない
$ grep -inR '調べたいこと' ./*.md

# --include : 拡張子判定
$ grep -irl img1 --include='*.java'

# --exclude : 除外 … Java と Class を除外
$ grep -irl img_memo --exclude='*.class' --exclude='*.java'
```

- `-i` : `--ignore-case` … 大文字小文字区別なし
- `-l` : `--files-with-matches` … ファイル名のみ出力
- `-n` : `--line-number` … 行番号を出力する
- `-R` : `--recursive` … サブディレクトリも対象にする
- オプションは分けても繋げても良い (`-i -r -l` = `-irl`)


## EUC-JP なファイルを `tail` する (`nkf` を使う)

```bash
$ tail -f ./apache/logs/catalina.out | nkf -u -w
```

- `nkf` で UTF-8 に対応させて出力させる
- `-u` は出力をバッファしないオプション


## ファイル・ディスクリプタまとめ

- `command > /dev/null`
  - 標準出力を捨てる
- `command 2> /dev/null`
  - 標準エラー出力を捨てる
- `command > /dev/null 2>&1`
  - 標準エラー出力の結果を標準出力にマージし、標準出力を捨てる
  - 全て握りつぶすにはこうする

---

- 参考：[いい加減覚えよう。command > /dev/null 2>&1 の意味 - Qiita](https://qiita.com/ritukiii/items/b3d91e97b71ecd41d4ea)
