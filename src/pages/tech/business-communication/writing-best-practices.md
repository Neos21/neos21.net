---
title        : 文書作成で心掛けること
created      : 2020-11-16
last-modified: 2020-11-16
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/business-communication/index.html ビジネスコミュニケーション
---

ドキュメント、メール、テキストチャットなど、あらゆる場面で心掛けたいこと。

## 読み手に無配慮なモノを残さない・作らない

- 以降で色々書いてることを抽象化するとこういうこと
- 読み手に「読解するコスト (認知負荷)」をかけさせない文章が、良い文章
- 読む時のコストを省くと、関係者全員が省力化できる。そのために、書く人がちょっとだけコストをかけて書く

-----

- 理由、経緯を必ず書く ([5W1H を明確にする](./5w1h.html))
  - 5W1H の中の Why は、特に記載が抜けやすい。書こうとするとどうしても文章が長くなるため、面倒臭がって省略しがち
  - それでも省略せず、似たようなことでも、何度でも書くことで、「根拠」を示せる
  - 何を考慮し、どの選択肢をどうして選ばなかったのか、という情報はとても重要。うまく共有できていないと、設計時に外した選択肢を、実装担当者が有益だと勘違いして勝手に盛り込んでしまったりする
  - 経緯を記したドキュメントを一つ作って、全ての関連箇所からそのドキュメントへのリンクを貼って周知すると、省力化できる
- [指示語・代名詞を使わない](./dont-use-demonstrative-pronoun.html)
  - 「それ」「その時」「上記」など。どれだけ文章が長くなってもいいし、何度繰り返し記述することになっても良いので、指示語を使わないことを優先する
  - 「去年」「先週」なども指示語。**日付は年・西暦から正確に書く**
      - 西暦の情報がないと、翌年以降にはいつの情報か分からなくなる
- 表記・表現を揃える ([書式を揃える](./text-formatting.html))
  - 英数字の全角・半角や、同じ単語をひらがな・カタカナ・漢字でデタラメに表記しないこと
      - その単語で検索 (Grep) しても全てがヒットしなくなり、それが影響範囲の調査や修正対象調査の時に調査漏れを引き起こし、新たなバグを生む原因になる
  - 同じ意味なのに異なる言葉を使わない
      - ex. 「サブフォルダ」と「子ディレクトリ」など
  - 表記・表現を揃えるためには、予め「辞書」を作り、「採用する単語」「似ているが使わない単語」を明記し、チーム内での表現統一を図る
- 規則性をもたせる
  - フォーマットは一定の範囲で揃える
  - 機能説明の時に、「システム」を主語に能動態で書くのか、それとも受動態で書くのか、といった体裁も揃える
  - その場しのぎで例外的な書き方をしたりしない
  - 規則を守らせやすくするには : 規則の適用範囲を小さく保つ
      - 設計段階で「ドキュメントを書く時のルール」を定めると、テスト仕様書のフォーマットを作り始めた時に、ルールが上手く合わないことが出てきたりする
      - 「全てのドキュメントに適用するルール」を作るのではなく、「設計書で守るべき規則」「テスト仕様書で守るべき規則」という風に、規則の適用範囲を一定の領域に絞ると良い
      - 分割したそれぞれの領域で似たようなルールが存在する時は、なるべく同じ基準にしておきたいが、無理に統一しようとせず、また「共通ルール」といった資料を作らないようにする
- [体言止めを使ってはならない](./dont-end-with-a-noun.html)
  - 動詞・アクションが不明瞭になり、それが要件の勘違いなどに繋がるため
  - 個人的・一時的なメモであっても、後で思い出せなくなる恐れがあるので、必ず「○○**する**」まで書く
