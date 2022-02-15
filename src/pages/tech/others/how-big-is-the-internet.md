---
title        : クラウド・データセンタ・インターネットの規模を推定する
created      : 2022-02-15
last-modified: 2022-02-15
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/others/index.html その他技術情報
---

「YouTube はどれだけの動画データを保管しているのか」「AWS はどんなサーバが何台用意されているのか」といった、世界のスペック・規模を調べてみます。

多くの企業はその詳細を開示しないので、基本的にはフェルミ推定により算出しています。より正確な情報が見つかり次第、随時アップデートしていきます。


## 目次


## 基礎知識のおさらい

### データの単位

テラ → ペタ → エクサ → ゼタ、は覚えておく。

- ビット : bit (b) … 1 か 0 かのデータ、と思って良い
- バイト : Byte (B) … 1B = 8b
- キロバイト : Kilo Byte (KB) … 1KB = 1,000B
- メガバイト : Mega Byte (MB) … 1MB = 1,000KB
- ギガバイト : Giga Byte (GB) … 1GB = 1,000MB
- テラバイト : Tera Byte (TB) … 1TB = 1,000GB
- ペタバイト : Peta Byte (PB) … 1PB = 1,000TB
- エクサバイト : Exa Byte (EB) … 1EB = 1,000PB (100万 TB)
- ゼタバイト : Zetta Byte (ZB) … 1ZB = 1,000EB (10億 TB)
- ヨタバイト : Yotta Byte (YB) … 1YB = 1,000ZB

### 大手クラウドベンダ名称

必ずしもクラウドベンダ自身がデータセンタを建設しているとは限らない。例えば AWS は Equinix (エクイニクス) というデータセンタ事業者が持つデータセンタに AWS サーバを置いていると言われている。

- Amazon Web Services (AWS) : Amazon 社
- Azure : Microsoft 社 (Windows や Office を提供している)
- Google Cloud Platform (GCP) : Google 社 (YouTube や Gmail を運用している)
- Alibaba Cloud (AliYun) : アリババグループ (世界で第3・4位あたりに位置する。中国企業)
- Oracle Cloud : Oracle 社 (オラクルデータベースで有名)
- IBM Cloud : IBM 社


## 2022年時点で感覚的に持っておいて良い数字

2022年時点で、大体コレくらいの感覚値を持っておいて大きく間違っていないだろう、という数字をまとめる。根拠となるデータや推定の過程は、後述の各種文献を参照のこと

- __サーバラック100棚で 1EB (= 1,000PB = 100万 TB) ものデータを保存できる__。コレは 16TB HDD を672,000台使う計算。バスケットボールコート1面程度の面積でサーバラックを200棚置ける
- 世界に存在するデータの総量は2022年時点で 80ZB。2025年には 175ZB に達する見込み
- YouTube は2022年時点で既に 10～12EB 程度のストレージ容量を使っている計算。1分あたり100時間分、およそ 200GB 分程度の動画がアップロードされていると推定される
- Apple は 8EB ものストレージを Google に借りている
- TikTok、Spotify はそれぞれ 500PB 弱のストレージを借りている → 「名前を聞いたことがある程度の有名サービス」は、数百 PB 程度のデータは普通に取り扱っていると思って良い


## AWS の規模

- データセンタの所在地
  - [WikiLeaksがAWSのデータセンター所在地を暴露したので詳細を見る - Qiita](https://qiita.com/saitotak/items/f56234d0506b47ddbcfe)
  - [AWSのサーバー設置場所はどこか、公開情報とウワサのまとめ - サーバー構築と設定 ～初心者にも分かりやすく解説～](https://xn--o9j8h1c9hb5756dt0ua226amc1a.com/?p=1268)


## Microsoft Azure の規模

- [ASCII.jp：偽名で運用 !? Azureデータセンターの「トリビア」を集めてみた](https://ascii.jp/elem/000/001/474/1474081/)
  - データセンタを管理する組織 <abbr title="Microsoft Cloud Infrastructure and Operations">MCIO</abbr> は MS 社内でも秘密の存在
  - Azure のデータセンタは一部の人が見学可能
- [We Live in the Cloud | Microsoft Story Labs](https://news.microsoft.com/stories/microsoft-datacenter-tour/)
  - データセンタをバーチャル見学できるサイト
- [Microsoftが27.6ペタバイトの海底データセンターに設置したウェブカメラの映像を公開中 - GIGAZINE](https://gigazine.net/news/20180810-microsoft-undersea-data-center/) … 2018-08-10 の記事
  - 27.6PB もの容量を持つ、864台のサーバからなるデータセンタを海底に設置した


## Google Cloud の規模

- [Knowledge for Google Products: Google クラウドにデータってどのように保存されてるのだろう？](https://kitaney-google.blogspot.com/2018/11/google.html)
  - データは暗号化された上で複数ファイルに分割して別々の場所に保存している。データセンタからハードディスクを盗み出したとしても情報を収集することはできない
- [Appleが800万テラバイトに及ぶデータをGoogleのサーバーに保存しているとの報道 - GIGAZINE](https://gigazine.net/news/20210630-apple-google-cloud/) … 2021-06-30 の記事
  - iCloud を提供している __Apple は 8EB (= 8,000PB = 800万 TB) のデータを GCP に保管__しており、クラウドストレージの保持のために2021年だけで3億ドル (約330億円) の資金を投じる予定。コレは Google にとって最大の顧客
  - Apple に次ぐ大口顧客は、TikTok を運営する ByteDance … 470PB
  - その次の第3位の大口顧客は、Spotify … 460PB
  - → Apple に 8EB を貸せるだけのデータセンタを持っている Google… (後述の推定を利用すると、サーバラック800棚分くらいを Apple 用に貸している計算)

### Google サービスの規模

- [Googleのソースコードは毎日1万6000行以上ものコード変更が行われているとのことですが、なにをそんなに毎日毎日書き換える必要があるのでしょうか？何を書き換えているのでしょうか？ - Quora](https://jp.quora.com/Google-no-so-su-ko-do-ha-mainichi-1-man-6000-gyou-ijou-mono-ko-do-henkou-ga-gyou-ware-te-iru-to-no-koto-desuga-na-ni-wo-sonnani-mainichi-mainichi-kakikaeru-hitsuyou-ga-aru-node-shou-ka-nani-wo-kakikae-te-iru-node)
  - Google のソースコードは毎日16,000行以上ものコード変更が行われている…らしい

### YouTube の規模

YouTube はどれほどの動画を保管しているのか。どれだけのサーバがあれば保管できるのか、といった情報の推定。

- [YouTubeは何故あんなに世界中の大量の動画を保存していられるのですか？どのくらい巨大なサーバーを持っているのですか？に対するOba Hideyukiさんの回答 - Quora](https://jp.quora.com/YouTube%E3%81%AF%E4%BD%95%E6%95%85%E3%81%82%E3%82%93%E3%81%AA%E3%81%AB%E4%B8%96%E7%95%8C%E4%B8%AD%E3%81%AE%E5%A4%A7%E9%87%8F%E3%81%AE%E5%8B%95%E7%94%BB%E3%82%92%E4%BF%9D%E5%AD%98%E3%81%97%E3%81%A6%E3%81%84%E3%82%89/answers/202205933)
  - YouTube がどのようなサーバラックを持っていそうかの推定
  - 2020年当時、3.5インチ HDD は_1台で 16TB_ のモデルが存在する
  - Dell EMC ストレージアレイ (エンクロージャ) を例にすると、1台 (5U) で3.5インチ _HDD が84台_搭載できる → 16TB × 84台 = __1,344TB (1.34PB) / 1エンクロージャ__
      - 1U = Unit … 横幅19インチのサーバラックの、高さを定める単位。1U は 1.75インチ = 44.45mm
      - 参考 : [1Uサーバーの「U」って何を示すの？ | 日経クロステック（xTECH）](https://xtech.nikkei.com/it/article/COLUMN/20110630/361883/)
  - サーバラック_1棚は 42U_ が標準 → 1棚にストレージアレイが_最大8台_載せられる __(1棚あたり 16TB HDD が672台)__ → 1,344TB × 8台 = __10,752TB (10.75PB) / サーバラック1棚__
  - サーバラックを連ねる一区画は、14棚程度で一束にする。_バスケットボールコート1面分でラックが200棚程度置ける_ → 10,752TB × 200棚 = 2,150,400TB (2,150PB = 2.1EB)
      - 簡単にすると、__サーバラック100棚で 1EB (= 1,000PB = 100万 TB) 保存できる、と思っておくと色々と推定しやすい__
  - テレビ録画用 BD-R 50GB で、6時間録画できることを例にすると…
      - 1エンクロージャ (1,344TB) で… → 1,344,000GB ÷ 50GB × 6時間 = __161,280時間 → 6,720日 分の動画が保存できる__
      - 1サーバラック (10,752TB) で… → 10,752,000GB ÷ 50GB × 6時間 = __1,290,240時間 → 53,760日 分の動画が保存できる__
- [YouTubeは毎日コンスタントに追加される大量のデータに対して、どうやってあれだけ迅速にディスクスペースを追加できているのでしょうか？ - Quora](https://jp.quora.com/YouTube%E3%81%AF%E6%AF%8E%E6%97%A5%E3%82%B3%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%88%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%95%E3%82%8C%E3%82%8B%E5%A4%A7%E9%87%8F%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AB%E5%AF%BE)
  - 2019年より何年も前に、「YouTube はサーバ代が1日1億円かかっている」という噂があったらしい
- [YouTubeの全サーバーを合わせた容量はどの程度ですか？ - Quora](https://jp.quora.com/YouTube-no-zen-sa-ba-wo-awa-se-ta-youryou-ha-dono-teido-desu-ka)
  - 2020年よりかなり以前に、「Google のサーバは 5ZB」という噂があったらしい
  - _2012年2月時点で、200,000,000時間 (2億時間 = 22,831年分) の動画が存在している_
      - [YouTubeの動画は99%が見られてないらしい | ライフハッカー［日本版］](https://www.lifehacker.jp/article/160521youtube_99/)
        > 2016年第1四半期（1～3月期）の時点で、YouTubeには18億3000万から21億5000万の動画がアップされている
  - 2020年2月時点で、_1分あたり500時間分_ = 1時間あたり30,000時間 = _1日あたり720,000時間 (82年分)_ の動画がアップロードされている
      - [• YouTube: hours of video uploaded every minute 2020 | Statista](https://www.statista.com/statistics/259477/hours-of-video-uploaded-to-youtube-every-minute/)
        > As of February 2020, more than 500 hours of video were uploaded to YouTube every minute. This equates to approximately 30,000 hours of newly uploaded content per hour.
  - これらの情報から推定
      - 2020年時点で、存在する動画時間の合計は → __1,251,200,000時間 (12.512億時間) = 142,831年 (14.2万年)__
      - そのデータ量は (1時間あたり 4.5GB 程度のファイルサイズと仮定) → 12.512億時間 × 4.5GB = __5.63EB__
      - データを RAID10 で冗長化しているとすると、2倍の __11.26EB 程度のデータを保存していると推定__できる
  - → 前述の推定を利用すると、_バスケットボールコート6面分くらいの規模で、サーバラックを1,200棚くらい用意することで、2020年までに YouTube にアップロードされた動画を保持していると推測_できる
- [What is the total size (storage capacity) of YouTube, and at what rate is it increasing? How is Google keeping up with the increasing demands of Youtube’s capacity, given that thousands of videos are uploaded every day? - Quora](https://www.quora.com/What-is-the-total-size-storage-capacity-of-YouTube-and-at-what-rate-is-it-increasing-How-is-Google-keeping-up-with-the-increasing-demands-of-Youtube%E2%80%99s-capacity-given-that-thousands-of-videos-are-uploaded-every-day)
  - 2017年時点の試算
  - 1分あたり100時間分の動画がアップロードされている
  - 全ての動画を 720p 画質と仮定すると、_毎分 191GB_、__1年で 93PB__ もの動画がアップロードされていると推定できる
  - 2017年時点までにアップロードされているデータの総量は、約10万の HDD に保存され、10EB に達すると推定している (上述の「11.26EB」という試算と近い)
- [YouTuber が頻繁に動画をアップロードする場合、YouTube のストレージ容量を完全に確保できない](https://voi.id/ja/teknologi/28159/read) … 2021-01-21 の記事
  - 1分あたり300時間分もの動画がアップロードされているらしい (後述の公式発表によると「1分あたり約100時間」なので多いか？)
  - 毎日約50億本の動画が視聴され、1日あたり3,000万人を超える訪問者がいる
- [Google・Youtubeのサーバーストレージ容量は一体何バイトなのか？ | Notissary](https://notissary.net/2020/05/17/google%E3%83%BByoutube%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B8%E5%AE%B9%E9%87%8F%E3%81%AF%E4%B8%80%E4%BD%93%E4%BD%95%E3%83%90%E3%82%A4%E3%83%88)
  - > 1分あたり約100時間分の動画が YouTube にアップロードされています  
    > 毎月10億人以上のユニークユーザーが YouTube にアクセスしています  
    > 毎月60億時間以上の動画が YouTube で視聴されています。これは、地球上のすべての人が毎月約1時間視聴している計算になります
  - 2010年時点で、ニコニコ動画のデータセンタ容量は 1PB。使用している総データ量は 140TB


## 世界の規模

- [2025年には世界で生成されるデータの約30％がリアルタイムデータに--IDC - ZDNet Japan](https://japan.zdnet.com/article/35129774/) … 2018-12-07 の記事
  - [175 Zettabytes By 2025](https://www.forbes.com/sites/tomcoughlin/2018/11/27/175-zettabytes-by-2025/?sh=6af4ba005459)
      - 2022時点で世界のデータは 80ZB 程度と推定されている
      - それが2025年には 175TB に達すると予想されている
  - [YouTubeにしてもクラウドにしても全世界で膨大な量のデータが毎日増え続けていると思いますが、世界のデータ保存容量はそれに合わせて無限に増えていくものなのでしょうか？ - Quora](https://jp.quora.com/YouTube%E3%81%AB%E3%81%97%E3%81%A6%E3%82%82%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%AB%E3%81%97%E3%81%A6%E3%82%82%E5%85%A8%E4%B8%96%E7%95%8C%E3%81%A7%E8%86%A8%E5%A4%A7%E3%81%AA%E9%87%8F%E3%81%AE%E3%83%87%E3%83%BC)
  - [爆発的に増え続けるデータに対応するストレージとは？](https://www.kimoto.co.jp/business/datakitchen_top/datastorage2/bakuhatsu_datastorage)
      - > 2018年には世界を流通するデータは33ZB（ゼダバイト）でしたが、2025年には加速度的に増加し175ZBになると予想されます。
