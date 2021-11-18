---
title        : BASIC 認証
created      : 2021-11-18
last-modified: 2021-11-18
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

## BASIC 認証のテストに使えるサイト

BASIC 認証のテストに使えるサイトを紹介する。

- [BASIC 認証テスト](http://leggiero.sakura.ne.jp/xxxxbasic_auth_testxxxx/)
  - <http://leggiero.sakura.ne.jp/xxxxbasic_auth_testxxxx/secret/kaiin_page_top.htm>
  - ID : `kaiin`
  - Pass : `naisho`
  - 遷移先は Shift-JIS のページなので、最近の UTF-8 環境だとレスポンスが文字化けするかも
- [Testing HTTP Basic Authentication - WonderProxy Blog](https://wonderproxy.com/blog/testing-http-basic-auth/)
  - `http://httpbin.org/basic-auth/【任意の ID】/【任意の文字列】`
  - ex. <http://httpbin.org/basic-auth/foo/bar> (`https://` でも呼べる)
  - ID : `foo`
  - Pass : `bar`
  - レスポンスは JSON 形式
- [HTTP Authentication | HttpWatch](https://www.httpwatch.com/httpgallery/authentication/)
  - <https://www.httpwatch.com/httpgallery/authentication/authenticatedimage/default.aspx?0.7181898003814826>
  - ID : `httpwatch`
  - Pass : 任意の文字列
  - レスポンスは GIF 画像


## BASIC 認証のリクエスト方法

- URL 中に ID・パスワードを記載する方法
  - ex. `https://username:password@example.com/` のように書く
- リクエスト時に `Authorization` HTTP ヘッダを渡す
  - `username:password` 形式の文字列を Base64 エンコードし、先頭に `Basic` を付け `Basic dXNlcm5hbWU6cGFzc3dvcmQK` のように組み立てる
  - ex. `Authorization:Basic dXNlcm5hbWU6cGFzc3dvcmQK`
  - プロキシサーバがある場合は `Proxy-Authorization` ヘッダを使う
  - 参考：[Authorization - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization)
  - 参考：[Proxy-Authorization - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Proxy-Authorization)


## BASIC 認証付きリクエストのコードサンプル

- Bash … `curl` コマンドの場合
  - Base64 エンコードには `base64` コマンドを使用する

```bash
$ curl -u 'username:password' 'https://example.com/'
$ curl -H "Authorization: Basic $(echo 'username:password' | base64)" 'https://example.com/'
$ curl 'https://username:password@example.com/'
```

- Bash … `wget` コマンドの場合

```bash
$ wget --http-user=username --http-password=password 'https://example.com/'
$ wget --header="Authorization: Basic $(echo 'username:password' | base64)" 'https://example.com/'
$ wget 'https://username:password@example.com/'
```

- JavaScript … `window.fetch()` Fetch API の場合
  - Base64 エンコードに `btoa()` を使用している
  - 参考：[Fetch の使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch)
  - 参考：[WindowOrWorkerGlobalScope.btoa() - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/btoa)

```javascript
const response = await window.fetch('https://example.com/', {
  headers: {
    'Authorization': `Basic ${window.btoa('username:password')}`
  }
});
const result = await response.json();
```

- JavaScript … Axios の場合

```javascript
const response = await axios.get('https://example.com/', {
  auth: {
    username: 'username',
    password: 'password'
  }
});
const result = response.data;
```
