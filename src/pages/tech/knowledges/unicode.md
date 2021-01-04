---
title        : Unicode・UTF-8・UTF-16 とは・違い・文字コード関連の知識
created      : 2021-01-05
last-modified: 2021-01-05
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

最近のウェブでは UTF-8 が主流になっているが、UTF-16 が劣っているというワケではなく、それぞれに長所・短所があるため、複数の方式が併存している。

## その他

### ASCII とは

- American Standard Code for Information Interchange の略
- 最初に制定された文字コード。アメリカで制定され、数字、アルファベット、記号などを1バイトで表現している
- コードポイントと、機械が認識する際の数字が同じなので、符号化方式を意識しなくて済む
- UTF-8 は ASCII が制定した文字についてはそのまま運用できるように作られているので、上位互換形式といえる

### Shift-JIS とは

- ASCII コードに日本語の文字を加えた規格。日本工業規格 (JIS) が定めた
- 俗に JIS コードと呼ばれる ISO-2022-JP という文字コード規格を変更 (シフト) したから Shift-JIS
- 「外字領域」と呼ばれる、自由に使える文字コードの領域がある。ココを各社が独自に拡張して、亜流な Shift-JIS 規格が生まれている。最も有名なのは _MS932_ という Windows で使われる規格

### EUC-JP とは

- Extended UNIX Code Packed Format for Japanese の略
- UNIX で日本語文字を扱えるように、AT&T が定めた

### ISO-8859-1 とは

- ISO と IEC が定めた ISO/IEC 8859 という文字コード標準
- 16部に別れており、それぞれのブロックは「Latin 1」などと呼ばれたりする

### エンディアンとは

- 複数のバイトで構成されるデータをどう並べるか、という方法のこと
- `0xABCD` というような2バイトのデータを「ABCD」と並べるのが「ビッグエンディアン」方式。人間の直感的には読みやすいが、機械が見ると操作しづらい
- 一方、「CDAB」という並べ方をするのが「リトルエンディアン」方式。下位のバイトを先に読み込めた方が機械には都合が良い

### BOM とは

- Byte Order Mark の略
- 符号化方式を知らせるため、ファイルの冒頭に挿入されるバイトデータ
- UTF-8 の場合、バイトごとにデータを処理すれば文字が特定できるので、BOM は必ずしも必要ではない (俗にいう BOM 付き UTF-8・BOM なし UTF-8)
- UTF-16 の場合、リトルエンディアン方式の UTF-16 とビッグエンディアン方式の UTF-16 があったりするので、BOM で方式を判別しておかないとただしく文字が特定できない

## 参考文献

- [Unicode - Wikipedia](https://ja.wikipedia.org/wiki/Unicode)
- [unicodeとは？文字コードとは？UTF-8とは？ - Qiita](https://qiita.com/hiroyuki_mrp/items/f0b497394f3a5d8a8395)
- [Unicodeとは｜「分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典](https://wa3.i-3-i.info/word11422.html)
- [UTF-8とUTF16の違いは？](https://www.atmarkit.co.jp/fxml/askxmlexpert/024utf/24utf.html)
- [【図解】【3分解説】UnicodeとUTF-8の違い！【今さら聞けない】 - Qiita](https://qiita.com/omiita/items/50814037af2fd8b2b21e)
- [文字コード｜用語・資料](https://w3g.jp/others/data/character_code)
- [EUC-JP - Wikipedia](https://ja.wikipedia.org/wiki/EUC-JP)
- [ISO/IEC 8859 - Wikipedia](https://ja.wikipedia.org/wiki/ISO/IEC_8859)
