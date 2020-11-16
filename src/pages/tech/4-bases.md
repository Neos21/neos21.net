---
title        : プロジェクト管理における4つの「ベース」
created      : 2020-11-17
last-modified: 2020-11-17
path:
  - /index.html Neo's World
  - /tech/index.html Tech
---

プロジェクト管理において、以下の4つの「ベース」を区切って考えておくと良い。

1. __タスク・ベース__
    - タスク管理、チケット管理を行う場所
    - 例 : Redmine、Backlog、Trello、「ホワイトボード」
2. __コミュニケーション・ベース__
    - メンバ間の会話を行う場所
    - 例 : Slack、メール
3. __ドキュメント・ベース__
    - 資料を格納する場所
    - 例 : Backlog のファイル機能、SharePoint、DropBox、共有サーバ
4. __コード・ベース__
    - コードを格納する場所
    - 例 : GitHub、Bitbucket

それぞれで次のようなことを決めておく。

- 使用するツール
  - 「タスク管理は Redmine、コード管理は GitHub」のように、可能な限り単一のツールに絞る
  - 「ホワイトボード」の情報を永続化するログとして「Backlog」を使う、といった「ツールの併用」はアリ
  - 一つのツールが複数の機能を提供しており、複数の「ベース」をまかなえる場合は、「タスク管理もコード管理も Backlog」として良い
- 運用ルール
  - チケット起票時に書くべき事項とか、設計書ファイルの命名規則とか
  - なるべくルールを機械的に適用し強制できるよう、仕組み化・自動化していく
  - 定期的に巡回してルールが守られているかチェックする

口頭でのやり取りは意識的に記録を残さないと、メンバ間の認識がズレていく。「口頭の会話」「会議」は、コミュニケーション・ベースとドキュメント・ベースを合わせて考えておく。

- 議事録を書く担当、書式を決めておく
- 毎日の朝会のような、ちょっとした打合せでも「議事録」を残す
- 雑談の中から生まれた事柄などは「コミュニケーション・ベース」にも書き残しておき、なるべく早く「ドキュメント・ベース」に格納できる体裁に持っていく