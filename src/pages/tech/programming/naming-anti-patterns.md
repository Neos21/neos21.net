---
title        : 命名アンチパターン
created      : 2020-11-17
last-modified: 2020-11-17
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

クラス名やメソッド名、変数名が正しく命名されていない状態は、単にコードリーディングが難しくなるだけでなく、_単一責務の原則_を破り、スパゲティ化したコードになりやすい。

命名に関する「やってはいけないこと」をまとめておく。


## 変数名に使用してはいけないモノ

- `info`・`data` : `userInfo`・`userData` など
  - 何かしらの情報だし、何かしらのデータであることは分かっている。どんな情報・データなのか説明するべき
  - `userData` とはせず単純に `user` とするか、`currentUser`・`loginUser` など、対象を絞り込むような言葉を付ける
- 連番 : `user1`・`user2` など
  - `1`・`2` という数値には意味がないことが多い。順序を示したいワケでもない。_マジックナンバー_の一種
  - そうではなく、何故それらを区別しておきたいのかを考える
  - 例えば「編集前のデータ」と「画面で編集したデータ」といった違いがあるのであれば、`originalUser` と `afterUser` だとかいう風に付けた方が分かりやすい
- `work` : `workUser` など
  - 「ワーク変数」という考え方をそのまま変数名に当てるのは危険。大抵はワーク変数のライフサイクルが長くなり、繰り返し代入する作りになっていて、途中経過が追いづらい
  - データを加工する一連の処理をメソッドに切り出し、変更ごとに別の変数 (定数) として宣言した方が良い