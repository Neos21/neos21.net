---
title        : RESTful Web API 設計
created      : 2021-01-27
last-modified: 2021-11-11
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/design/index.html 設計
head: |
  <style>
    .table-wrapper {
      overflow-x: auto;
    }
    
    .table-wrapper table {
      margin-top: 0;
      margin-bottom: 0;
      font-size: var(--font-size-default);
    }
    
    .table-wrapper thead th {
      white-space: nowrap;
    }
    
  </style>
---

REST・RESTful な Web API の設計に関するナレッジ。


## 目次


## RESTful な URL 設計からバックエンドの実装方針まで一覧

Rails の Scaffold などを参考にした、RESTful な URL 一覧。

<div class="table-wrapper">

| Verb   | URL Pattern       | Action  | 備考                   |
|--------|-------------------|---------|------------------------|
| GET    | `/users`          | Index   | 一覧表示               |
| POST   | `/users`          | Create  | 新規登録 (ID 自動採番) |
| GET    | `/users/new`      | New     | 新規登録画面を開く     |
| GET    | `/users/:id`      | Show    | 照会画面・1件取得      |
| GET    | `/users/:id/edit` | Edit    | 編集画面を開く         |
| PUT    | `/users/:id`      | Update  | 全体更新               |
| PATCH  | `/users/:id`      | Update  | 一部更新               |
| DELETE | `/users/:id`      | Destroy | 削除                   |

</div>

フロントエンドにおける画面 URL から、RESTful な URL 設計、および、バックエンドのクラス・メソッド名やデータベース設計までを横並びにしてみると、こんな感じ。

例えば POST の時に 200 を返すか 201 を返すか、といったところなど、複数の流派が見られるモノは、そのパターンを併記している。Controller のメソッド名なんかは、一般的なフレームワークでよく見られる命名を案として掲載している。

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>フロントエンド</th>
        <th colspan="3">RESTful API</th>
        <th colspan="2">バックエンド API</th>
        <th colspan="2">ビジネスロジック</th>
        <th colspan="3">データベース</th>
      </tr>
      <tr>
        <th>画面 URL パス</th>
        <th>エンドポイントパス</th>
        <th>メソッド</th>
        <th>HTTP ステータスコード</th>
        <th>Controller クラス名</th>
        <th>Controller メソッド名</th>
        <th>Service クラス名</th>
        <th>Entity クラス名</th>
        <th>テーブル名</th>
        <th>主キー名</th>
        <th>SQL のイメージ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="2"><code>/users</code></td>
        <td rowspan="2"><code>/users</code></td>
        <td rowspan="2">GET</td>
        <td rowspan="2">200 OK (0件でも空配列を返す)</td>
        <td rowspan="16">UsersController</td>
        <td><code>findAll()</code></td>
        <td rowspan="16">UserService</td>
        <td>User</td>
        <td rowspan="16">users</td>
        <td rowspan="16">id</td>
        <td rowspan="2">SELECT</td>
      </tr>
      <tr>
        <td><code>index()</code></td>
        <td>UserEntity</td>
      </tr>
      <tr>
        <td rowspan="4"><code>/users/{id}</code></td>
        <td rowspan="4"><code>/users/{id}</code></td>
        <td rowspan="4">GET</td>
        <td>200 OK</td>
        <td><code>find()</code></td>
        <td rowspan="14">UserModel</td>
        <td rowspan="4">SELECT</td>
      </tr>
      <tr>
        <td rowspan="3">404 Not Found (見つからなかった場合)</td>
        <td><code>findOne()</code></td>
      </tr>
      <tr>
        <td><code>findById()</code></td>
      </tr>
      <tr>
        <td><code>show()</code></td>
      </tr>
      <tr>
        <td rowspan="2"><code>/users/new</code></td>
        <td rowspan="2"><code>/users</code></td>
        <td rowspan="2">POST</td>
        <td>200 OK (ID 付きの登録後データを返す)</td>
        <td rowspan="2"><code>create()</code></td>
        <td rowspan="2">INSERT</td>
      </tr>
      <tr>
        <td>201 Created</td>
      </tr>
      <tr>
        <td rowspan="5"><code>/users/{id}/edit</code></td>
        <td rowspan="3"><code>/users/{id}</code></td>
        <td rowspan="3">PUT</td>
        <td>200 OK (更新後データを返す)</td>
        <td><code>update()</code></td>
        <td rowspan="3">UPSERT</td>
      </tr>
      <tr>
        <td>201 Created (新規登録となった場合のみ)</td>
        <td rowspan="2"><code>save()</code></td>
      </tr>
      <tr>
        <td>204 No Content</td>
      </tr>
      <tr>
        <td rowspan="2"><code>/users/{id}</code></td>
        <td rowspan="2">PATCH</td>
        <td>200 OK (更新後データを返す)</td>
        <td><code>update()</code></td>
        <td rowspan="2">UPDATE</td>
      </tr>
      <tr>
        <td>204 No Content</td>
        <td><code>save()</code></td>
      </tr>
      <tr>
        <td rowspan="3">-</td>
        <td rowspan="3"><code>/users/{id}</code></td>
        <td rowspan="3">DELETE</td>
        <td rowspan="3">204 No Content</td>
        <td><code>delete()</code></td>
        <td rowspan="3">DELETE</td>
      </tr>
      <tr>
        <td><code>destroy()</code></td>
      </tr>
      <tr>
        <td><code>remove()</code></td>
      </tr>
    </tbody>
  </table>
</div>


## RESTful な設計の前提

- 「REST 原則」「RESTful なプラクティス」は、API のエンドポイントパスの命名とメソッドあたりまでの規約しか提示していない。フロントエンドの画面 URL パスや、バックエンドの実装方法については REST・RESTful とは別に考える必要がある
- 一般にいわれる「RESTful な設計方針」の中にも「流派」が存在するため、そのシステムでどういう方針に統一するか、をドキュメント化しておくと良い
- 上の表は、一般にいわれる RESTful なプラクティスをベースに、Rails や NestJS などのフレームワークが提供する Scaffolding 機能の命名などを盛り込んでまとめているまでで、全世界的にコレこそが正解、といったモノではない


## フロントエンドの URL 設計と RESTful API との兼ね合い

- バックエンド API と同じパスで表現できそうなところはそのまま流用する (一覧表示・詳細表示など)
  - 一覧表示の場合、画面 URL パスでは `/` で終わるが、View コンポーネントのファイル名では `index` といった文言を使うと良いだろう
- 「新規登録」画面は `new` といった文言で表現すると良いだろう (`create` だと動詞で、もう作られてしまいそうな感じがあるので、「その手前」感を出したい。ユーザ登録なら `register` とか `signup` などでの表現もアリか)
- 「編集」画面は `edit` が良いだろう (`update` だと動詞で、もう更新されてしまいそうな感じがあるので、「その手前」感を出したい。リソースによっては `settings` や `config` などで表現した方が分かりやすいかも)
- 削除の機能は「編集画面」ないしは「一覧表示」画面に「削除」ボタンを配置するような UI が多いと思われ、固有の画面を作らないことが多いので、上の表の「画面 URL パス」はナシとした。削除確認画面を設けるとしたら、Controller クラス名を流用して `/users/{id}/destroy` などと表現すると分かりやすいだろう


## API エンドポイントパスの命名

- リソース名を複数形で表現する
- 複数単語の場合は、小文字のみハイフンケースで記載する (ex. `admin-members`)


## POST・PUT・PATCH の使い分け

- POST は新規登録。ID を指定する方法はない
- PUT は「置換」。リクエストパラメータの内容に「差し替える」。冪等であることが求められ、全体が差し替えられるイメージ。対象リソースが未作成なら新規登録も兼ねるので、発行される SQL のイメージとしては UPDATE というより UPSERT に近い。「ファイルアップロード」なんかが想定される
  - `{ "name": "before", "age": 20 }` といった元データがあったとして `{ "name": "after" }` をリクエストパラメータに含めたら、更新後のデータは `{ "name": "after" }` となり、`age: 20` の情報が消える挙動をイメージする
- PATCH は「差分更新」。元データに、リクエストパラメータの内容を載せる
  - `{ "name": "before", "age": 20 }` といった元データがあったとして `{ "name": "after" }` をリクエストパラメータに含めたら、更新後のデータは `{ "name": "after", "age": 20 }` となり、`age: 20` の情報が保持される挙動をイメージする
- PUT と PATCH のレスポンス仕様については複数の流派が見られる。好きな方で良いだろう
  - 200 OK で、更新後のデータ全量をレスポンスする派 … 「サーバサイドは更新後データをこのように捉えていますよ」をクライアントに伝える。親切な感じする
  - 204 No COntent で、何のデータもレスポンスしない派 … 「リクエストどおりに更新しました、どんなデータを渡したかはクライアント側で分かってますよね？」って感じ。無駄なデータ転送が発生しないが、PATCH の挙動などイメージしにくい場所に関してちょっと不親切かも？
- POST と PUT については、新規登録ができたことを表現するため 201 Created を利用すると、HTTP ステータスコードでより正確な表現ができる。そのシステムにおいて、200 OK との区別を付ける必要性を感じなければ 200 OK に統一してしまっても良いだろう
- PUT と PATCH は混乱しやすいので、思い切って「PUT のみ提供し PATCH は用意しない」などの仕様に倒しても良いかもしれない


## その他 RESTful な設計に関して

- リクエスト、レスポンスの項目名は小文字のみスネークケースで記載する (ex. `first_name`)
  - _キャメルケース_の場合も多いが、GET の場合のクエリ文字列は URL 中にその文字列が表れることを考えると、大文字が登場することに違和感がある。JavaScript などで扱う場合にキャメルケースの方が分かりやすい気持ちもあるが、プログラミング言語を問わず RESTful な設計として考えると、スネークケースの方がベターに感じる
  - 特に JS で JSON を扱う際、ハイフンケースのプロパティだとプロパティ記法でアクセスできずブラケット記法が必要になり面倒なため、ハイフンケースだけは避ける
- 10桁以上の数値をレスポンスする際は、文字列型でレスポンスすることを検討する。JS などで int 型の範囲 (32bit ≒ 21億 ≒ 10桁以上) を超えると数値を正常に扱えなくなる恐れがあるため
  - 数値型で表現する `file_size` プロパティと同時に、その数値を文字列型で表現した `file_size_str` プロパティも同時に返す、といった API がある (GitHub API などでも見られる)
- GET `/users` のように、複数件のデータを返す API は、結果が0件であっても 200 OK でレスポンスし、空配列を渡す方が良い。4xx 系の HTTP ステータスコードを使うと、リクエストの仕方に問題がある、と受け取られかねないので適さない
- DELETE の場合、「削除されたデータ」をレスポンスする必要がないため、204 No Content をレスポンスするのが一般的
- HTTP ステータスコードの使い分けなど、「細かすぎるルール」は、API の利用者側も求めていないことが多い。それよりは、その API 全体としてルールが統一されているかいないか、が利用者側の利便性に大きく繋がるので、平易かつ平仄のとれたルールを策定することが大事


## Controller クラス名との関係

- Controller クラス名にはリソース名の複数形を用いる
- Router クラスを Controller クラスと別ける場合は、Router クラス名もリソース名の複数形で表現する


## Controller メソッド名は RESTful 設計とは無関係

- _バックエンドの Router・Controller 以降は、RESTful な規約の範囲から外れた話になるので、設計時に混乱しやすいところ_
  - 著名なフレームワーク (Rails、NestJS) ではおおよそ同じような命名を Scaffolding してくれるので、そうしたフレームワークを使わず自作するような場合でも、有名なフレームワークと同じような命名に揃えておくと分かりやすい
- `findAll`・`index` あたりが「対象のリソースを全件取得」。件数が多すぎる場合はページング機能を設けたりする場合もあるが、「フィルタリング条件」などは受け取らないのが一般的
- `find`・`findOne`・`findById` あたりが「主キーで1件取得」
- 更新系は `update`・`save` あたりが多い。もう少しモデル寄りのフレームワークや O/R マッパーでは、`update()` と `save()` で挙動が異なるものも多いので、採用するフレームワークの挙動と合わせて自然なメソッド名を検討する
- 削除系は `remove`・`delete`・`destroy` あたりの命名が多い。こちらもフレームワークによっては、`remove()` と `delete()` といったメソッドが存在し、外部キーで紐付きのある関連テーブルのデータも合わせて削除するかしないか、といった挙動の違いがあったりするので、採用するフレームワークの挙動と合わせて自然なメソッド名を検討する
- 一度決めたら、別のリソースでも同じメソッド名を使うよう、平仄を合わせる


## Service クラス名はビジネスロジックとして独立させる・どちらかというとデータベース寄り

- _Service クラス以降はビジネスロジックなので、Router や Controller とは切り離して考える_
- クラス名にはリソース名の単数形を用いるのが自然か。Entity (Model) と揃えるイメージ
- Entity に対する CRUD 操作を行うメソッドが主に出てくると思うが、そのメソッド名は「Controller メソッド名」をある程度流用できるだろう。基本的な CRUD 操作に関しては Controller メソッド名と合わせておくと分かりやすい
- TypeORM のような O/R マッパーが Entity を操作する際に使用するメソッド名を参考に合わせておくと分かりやすい


## Entity クラス名

- ココでいう Entity は、データベースのテーブルと機械的にマッピングできるようなクラス。テーブルのレコード1行を表現した、O/R マッパーの機能を盛り込ませたクラスのイメージ
- クラス名にはリソース名の単数形を用いる。テーブルのレコード1行を表現するのが基本
- クラス名に「Entity」とか「Model」とか書くかどうかはお好みで
- Rails の ActiveRecord パターンだと、「Service」クラス相当がなく「Model」にビジネスロジックが集約しやすい。Entity は DB テーブルとのマッピングを定義し、データを持つだけのオブジェクトと捉えて、ビジネスロジック (DB アクセス機能など) は持たせない方が良い


## DB テーブル設計

- _以降は REST 原則とは完全に関係なく、データベース設計の範疇_
- テーブル名、カラム名ともに、小文字のみスネークケースで統一する。ケースセンシティブに扱われないようにするため小文字に統一するのと、MySQL などでは「ハイフン」の扱いが煩雑になるためアンダースコアを推奨する
- テーブル名はリソース名の複数形を用いる
- テーブルの主キーは、リソース名を付与せず `id` とする
- 外部キーを表現する際は、リソース名の単数形と `id` を繋げて表現する (ex. `users` テーブルが `roles` テーブルと関連している場合、`users.role_id` といったカラム名で `roles.id` カラムの値を持たせる)


## API のバージョン番号を URL に入れるかどうか

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

- 適切な HTTP ステータスコードで返すのは前提として… (後述)
- _レスポンスオブジェクトの `error` プロパティの有無で、エラーの有無を表現する_
- レスポンスオブジェクトの `code` プロパティでエラーコードを表現する

このあたりが一般的な手法となるだろうか。いずれにしても、異常系におけるエラーオブジェクトのレスポンス仕様は、_システム全体で統一しておく_のが大事。

- 複数のエラーが検知できた場合にどのようにレスポンスするか
  - _`error` プロパティではなく `errors` プロパティとし、常に配列でエラー情報を扱うようにするといいかも_
  - `{ "errors": [ { "code": 10, "message": "Hoge Error" }, { "code": 20, "message": "Fuga Error" } ] }` みたいな
- エラーメッセージを返す場合は英語のみで用意し、国際化対応はしない方が良い (クライアントサイドで、コード値と日本語メッセージを対応付けて定義しておけばよい)

異常系に対する HTTP ステータスコードは、大体こんな使い分けができていれば十分だろう。

- GET : 200 OK ⇔ 404 Not Found (リソースが見つからない場合)
- POST : 201 Created ⇔ 409 Conflict (既にリソースがある場合)
- PUT : 201 Created (新規作成) or 204 No Content (更新) ⇔ 409
- PATCH : 200 or 204 ⇔ 409
- DELETE : 204 ⇔ 409・404
  - 404 は「最初から存在しないリソース」、410 Gone を「削除済のリソース」として区別して表現する方法もある
- 未定義のエンドポイントパス : 404 Not Found
- エンドポイントパスは合っているが対応するメソッドがない場合 : 405 Method Not Allowed を使って表現するのもアリ
- 401 Unauthorized : 認証エラー。認証が必要な API において、認証が上手くいかなかった場合
- 400 Bad Request : リクエストパラメータ不正。JSON 形式がおかしい場合など。基本はコレでおかしな部分を指摘してあげると、クライアントサイドがリトライ等しやすい
- サーバ內部エラー : 500 Internal Server Error。サーバサイドでどうにもできないエラーの場合はコレを返すしかない。クライアントサイドもコレを受け取ってもどうしようもないが…。そういう致命的なエラーの時のコード
- サーバメンテナンス中 : 503 Service Unavailable。一時的にサービスが提供できない場合に
- 参考文献
  - [RESTful API設計におけるHTTPステータスコードの指針 - Qiita](https://qiita.com/uenosy/items/ba9dbc70781bddc4a491#%E6%88%90%E5%8A%9F%E3%81%97%E3%81%9F%E5%A0%B4%E5%90%88)
  - [HTTPステータスコードを適切に選ぶためのフローチャート : 難しく考えるのをやめよう | POSTD](https://postd.cc/choosing-an-http-status-code/)
  - [HTTP レスポンスステータスコード - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Status)
  - [RESTful API設計におけるHTTPステータスコードの指針 - Qiita](https://qiita.com/uenosy/items/ba9dbc70781bddc4a491)

アプリケーションにエラーを伝達するための形式が RFC7807 として定められていたりする。

- [rfc7807](https://datatracker.ietf.org/doc/html/rfc7807)
- [HTTP APIの詳細なエラー情報をレスポンスに持たせるための仕様](https://www.eisbahn.jp/yoichiro/2017/01/rfc_7807.html)

なかなか単一の正解はないので、有名なウェブサービスの実装を参考にし、多く採用されている事例に合わせるのが良いだろう。

- [WebAPIでエラーをどう表現すべき？15のサービスを調査してみた - Qiita](https://qiita.com/suin/items/f7ac4de914e9f3f35884)
