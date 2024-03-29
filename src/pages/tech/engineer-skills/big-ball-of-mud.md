---
title        : 大きな泥だんご … 誰もが避けたいがどのシステムもこうなっている
created      : 2023-02-16
last-modified: 2023-02-16
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/engineer-skills/index.html エンジニア必須スキル
---

大きな泥だんご。英語で Big ball of mud と表現するこの状態は、**無秩序なコードがツギハギされた、メチャクチャなシステム**のことを指す。

誰しも、みすみす破茶滅茶なシステムを作ろうとは考えておらず、できればキレイなコードを書きたいと思っているはずだが、どうしてこうなるのか。それは設計・実装に対する意識が低かったり、顧客要求が頻繁に変わったり、プロジェクトマネジメントが適切に行われていなかったりするためであろう。大抵は「最初はキレイでこじんまりまとまっていた」のに、歴史的経緯により複数の構造体を無理やり結合した「大きな泥だんご」へと改変されていく。

「Joel On Software」によれば、こうしたクソコードまみれのシステムを改善していく際には、フルスクラッチで書き直すのではなく、少しずつリファクタリングすることが重要だとしている。なぜなら、汚いコードであっても、そのコードは既に実際に稼動しており、稼動していることでテストがなされているに等しいから、というワケだ。見た目がイビツでもちゃんと動いているのだから、不用意に壊さないように、少しずつリファクタリングするのである。

- 参考 : [ぐちゃぐちゃなコードしかないチーム／プロジェクトに配属された場合のポジティブ思考 | まくまくいろいろノート](https://maku77.github.io/memo/mind/gucha.html)
- 関連ブログ記事 : 2017-09-22 [大きな泥だんご](/blog/2017/09/22-01.html)
