---
title        : Bash
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
  - /tech/programming/knowledges/index.html プログラミング関連ナレッジ
---

「[Linux](./linux.html)」全般の話題というより、Bash シェル上で使うことの多いコマンドのチートシートがメイン。


## 目次


## エンコードを変える

```bash
$ LANG='ja_JP.euc-JP'
$ LANG='ja_JP.UTF-8'
```


## `grep` のオプション

```bash
# 基本 : カレントディレクトリ配下の全ファイルを対象に検索する
$ grep -inR '調べたいこと' .

# 以下だとサブディレクトリを調べてくれない
$ grep -inR '調べたいこと' ./*.md

# --include : 拡張子判定
$ grep -iRl img1 --include='*.java'

# --exclude : 除外 … Java と Class を除外
$ grep -iRl img_memo --exclude='*.class' --exclude='*.java'
```

- `-i` : `--ignore-case` … 大文字小文字区別なし
- `-l` : `--files-with-matches` … ファイル名のみ出力
- `-n` : `--line-number` … 行番号を出力する
- `-r` : `--recursive` … サブディレクトリも対象にする
- `-R` : `--dereference-recursive` … `-r` と同様だがシンボリックリンクも辿る
- オプションは分けても繋げても良い (`-i -R -l` = `-iRl`)


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
- 参考：[いい加減覚えよう。command > /dev/null 2>&1 の意味 - Qiita](https://qiita.com/ritukiii/items/b3d91e97b71ecd41d4ea)
