---
title        : '単一責任原則 : 一つのモノには一つのことだけやらせる'
created      : 2020-11-17
last-modified: 2020-11-17
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/desgin/index.html 設計
---

いわゆる**単一責任の原則**、ないしは単一責務の原則 (<abbr title="Single Responsibility Principle">SRP</abbr>)。一つのモノの責務・役割は一つにする。

設計段階でのモデルの分割単位でもそうだし、実装段階でのクラスやメソッドの分割粒度にもいえる。改修の際に、*一つのクラスやメソッドに変更が入る理由が一つ*になっていると、上手く単一責任原則を守って設計・実装できているといえるだろう。


## 単一責任原則を守ることによるメリット

- そのクラスやメソッドの責任が1つだけだと、用途や使いどころが明確になる。システム全体・各部分ともに見通しが良くなり、分かりやすくなる
- 単一責務に絞ることで、そのクラスやメソッドが依存するモノが減らせる。依存するモノが減らせると、影響範囲が小さくなるので変更に強くなる (変更しやすくなる)
- 人間の仕事 (タスク) を細分化・分業した方が効率が良くなるのと同じ。一人で全部やろうとするとアタフタするが、コレだけやると決めてあれば、責任の所在もハッキリするし、作業の質も上がる。設計や実装でも同じことが言える


## 単一責任原則を守らないことによるデメリット

- 「そのクラスやメソッドがやること」が増え、「何をインプットに何がアウトプットされるのか」が分かりづらくなる。設計や実装の見通しが悪くなる
- 一つのモノの影響範囲ががあちこちに及ぶため、改修の際に影響範囲を調査したり、整合性を取りながら改修するのが大変になる

一つのモノが抱える責任、依存関係が増えていくと、保守しづらくなる。


## 一つのモノに多くのことをやらせすぎない

- 概念化・抽象化 (オブジェクト指向・ドメイン駆動設計) が正しくできない人は、一つのモノに多くのことをやらせすぎる傾向にある
  - 「メッセージ処理サービスクラス」だとかいって、画面表示する全てのメッセージを定数で持っていたり、エラーメッセージの整形出力処理を持っていたり → いわゆる「**神クラス**」と呼ばれるアンチパターン
  - 「*1メソッドの行数は100行以内、1クラスの行数は1000行以内*」などといった規則は、単に見通しが悪くなることを避けるためのコーディングルールとして展開されがちだが、単一責務の原則を守っていればまずこれ以上の行数にはならないだろう、という「数値化できる指標」としても有用
- 文書を書く場合も、一つの文書、一つの章に詰め込み過ぎない
  - 「〜〜について」というタイトルや見出しにしてしまうと、何をどこまで書くか迷う。*見出しによって執筆する「範囲」を定める*ことが大事


## 参考

- [プログラマが知るべき97のこと - 単一責任原則](https://プログラマが知るべき97のこと.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E5%8E%9F%E5%89%87/)
