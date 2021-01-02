---
title        : Unicode・UTF-8・UTF-16 とは・違い
created      : 2021-01-10
last-modified: 2021-01-10
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/knowledges/index.html ナレッジ整理
---

## Unicode とは

Unicode とは、文字に対して割り振られた番号の集合体のこと。

機械が文字を認識できるようにするため、世界中の文字ごとに「コードポイント」と呼ばれる番号を振って定義した。ポケモン図鑑の No みたいな感じで、「1番、『あ』」「2番、『い』」みたいな定義がされている。そういう一覧表のことを Unicode と呼ぶ、と思って良い。

コレを「文字集合」「文字セット」とか言ったりもする。Unicode は「符号化文字集合」の一つ、と言う。

## UTF-8 とは

かたや UTF-8 とは、コードポイントを基に、機械が認識できる 0 と 1 のビット (符号) に変換する際の、変換方式の一つである。「符号化形式」の一種、と表現する。

ある1文字をコンピュータが受け取った時に、まず Unicode として定めた「コードポイント」を特定する。コレは「対応表」から探すイメージ。UTF-8 は、この「コードポイント」を基に 0・1 に変換する「変換方式」のことを指している。

UTF-8 は1文字を1〜6バイトで表現しようとする。バイト数が文字によって可変するのが特徴。

8-bit UCS Transformation Format の略。

## UTF-16 とは

Unicode と UTF-8 の違いが分かれば、UTF-16 の理解は簡単だろう。コードポイントからビットへの変換方式が別の規格、というワケだ。

## その他整理したいこと

- Shift-JIS とは、その他の文字コード
- エンディアン

## 参考文献

- [Unicode - Wikipedia](https://ja.wikipedia.org/wiki/Unicode)
- [unicodeとは？文字コードとは？UTF-8とは？ - Qiita](https://qiita.com/hiroyuki_mrp/items/f0b497394f3a5d8a8395)
- [Unicodeとは｜「分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典](https://wa3.i-3-i.info/word11422.html)
- [UTF-8とUTF16の違いは？](https://www.atmarkit.co.jp/fxml/askxmlexpert/024utf/24utf.html)
- [【図解】【3分解説】UnicodeとUTF-8の違い！【今さら聞けない】 - Qiita](https://qiita.com/omiita/items/50814037af2fd8b2b21e)
