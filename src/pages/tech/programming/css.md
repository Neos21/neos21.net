---
title        : CSS
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

## 目次


## 折り返し関連プロパティまとめ

`word-break` などのプロパティ、どれを使えば良いのか。

結論：*普段は `word-wrap: break-word`* を使う。どんな場合でも意地でも折り返したい時は **`word-break: break-all`** を使う。

- `word-wrap`
  - `normal`・`break-word`
  - CSS3 草案を IE が独自採用したもの。CSS3 では `overflow-wrap` というプロパティ名で正式採用された
  - *なるべく禁則処理を保持*し、可能な限り単語途中での折り返しを避ける (折り返し方が弱いといえる)
- `overflow-wrap`
  - `normal`・`break-word`
  - `word-wrap` が正式名称に昇華したもの
- `word-break`
  - `normal`・`break-all`・`keep-all`
  - `keep-all` は CJK (日本語など) のみ改行させない
  - **一切の禁則処理を解除する**ので、好ましくない位置でも折り返しうる
