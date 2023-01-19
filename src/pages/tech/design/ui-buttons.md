---
title        : ボタン UI のレイアウト設計
created      : 2021-10-11
last-modified: 2021-10-11
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/design/index.html 設計
---

ユーザに選択を促すボタンのレイアウト・デザイン設計に関するナレッジとノウハウ。


## 目次


## OK・Cancel ボタンの配置

OK、Cancel ボタンを左右どちらに配置するべきか。各種文献から指針を定める。

- iOS Human Interface Guidelines
  - iOS 9 以前は「最も自然なアクション」が「非破壊的なら右側」「破壊的なら左側」としていた
  - iOS 10 以降は、**「常に最も自然なアクションが右側」「常にキャンセルボタンが左側」** となった (MacOS も同じ)
- Material Design (Google Android) Guidelines
  - 「肯定的なアクションは右側」「否定的なアクションは左側」とされており、MacOS や iOS 10 以降と同じ
- Windows User Experience Guidelines
  - 「『実行する』が左側」「『実行しない』が右側」(iOS・MacOS・Android と逆)

ということで、Windows ネイティブなアプリケーションを作るのでなければ、一般的な Web アプリなどでは、*「右側に OK」「左側に Cancel」で統一するのが自然*だろう。

### 参考文献

- 参考：[Alerts - Views - iOS - Human Interface Guidelines - Apple Developer](https://developer.apple.com/design/human-interface-guidelines/ios/views/alerts/)
  - > Place buttons where people expect them. In general, _buttons people are most likely to tap should be on the right_. **Cancel buttons should always be on the left.**
- 参考：[Dialogs - Material Design](https://material.io/components/dialogs)
  - > Confirming actions  
    > To resolve what triggered the dialog, confirming actions confirm a proposed action. These actions can involve removing something, such as “Delete” or “Remove,” if it suits the context. They are placed on *the right side of the screen.*
  - > Dismissive actions  
    > Dismissive actions dismiss a proposed action, and return the user to the originating screen or step. They are placed directly to **the left of a confirming action.**
- 参考：[ボタン - Windows apps | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/apps/design/controls/buttons#recommendations)
  - > 同じ意思決定に対して複数のボタンが存在する場合 (確認のダイアログなど)、コミット ボタンは次の順番で提示します。この `"[実行する]"` と `"[実行しない]"` は、主要な指示への具体的な応答になります。
    > 
    > - `[OK]/[実行する]/[はい]`
    > - `[実行しない]/[いいえ]`
    > - `キャンセル`
- 参考：[アラートのOK、Cancelボタンは右と左、どちらにおくべきか？ - Qiita](https://qiita.com/eKushida/items/90c8cd861b65427e466b)
- 参考：[常にキャッチアップしよう！iOSヒューマンインターフェイスガイドライン | by Mie Kwon | Medium](https://medium.com/@kwonmie/%E5%B8%B8%E3%81%AB%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81%E3%82%A2%E3%83%83%E3%83%97%E3%81%97%E3%82%88%E3%81%86-ios%E3%83%92%E3%83%A5%E3%83%BC%E3%83%9E%E3%83%B3%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%82%A4%E3%82%B9%E3%82%AC%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3-8e0671b6315c)
- 参考：[ボタンのラベルや配置順序のベストプラクティスとは | UX MILK](https://uxmilk.jp/56527)
- 参考：[UIデザインの原則デザインガイドライン | bauhausify](https://www.bauhausify.com/2019-07-10_UI%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%81%AE%E5%8E%9F%E5%89%87%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%82%AC%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3/)
