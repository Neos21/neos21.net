---
title        : Git は最初に空コミットする
created      : 2021-10-11
last-modified: 2021-10-11
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

リポジトリ作成直後、ブランチ作成直後は、ファイルに何の変更も入れずに、空コミットを入れる運用が良い。

`$ git commit --allow-empty` で、何の変更もない状態でコミットが打てる。

```bash
$ git commit --allow-empty -m 'Init'
```

コレを定型文にしよう。

最初のコミットを Rebase したくなった時にやりづらくなるのを避ける狙いと、ブランチ作成地点が後で探しやすくなるため、オススメである。

- 参考：[Gitの最初のコミットは空コミットにしよう - Qiita](https://qiita.com/NorsteinBekkler/items/b2418cd5e14a52189d19)
