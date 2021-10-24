---
title        : sed
created      : 2021-10-12
last-modified: 2021-10-12
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

`sed` コマンドによる置換処理。


## 目次


## ケース変換

- スネークケース → キャメルケース
  - `$ echo 'hoge_hoge_hoge' | sed -r 's/_(.)/\U\1\E/g'` → `hogeHogeHoge`
- スネークケース → パスカルケース
  - `$ echo 'hoge_hoge_hoge' | sed -r 's/(^|_)(.)/\U\2\E/g'` → `HogeHogeHoge`
- キャメルケース → スネークケース
  - `$ echo 'hogeHogeHoge' | sed -r 's/([A-Z])/_\L\1\E/g'` → `hoge_hoge_hoge`
- パスカルケース → スネークケース
  - `$ echo 'HogeHogeHoge' | sed -r -e 's/^([A-Z])/\L\1\E/' -e 's/([A-Z])/_\L\1\E/g'` → `hoge_hoge_hoge`


## 参考文献

- [正規表現でスネークケース↔キャメルケース/パスカルケースの変換 - Qiita](https://qiita.com/ryo0301/items/7c7b3571d71b934af3f8)
- [お仕事で知っておけば便利。コマンドを叩くだけで使えるワンライナーチートシート - Qiita](https://qiita.com/taiyop/items/bfeeb41259cb0d083d88)