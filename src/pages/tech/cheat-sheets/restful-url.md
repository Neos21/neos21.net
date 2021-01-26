---
title        : RESTful な URL 設計
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/cheat-sheets/index.html オレオレチートシート
---

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
