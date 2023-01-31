---
title        : DB・テーブル設計のプラクティス
created      : 2021-10-05
last-modified: 2021-10-05
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/design/index.html 設計
---

DB 設計、テーブル設計のよくある考慮事項、プラクティスをまとめる。


## 目次


## 命名規則

- 全体
  - テーブル名、カラム名ともに小文字のみ、スネークケースとする。ケースインセンシティブに扱われるケースでの混乱を回避するため
  - 英語を使う。ローマ字で書かない
  - 略名は使用せず、長くなっても正しく書く
  - `data`・`info` など汎用的過ぎて意味の伝わらない単語は使わない
- テーブル
  - 複数形が基本
- カラム名
  - Boolean 型 : `is_`・`has_` などを使う。`flag` は真偽の意味が伝わらないので使用してはならない
  - Date 型 : `【受動態】_on`
  - Timestamp 型 : `【受動態】_at`
  - システム的なデータ : `created_at` (登録日時)・`updated_at` (更新日時) を持たせる
  - 他テーブルの主キー : `【テーブル名の単数形】_id`
- 参考 : [データベースオブジェクトの命名規約 - Qiita](https://qiita.com/genzouw/items/35022fa96c120e67c637)
- 参考 : [Railsの基礎知識 | Railsドキュメント](https://railsdoc.com/rails_base)


## テーブル設計

- 複数データを複数のカラムで「列持ち」しない。拡張性に欠ける・Null チェックが必要になるため。行持ちする
  - 参考 : [やめた方がいいテーブル設計 〜重複データのカラム持ち〜 - SE様はアナログ派](https://b-kimagure.hatenablog.com/entry/2019/05/25/112530)
- 姓・名
  - カラム長 : 姓30文字・名文字で60バイトが妥当
- 法人名
  - カラム長 : 137文字・411バイト
- 郵便番号
  - 型 : 整数型ではなく VARCHAR とする (先頭の `0` に意味があり、算術演算の対象ではないため)
  - カラム長 : 7 or 8文字 (ハイフン込みなら8バイト)
  - 参考 : [郵便番号は整数型か - ockeghem's blog](https://ockeghem.hatenablog.jp/entry/20081113/p1)
- 住所
  - カラム長 : 161文字・483バイト
- 電話番号
  - 型 : 整数型ではなく VARCHAR とする (先頭の `0` に意味があり、算術演算の対象ではないため)
  - カラム長 : 国番号3文字・以下15文字・ハイフン3文字で21文字 (21バイト) が妥当
  - 参考 : [電話番号計画 - Wikipedia](https://ja.wikipedia.org/wiki/%E9%9B%BB%E8%A9%B1%E7%95%AA%E5%8F%B7%E8%A8%88%E7%94%BB) … E.164 にて定められている
- メールアドレス
  - カラム長 : ローカル部64文字・ドメイン253文字で、全体の最大値は254文字 (254バイト)
  - 参考 : [メールアドレス - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9)
  - 参考 : [メールアドレスの長さ - Qiita](https://qiita.com/Anderiens/items/dbf87baca8222b708dc5)
  - 参考 : [RFC2821(Simple Mail Transfer Protocol (SMTP))](http://srgia.com/docs/rfc2821j.html) … 4.5.3. にて定められている
- URL
  - カラム長 : 2048文字 (2048バイト) … RFC 2616 では長さの規定はないが、IE で解釈できる最大桁数を元に設定しておく
  - 参考 : [URL の最大長は、2,083 文字Internet Explorer](https://support.microsoft.com/ja-jp/topic/url-%E3%81%AE%E6%9C%80%E5%A4%A7%E9%95%B7%E3%81%AF-2-083-%E6%96%87%E5%AD%97internet-explorer-174e7c8a-6666-f4e0-6fd6-908b53c12246)
- 参考 : [名前、電話番号、メールアドレス、郵便番号等の最適なmaxlengthはいくつか調べてみた | Be full stack](https://kyogom.com/tech/design/maxlength/)


## コード値

- 性別
  - ISO 5218 で生物学的性別 (Gender ではなく Sex) を表記するためのコード値が標準化されている
  - `0` : not known (不明)
  - `1` : male (男性)
  - `2` : female (女性)
  - `9` : not applicable (適用不能)
  - 参考 : [ISO 5218 - Wikipedia](https://ja.wikipedia.org/wiki/ISO_5218)
  - 参考 : [システムで「性別」の情報を扱う前に知っておくべきこと - Qiita](https://qiita.com/aoshirobo/items/32deb45cb8c8b87d65a4)
  - 参考 : [DBテーブルに性別カラムを作るなら、男=1, 女=2が標準 - Qiita](https://qiita.com/yuba/items/567f8f47c9bb5a20200e)
- コード値はマスタテーブルに意味を寄せることで、外部キー制約により不適切な値が入らないよう制御できる
  - 参考 : [データベース - 区分値は数値にすべきか意味のある文字列にすべきか｜teratail](https://teratail.com/questions/154006)
- 都道府県
  - JIS X 0401 で定められている
  - 参考 : [全国地方公共団体コード - Wikipedia](https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E5%9C%B0%E6%96%B9%E5%85%AC%E5%85%B1%E5%9B%A3%E4%BD%93%E3%82%B3%E3%83%BC%E3%83%89)
  - 参考 : [JIS X 0401都道府県コード - CyberLibrarian](https://www.asahi-net.or.jp/~ax2s-kmtn/ref/jisx0401.html)
  - 参考 : [都道府県マスタを作る](https://www.pahoo.org/e-soul/webtech/mysql01/mysql05-01.shtm)
- 言語コード
  - ISO 639 で定められている。ISO 639-1 は2文字、ISO 639-2 では3文字のコードを定めている
  - 日本語は `jp` (ISO 639-1)、`jpn` (ISO 639-2)
  - 参考 : [ISO 639言語コード - CyberLibrarian](https://www.asahi-net.or.jp/~ax2s-kmtn/ref/iso639.html)
  - 参考 : [言語コードと国コード](https://www.kanzaki.com/docs/html/lang.html) … MIME ヘッダなどで使う `en-US` といった表記は [RFC 4646](https://tex2e.github.io/rfc-translater/html/rfc4646.html) → [RFC 5646](https://tex2e.github.io/rfc-translater/html/rfc5646.html) によるもの
  - 参考 : [IETF言語タグ - Wikipedia](https://ja.wikipedia.org/wiki/IETF%E8%A8%80%E8%AA%9E%E3%82%BF%E3%82%B0)
- 国名コード
  - ISO 3166-1 で定められている
  - 日本は `392` (ISO 3166-1 numeric)、`JP` (ISO 3166-1 alpha-2)、`JPN` (ISO 3166-1 alpha-3)
  - 参考 : [ISO 3166-1 - Wikipedia](https://ja.wikipedia.org/wiki/ISO_3166-1)
  - 参考 : [ISO 3166-1国名コード - CyberLibrarian](https://www.asahi-net.or.jp/~ax2s-kmtn/ref/iso3166-1.html)


## ダミーデータ

- 電話番号
  - `03-1234-5678` (`3000` 未満が未設定)
  - `070`・`080`・`090` … `0x0-00xx-xxxx` 〜 `0x0-09xx-xxxx`
  - 参考 : [記入例に使うダミー電話番号の探し方 | You Look Too Cool](https://stabucky.com/wp/archives/6180)
  - 参考 : [総務省｜電気通信番号制度｜電気通信番号指定状況 （電気通信番号計画（令和元年総務省告示第6号）第1第4項による公表）](https://www.soumu.go.jp/main_sosiki/joho_tsusin/top/tel_number/number_shitei.html) … 割当のある番号一覧が確認できる


## ナレッジ

- 郵便番号 ⇔ 住所を求めて名寄せするのはほぼ無理
  - 郵便番号からは住所の一部分までしか分からない
  - 住所データはどの文字列までを検索対象とすれば良いか見極めづらく郵便番号を探しづらい
  - 地域によって特別な郵便番号が割り当てられている場所もあったりして、すんなりお互いの情報を求めたり名寄せ処理を行ったりするのは困難
  - 参考 : [日本郵便が公開する郵便番号データをそのまま利用するのがなぜ難しいか。そして、住所から郵便番号を求めるのがなぜ難しいか［PR］ － Publickey](https://www.publickey1.jp/blog/17/yubin7_pr.html)


## アンチパターン

- 参考 : [SQL アンチパターン - ペンギンラボ Wiki](https://penguinlab.jp/wiki/SQL_%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3#Entity-Attribute-Value)
- 参考 : [「SQLアンチパターン」を避けるためのチェックリスト①（DB論理設計編） - log4ketancho](https://www.ketancho.net/entry/2018/03/07/080000)
