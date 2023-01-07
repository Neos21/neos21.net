---
title        : Bash
created      : 2021-01-27
last-modified: 2021-12-18
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
head: |
  <style>
    .table-wrapper th,
    .table-wrapper td {
      white-space: nowrap;
    }
  </style>
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


## `tar` コマンドのオプション

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>tar</th>
        <th colspan="2">Action</th>
        <th colspan="2">Type</th>
        <th colspan="2">Options</th>
        <th>Dest File</th>
        <th>Source Files...</th>
        <th>Alternative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="10">tar</td>
        <td rowspan="5"><strong>c</strong></td>
        <td rowspan="5">(--create)</td>
        <td>(unspecified)</td>
        <td>(= Tarball)</td>
        <td rowspan="10"><strong>v</strong><br><strong>f</strong></td>
        <td rowspan="10">(--verbose)<br>(--file)</td>
        <td>./dest.tar</td>
        <td rowspan="5">./source.txt ./sources/</td>
        <td>-</td>
      </tr>
      <tr>
        <td><strong>z</strong></td>
        <td>(--gzip)</td>
        <td>./dest.tar.gz</td>
        <td>gzip</td>
      </tr>
      <tr>
        <td>j</td>
        <td>(--bzip2)</td>
        <td>./dest.tar.bz2</td>
        <td>bzip2</td>
      </tr>
      <tr>
        <td>J</td>
        <td>(--xz)</td>
        <td>./dest.tar.xz</td>
        <td>xz</td>
      </tr>
      <tr>
        <td>a</td>
        <td>(--auto-compress)</td>
        <td>./dest.tar.【Type】</td>
        <td><em>※ GNU tar only</em></td>
      </tr>
      <tr>
        <td><strong>t</strong></td>
        <td>(--list)</td>
        <td><em>(unspecified)</em></td>
        <td><em>(= auto-detect)</em></td>
        <td>./dest.tar</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td rowspan="4"><strong>x</strong></td>
        <td rowspan="4">(--extract)</td>
        <td><em>(unspecified)</em></td>
        <td><em>(= auto-detect)</em></td>
        <td>./dest.tar</td>
        <td rowspan="4">-</td>
        <td>-</td>
      </tr>
      <tr>
        <td>z</td>
        <td>(--gzip)</td>
        <td>./dest.tar.gz</td>
        <td>gunzip</td>
      </tr>
      <tr>
        <td>j</td>
        <td>(--bzip2)</td>
        <td>./dest.tar.bz2</td>
        <td>bunzip2</td>
      </tr>
      <tr>
        <td>J</td>
        <td>(--xz)</td>
        <td>./dest.tar.xz</td>
        <td>unxz</td>
      </tr>
    </tbody>
  </table>
</div>
