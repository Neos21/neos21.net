---
title        : プログラミングに関する著名な原理・原則の一覧
created      : 2020-11-17
last-modified: 2020-11-17
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

プログラミングやエンジニアリングに関する、著名な原理・原則をまとめる。個人の思い付きで掲げた標語ではなく、世間的に知られているベストプラクティスなら、皆に従ってもらいやすいだろうという権威主義的な考え。

- **デルメルの法則 : 最小知識の原則 : Principle of Least Knowledge**
  - _意味 :_ あるオブジェクトが自分以外の構造やプロパティに対して持っている「仮定」を最小限にすべき、という考え
  - _例示 :_ 自分以外のクラスのメンバフィールド `name` を直接触っているのは、「そのクラスに `name` プロパティが存在する」という仮定に依存している。コレを `getName()` 経由にしておけば、対象クラスに `name` プロパティがあるかどうか、という構造の影響を受けなくなる
  - _出自 :_ 1987年の末にかけてノースイースタン大学で作成された
  - _参考 :_ [Wikipedia - デルメルの法則](https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%A1%E3%83%86%E3%83%AB%E3%81%AE%E6%B3%95%E5%89%87)
- **驚き最小の法則 : Principle of least astonishment : Rule of least surprise**
  - _意味 :_ UI や設計において、あるインターフェースと別のインターフェースとが矛盾していたりする時、ユーザやプログラマが自然に思える動作を選択すべき、という考え方
  - _例示 :_ 相手の驚きが少ない行動を選ぼう、ということ
  - _出自 :_ (誰が最初に提唱したのかは不明)
  - _参考 :_ [Wikipedia - 驚き最小の原則](https://ja.wikipedia.org/wiki/%E9%A9%9A%E3%81%8D%E6%9C%80%E5%B0%8F%E3%81%AE%E5%8E%9F%E5%89%87)
- **ムーアの法則 : Moore's law**
  - _意味 :_ 集積回路上のトランジスタ数は「18ヶ月 (=1.5年) ごとに倍になる」
  - _例示 :_ 平易に派生して、「コンピュータの性能は18ヶ月で倍になる」などと言われたりする
  - _出自 :_ 米インテル社の創業者の <dfn title="ゴードン・ムーア">Gordon E. Moore</dfn> が1965年に自らの論文上に示したのが最初
  - _参考 :_ [Wikipedia - ムーアの法則](https://ja.wikipedia.org/wiki/%E3%83%A0%E3%83%BC%E3%82%A2%E3%81%AE%E6%B3%95%E5%89%87)
- **ヴィルトの法則 : Wirth's law**
  - _意味 :_ ソフトウェアは、ハードウェアが高速化するより急速に低速化する
  - _例示 :_ ハードウェアの進歩に応じてソフトウェアは富豪的プログラミングになり、フレームワーク等も増えてくるから、結果的にソフトウェアの動作速度が速く感じない、ということ
  - _出自 :_ <dfn title="ニクラウス・ヴィルト">Niklaus Wirth</dfn> による1995年に発表された記事「A Plea for Lean Software」における議論に由来
  - _参考 :_ [Wikipedia - ヴィルトの法則](https://ja.wikipedia.org/wiki/%E3%83%B4%E3%82%A3%E3%83%AB%E3%83%88%E3%81%AE%E6%B3%95%E5%89%87)
- **ボーイスカウト原則**
  - _意味 :_ モジュールをチェックインする際には、必ずチェックアウト時よりも美しくする
  - _例示 :_ ボーイスカウトが訪れた山を綺麗にして帰ることから。改修のために触ったコードは、既存のコードを綺麗にする
      - 現場によっては「関係ないコードを触るな」なんて言われたりするが、単体テスト自動化、CI 環境が整備できていれば問題ないレベルの「改善」をしよう
  - _出自 :_ 書籍「プログラマが知るべき97のこと」内、<dfn title="ロバート・C・マーチン">Robert C. Martin</dfn>
  - _参考 :_ [プログラマが知るべき97のこと - ボーイスカウト・ルール](https://プログラマが知るべき97のこと.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/%E3%83%9C%E3%83%BC%E3%82%A4%E3%82%B9%E3%82%AB%E3%82%A6%E3%83%88-%E3%83%AB%E3%83%BC%E3%83%AB/)
- **<abbr title="You Ain't Gonna Need It">YAGNI</abbr> (ヤグニ・ヤーグニ)**
  - _意味 :_ 「それはきっと必要にならない」
  - _例示 :_ 本当にそれが必要になるまでは、余計なモノは実装しない (その時間が無駄)。<abbr title="eXtreme Programming">XP</abbr> の原則
  - _出自 :_ 1999年の書籍「Extreme Programming」の著者の一人、<abbr title="ロン・ジェフリーズ">Ron Jeffries</abbr> が主に発言
  - _参考 :_
      - [Wikipedia - YAGNI](https://ja.wikipedia.org/wiki/YAGNI)
      - [Wikipedia - You aren't gonna need it](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
- **<abbr title="Don't Repeat Yourself">DRY</abbr>**
  - _意味 :_ 同じことを繰り返すな
  - _例示 :_ 同じような処理を何度も書いているならメソッド化する。DB の正規化
  - _出自 :_ Andy Hunt・Dave Thomas の著書「The Pragmatic Programmer (達人プログラマー)」で提唱。「プログラマが知るべき97のこと」でも言及されている
  - _参考 :_
      - [Wikipedia - Don't repeat yourself](https://ja.wikipedia.org/wiki/Don%27t_repeat_yourself)
      - [Wikipedia - コードの再利用](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E5%86%8D%E5%88%A9%E7%94%A8)
      - [Wikipedia - 関係の正規化](https://ja.wikipedia.org/wiki/%E9%96%A2%E4%BF%82%E3%81%AE%E6%AD%A3%E8%A6%8F%E5%8C%96)
      - [プログラマが知るべき97のこと - DRY 原則](https://プログラマが知るべき97のこと.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/DRY%E5%8E%9F%E5%89%87/)
- **<abbr title="Keep It Simple, Stupid!">KISS</abbr>**
  - _意味 :_ シンプルにしておけバカ。「Keep It Short and Simple (簡潔・単純にしておけ)」とも
  - _例示 :_ 設計や実装手法を単純なモノにブレイクダウンしておくこと。不必要に複雑にしないこと
  - _出自 :_ ロッキード・スカンクワークスの技術者ケリー・ジョンソンが作った
  - _参考 :_ [Wikipedia - KISS の原則](https://ja.wikipedia.org/wiki/KISS%E3%81%AE%E5%8E%9F%E5%89%87)
- **<abbr title="SRP・OCP・LSP・ISP・DIP">SOLID</abbr>**
  - _意味 :_ オブジェクト指向設計に関する以下の5つの原則の頭文字
      1. <abbr title="Single Responsibility Principle">SRP</abbr> (単一責務の原則) : クラスを変更する理由は1つにする。
      2. <abbr title="Open / Closed Principle">OCP</abbr> (開放 / 閉鎖原則) : クラスは拡張に対して開き、修正に対して閉じておく。
      3. <abbr title="Liskov Substitution Principle">LSP</abbr> (リスコフの置換原則) : 派生型 (継承する子クラス) はその基本型 (親クラス) と置換可能にする。
      4. <abbr title="Interface Segregation Principle">ISP</abbr> (インターフェース分離の原則) : クライアントが利用しないメソッドへの依存を強制しない。
      5. <abbr title="Dependenciy Inversion Principle">DIP</abbr> (依存性逆転の原則) : 上位のモジュールは下位のモジュールに依存しない。どちらも「抽象」に依存するべき。
  - _例示 :_ (それぞれの原則の項で個別に触れる)
  - _出自 :_ XP の提唱者ロバート・C・マーチンが2005年に書いた「The Principles of <abbr title="Object Oriented Design">OOD</abbr>」という記事で SOLID という5つにまとめたとされる
  - _参考 :_
      - [Wikipedia - SOLID](https://en.wikipedia.org/wiki/SOLID)
      - [The Principles of OOD](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)
- **単一責務の原則 : <abbr title="Single Responsibility Principle">SRP</abbr>**
  - _意味 :_ 一つのモノの責務・役割は一つにする。一つのモノに変更が入る理由は一つにする。「単一_責任_の原則」とも
  - _例示 :_ 1つのクラスやメソッドに複数の処理を詰め込まない
  - _出自 :_ XP の提唱者ロバート・C・マーチンが2005年に書いた「The Principles of <abbr title="Object Oriented Design">OOD</abbr>」という記事がほぼ初出
  - _参考 :_
      - [Wikipedia - Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
      - [プログラマが知るべき97のこと - 単一責任原則](https://プログラマが知るべき97のこと.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E5%8E%9F%E5%89%87/)
      - 拙記事：[一つのモノには一つのことだけやらせる](single-responsibility-principle.html)
- **開放 / 閉鎖原則 : <abbr title="Open / Closed Principle">OCP</abbr> : オープン・クローズドの原則**
  - _意味 :_ 拡張に対して開いていて、修正に対して閉じていること
  - _例示 :_ 機能の追加や変更がしやすい作りであり、かつ、既存の実装を修正した時の影響範囲が少なくなる作りが良い、ということ。一度作ったクラスは原則変更せず、継承によって機能を追加したり、ポリモーフィズムを利用したりして、拡張に対して開く。また、グローバル変数を利用しないようにしたり、インスタンス変数を `private` で扱ったりすることで、修正時の影響を小さくする
  - _出自 :_ <dfn title="バートランド・メイヤー">Bertrand Meyer</dfn>の1988年の著書「Object Oriented Software Construction (オブジェクト指向ソフトウェアの構築)」
  - _参考 :_ [Wikipedia - 開放 / 閉鎖原則](https://ja.wikipedia.org/wiki/%E9%96%8B%E6%94%BE/%E9%96%89%E9%8E%96%E5%8E%9F%E5%89%87)
- **リスコフの置換原則 : <abbr title="Liskov Substitution Principle">LSP</abbr>**
  - _意味 :_ 派生型 (継承する子クラス) はその基本型 (親クラス) と置換可能になっていないといけない
  - _例示 :_ 基本クラスを使っている場所で、その基本クラスの代わりにサブクラスを用いたとしても、正しく動作すること
  - _出自 :_ <abbr title="バーバラ・リスコフ">Barbara Liskov</abbr>・<abbr title="ジャネット・ウィング">Jeannette Wing</abbr> の1993年の論文「Family Values: A Behavioral Notion of Subtyping」で示された
  - _参考 :_
      - [Wikipedia - リスコフの置換原則](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%82%B9%E3%82%B3%E3%83%95%E3%81%AE%E7%BD%AE%E6%8F%9B%E5%8E%9F%E5%89%87)
      - [Qiita - オブジェクト指向設計原則とは](https://qiita.com/UWControl/items/98671f53120ae47ff93a)
- **インターフェース分離の原則 : <abbr title="Interface Segregation Principle">ISP</abbr>**
  - _意味 :_ クライアントは自分が使わないメソッドに依存することを強制されない
  - _例示 :_ クライアントが本当に使いたいメソッド (インターフェース) のみが提供されるべき。インターフェースや委譲による分離。「Listener (リスナー)」というインターフェース
  - _出自 :_ 2002年、ロバート・C・マーチンの「Agile Software Development」にて提唱された
  - _参考 :_
      - [Wikipedia - Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)
      - [オブラブ - ソフトウェア原則 4](http://objectclub.jp/technicaldoc/object-orientation/principle/principle06)
- **依存性逆転の原則 : <abbr title="Dependenciy Inversion Principle">DIP</abbr>**
  - _意味 :_ 上位のモジュールは下位のモジュールに依存してはならない。どちらも「抽象」に依存するべき
  - _例示 :_ クラス同士を具象クラスで依存させるのではなく、抽象クラスかインターフェースを通じて関係を示す
      - ある具象クラス「A クラス」が、別の具象クラス「B クラス」の処理を利用する場合、「B クラス」のインターフェースに依存することになる
      - しかし、「B クラス」をそのまま呼ばず、「A クラス」側でインターフェースを宣言しておき、そこに「B クラス」を適用する (<abbr title="Dependency Injection">DI</abbr>) ようにすると、「A クラス」が呼びたいインターフェースを自分で決めたことになり、インターフェースの所有権が「A クラス」に変えられる。コレが「逆転」ということ
  - _出自 :_ ロバート・C・マーチンの1994年の論文「Object Oriented Design Quality Metrics: an analysis of dependencies」
  - _参考 :_
      - [Wikipedia - Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
      - [A Memorandum - The Dependency Inversion Principle DIP 依存関係逆転原則](http://etc9.hatenablog.com/entry/20090924/1253802289)
      - [SlideShare - 20160526 依存関係逆転の原則](https://www.slideshare.net/ShintaroKurosawa/20160526-62511723)
- **関心の分離 : <abbr title="Separation of Concerns">SoC</abbr>**
  - _意味 :_ それぞれのプログラムの関心事 (やりたいこと) を分けること
  - _例示 :_ Web ページを構成する HTML・CSS・JavaScript は、それぞれ文書構造・見栄え・画面処理というそれぞれの関心事に分離されており、それぞれは疎結合になっている。MVC パターンなども「関心の分離」の一例
  - _出自 :_ エドガー・W・ダイクストラの1974年の論文「On the role of scientific thought (科学思想の役割)」で初めて「Separation of Concerns」という言葉が使われた
  - _参考 :_ [Wikipedia - 関心の分離](https://ja.wikipedia.org/wiki/%E9%96%A2%E5%BF%83%E3%81%AE%E5%88%86%E9%9B%A2)
- **ジョシュア・ツリーの法則 : <abbr title="Joshua Tree Principle">JTP</abbr>**
  - _意味 :_ 名前を知った途端にそれが見えるようになること
  - _例示 :_ デザインパターンを勉強しておくと、コードを見た時にデザインパターンに当てはめてより色々なことが理解・推測できるようになる
  - _出自 :_ 作家 Robin Williams の1994年の著書「The Non Designer's Design Book (ノンデザイナーズ・デザインブック)」の冒頭。書籍「プリンシプル・オブ・プログラミング」にも登場
  - _参考 :_ [オブラブ - ソフトウェア原則 ちょっと横道 その1 JTP Joshua Tree Principle](http://objectclub.jp/technicaldoc/object-orientation/principle/principle04)
- **UNIX 哲学**
  - _意味 :_ UNIX OS の開発経験に基づく規範や哲学的なアプローチのまとまり。有名なものは以下
      1. 一つのことを行い、またそれをうまくやるプログラムを書け。(ダグラス・マキルロイ)
      2. 早すぎる最適化は諸悪の根源である。 (ドナルド・クヌース)
      3. 疑いがあるときは総当たり (Brute Force) を使え。 (ケン・トンプソン)
      4. スマートなデータを使うつまらないコードを書け。
      5. 小さいものは美しい。 (マイク・ガンカーズ)
      6. できる限り早くプロトタイプを作れ。 (マイク・ガンカーズ)
      7. 効率よりも移植しやすさ。 (マイク・ガンカーズ)
      8. 単純なテキストファイルにデータを格納せよ。 (マイク・ガンカーズ)
      9. 拘束的なユーザインタフェースは作るな。 (マイク・ガンカーズ)
      10. 全てのプログラムはフィルタとして振る舞うようにせよ。 (マイク・ガンカーズ)
      11. より悪いことは、より良いことだ。 (リチャード・P・ガブリエル) … (質と機能性は必ずしも比例しないことから。完全さよりもシンプルさ)
  - _例示 :_ 全体的に、「シンプルが良いこと」という感じ「1つのプログラムは、1つのことを小さくやろう (単一責務の原則)」「完璧さを求めず、平易でシンプルにしよう (KISS 原則)」
  - _出自 :_ UNIX 創始者の一人で、「パイプ」の技術を発明したプログラマ、ダグラス・マキルロイの2000年の著書「UNIX の四半世紀」や、1989年、ロブ・パイクの「Notes on Programming in C」など
  - _参考 :_
      - [Wikipedia - UNIX 哲学](https://ja.wikipedia.org/wiki/UNIX%E5%93%B2%E5%AD%A6)
      - [デザインの「悪い方がよい」原則](http://chasen.org/~daiti-m/text/worse-is-better-ja.html)
- **ポステルの法則 : Postel's Law**
  - _意味 :_ 送信するものに関しては厳密に、受信するものに関しては寛容に
  - _例示 :_ 元はインターネット通信の原則だが、「受信」を「入力」、「送信」を「出力」と解釈して「入力は寛容に、出力は厳密に」と捉えると、メソッドの作りの原則としても応用できる
  - _出自 :_ <dfn title="ジョン・ポステル">Jon Postel</dfn> の1981年の RFC「RFC793」
  - _参考 :_ [RFC 793 - Transmission Control Protocol](https://tools.ietf.org/html/rfc793)
- **銀の弾丸などない**
  - _意味 :_ 魔法のように、すぐに役に立ち、プログラマの生産性を倍増させるような技術や特効薬は存在しない
  - _例示 :_
      - 何かをサクッと解決することはできない
      - 複雑性の性質を区別する。本質的な複雑性 (解決したい問題自体の複雑さ) にのみフォーカスし、偶有的な複雑性 (開発者が発生させている、解決可能な問題) はできるだけ早く取り除く
  - _出自 :_ フレデリック・ブルックスの1986年の書籍「銀の弾などない - ソフトウェアエンジニアリングの本質と偶有的事項」
  - _参考 :_ [Wikipedia - 銀の弾丸などない](https://ja.wikipedia.org/wiki/%E9%8A%80%E3%81%AE%E5%BC%BE%E3%81%AA%E3%81%A9%E3%81%AA%E3%81%84)
- **金のハンマー : ゴールデン・ハンマー病 : ハンマー釘病**
  - _意味 :_ 気に入った方法があらゆるところで利用できると思い込む、アンチパターンの一種
  - _例示 :_ 「銀の弾丸などない」のに、一度知ったやり方をあらゆるところで利用しようとし、「そのパターンならこっちの方が楽だよ」といった視点を欠いている
  - _出自 :_ Abraham Harold Maslow の言葉「ハンマーを持つ人にはすべてが釘に見える」から
  - _参考 :_ [@ledsun blog - 優秀なプログラマになるために](https://ledsun.hatenablog.com/entry/2017/10/04/120055)
- **神クラス : 神オブジェクト : God Object : Monster Object**
  - _意味 :_ 一つのクラスやオブジェクトに過剰に機能が集中すること。アンチパターンの一種
  - _例示 :_ あるクラスが文字列変換も HTTP 通信も入力チェックも全部やっているような状態、もしくはそうした機能を盛り込まれた「汎用ユーティリティクラス」など。「単一責務の原則」に反する
  - _出自 :_ Arthur J. Riel の1996年の書籍「Object-Oriented Design Heuristics」にて紹介された
  - _参考 :_ [Wikipedia - God object](https://en.wikipedia.org/wiki/God_object)
- **カーゴ・カルト・プログラミング**
  - _意味 :_ 実際には意味のないコードやプログラムが混ざっているにも関わらず、その仕組みや動きを理解していないために、「おまじない」的にコーディングしていること。アンチパターンの一種
  - _例示 :_ 「誰かが1行目にコレを書けって言ってたから書いとこう」と書かれた間違った Shebang。意味を理解せずにコピペプログラミングしたために各所に見られる「不必要な `new`」など
  - _出自 :_ リチャード・P・ファインマンが1974年にカリフォルニア工科大学の卒業式で発表した式辞「カーゴ・カルト・サイエンス」がオリジナルか
  - _参考 :_ [Wikipedia - カーゴ・カルト・プログラミング](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%BC%E3%82%B4%E3%83%BB%E3%82%AB%E3%83%AB%E3%83%88%E3%83%BB%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0)
- **ハードコーディング**
  - _意味 :_ プログラムの動作環境などの「仮定」を実装に埋め込んでしまうこと。いわゆる「ベタ書き」。アンチパターンの一種
  - _例示 :_ 対象のプログラムが動作するベース URL を設定ファイル等で差し替え可能な作りにせず、コード内の String 変数に直接書き込んでしまうような作り
  - _出自 :_ (誰が言い出したかは不明)
  - _参考 :_ [Wikipedia - Hard coding](https://en.wikipedia.org/wiki/Hard_coding)
- **マジックナンバー**
  - _意味 :_ 意味のある数値を何の説明もなく使用している状態。アンチパターンの一種
  - _例示 :_ 税込金額の計算プログラムとして、`return price * 1.08;` のように、税率 8% を前提とした `1.08` という数値をハードコーディングしていると、`1.08` はマジックナンバーと呼ばれる。`taxRate` といった変数名を付けるべき
  - _出自 :_ (誰が言い出したかは不明)
  - _参考 :_ [Wikipedia - マジックナンバー](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%82%B8%E3%83%83%E3%82%AF%E3%83%8A%E3%83%B3%E3%83%90%E3%83%BC_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0))
- **プログラマの三大美徳 : 怠惰・短期・傲慢**
  - _意味 :_ 効率・再利用性を重視すること、処理速度を追求すること、品質にかける自尊心を表現したもの
  - _例示 :_ 横着するための労力を惜しんではいけない。ただし、「手段の目的化」に陥らないよう注意
  - _出自 :_ Perl 言語を開発した Larry Wall の発言
  - _参考 :_ [Wikipedia - プログラマ](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9E)
- **Yak Shaving : ヤクの毛を刈る**
  - _意味 :_ 「真の問題を解くのに必要な問題」を解くのに必要な問題 (が何段階も続く)、を解くのに必要な活動…、という意味
  - _例示 :_ 「○○を実装したい」という真の目的の前に、「SSL 認証が必要で、そのためには証明書の準備が必要で、そのために文字列変換が必要になって、その中で文字コード変換が必要になって…」といった状態
  - _出自 :_ Jeremy H. Brown のメールが元らしい
  - _参考 :_
      - [Yak Shaving](http://projects.csail.mit.edu/gsb/old-archive/gsb-archive/gsb2000-02-11.html)
      - [bk ブログ - yak shaving で人生の問題の80%が説明できる問題](http://0xcc.net/blog/archives/000196.html)


## 参考

- [Qiita - 何かのときにすっと出したい、プログラミングに関する法則・原則一覧](https://qiita.com/hirokidaichi/items/d6c473d8011bd9330e63)
- [Wikipedia - Category:コンピュータに関する法則](https://ja.wikipedia.org/wiki/Category:%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E6%B3%95%E5%89%87)
- [人名を冠したソフトウェア開発の19の法則](https://www.yamdas.org/column/technique/19laws.html)
- [Wikipedia - アンチパターン](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)
- [Jargon! Jargon!](http://www.nurs.or.jp/~sug/soft/jargon.htm)
- [Qiita - 技術系の名言まとめ++](https://qiita.com/kkyouhei/items/38ba41fb6b877f160e99)
- [Qiita - 世界の凄腕エンジニア達からのプログラミングに関するお言葉集は不思議にココロを打つのでした](https://qiita.com/jabba/items/efcc1d7a15075e631b36)
