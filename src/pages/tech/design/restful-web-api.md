---
title        : RESTful Web API 設計
created      : 2021-01-27
last-modified: 2021-10-11
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/design/index.html 設計
---

REST・RESTful な Web API の設計に関するナレッジ。


## 目次


## URL 設計

Rails の Scaffold を参考にした、RESTful な URL 設計。

| Verb   | URI Pattern     | Action  | 備考                   |
|--------|-----------------|---------|------------------------|
| GET    | /users          | Index   | 一覧表示               |
| POST   | /users          | Create  | 新規登録 (ID 自動採番) |
| GET    | /users/new      | New     | 新規登録画面を開く     |
| GET    | /users/:id      | Show    | 照会画面・1件取得      |
| GET    | /users/:id/edit | Edit    | 編集画面を開く         |
| PUT    | /users/:id      | Update  | 全体更新               |
| PATCH  | /users/:id      | Update  | 一部更新               |
| DELETE | /users/:id      | Destroy | 削除                   |

- Put は冪等。全体を置換する。`UPSERT` なイメージだったり、「ファイルアップロード」なんかが想定される


## バージョン番号を URL に入れるかどうか

`https://example.com/api/v1/users` のように、`/v1` といったバージョン番号を URL に入れるかどうか。

- `https://v1.api.example.com/users` のように、サブドメインとして含める
- リクエストヘッダでバージョン番号を指定させ、URL はバージョンごとに変えさせない
- そもそもバージョン管理なんて要らなくね？自分らが作っているシステムで `v2` が出てきた試しがない

このような意見もあるが、自分は _`/v1` と URL に入れる_ことをオススメしたい。ドメイン単位の分岐は、DNS 管理、ドメインまたぎの考慮が毎度必要になって面倒が増えるので、次点としたい。

バージョン番号はメジャーバージョンのみとし、後方互換性や基本的な振る舞いを保てない時にバージョンを上げる方針が良いだろう。単純な拡張、内部実装の変更だけであれば、バージョンは上げない。

将来 `/v2` が出ることはないのかもしれないが、未来のことまで設計できているワケではない中で、あえて拡張性を潰す必要もない。YAGNI (必要になった時に追加すれば良い) という考え方を勘違いしていると「要らないなら作らない方が良い」と思いがちだが、__コストのかからないことであれば、拡張性のある設計として事前に取り込んでおくべきだ。__

- [RESTfulなWeb APIを設計するときに考えること - Qiita](https://qiita.com/shrkw/items/c6123ca25981e44a3d82)
- [Web APIにバージョンをつけないように](https://www.infoq.com/jp/news/2016/07/web-api-versioning/) … サブドメイン形式にする案
- [そのAPI、バージョン管理が必要ですか？ | NTT Communications Developer Portal](https://developer.ntt.com/ja/blog/b4c1431a-d0b4-4f83-b902-c89c28ee250a)


## API のエラー表現

Web API としてエラーをどのように表現するべきか。

- 適切な HTTP ステータスコードで返す (後述)
- レスポンスオブジェクトの `code` プロパティでエラーコードを表現する
- レスポンスオブジェクトの `error` プロパティの有無で表現する

このあたりが一般的な方針となるだろうか。

HTTP ステータスコードの指針は以下の記事が参考になる。

- [RESTful API設計におけるHTTPステータスコードの指針 - Qiita](https://qiita.com/uenosy/items/ba9dbc70781bddc4a491#%E6%88%90%E5%8A%9F%E3%81%97%E3%81%9F%E5%A0%B4%E5%90%88)
  - GET : 200 OK ⇔ 404 Not Found (リソースが見つからない場合)
  - POST : 201 Created ⇔ 409 Conflict (既にリソースがある場合)
  - PUT : 201 Created (新規作成) or 204 No Content (更新) ⇔ 409
  - PATCH : 200 or 204 ⇔ 409
      - POST・PUT・PATCH について、成功時は 200 OK で結果リソースを返す実装も多い。分かりやすい方で良いかと
  - DELETE : 204 ⇔ 409・404
      - 404 は「最初から存在しないリソース」、410 Gone を「削除済のリソース」として区別して表現する方法もある

アプリケーションにエラーを伝達するための形式が RFC7807 として定められていたりする。

- [rfc7807](https://datatracker.ietf.org/doc/html/rfc7807)
- [HTTP APIの詳細なエラー情報をレスポンスに持たせるための仕様](https://www.eisbahn.jp/yoichiro/2017/01/rfc_7807.html)

なかなか単一の正解はないので、有名なウェブサービスの実装を参考にし、多く採用されている事例に合わせるのが良いだろう。

- [WebAPIでエラーをどう表現すべき？15のサービスを調査してみた - Qiita](https://qiita.com/suin/items/f7ac4de914e9f3f35884)
