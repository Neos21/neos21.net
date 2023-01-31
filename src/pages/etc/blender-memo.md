---
title        : Blender 勉強メモ
created      : 2021-08-01
last-modified: 2021-08-01
path:
  - /index.html Neo's World
  - /etc/index.html Etc.
---

2021年より Blender で 3DCG 作成を始めた。その学習メモ。日付は参考リンクの追加日。


## 目次


## Blender v2.9 を始める

- 2021-07-09 : [【初心者向け】世界一やさしいBlender入門！使い方＆導入〜画像作成までを解説【Blender2.9】 - YouTube](https://www.youtube.com/watch?v=S6aAvxUx2ko)
  - Blender は v2.8 以降で大きく操作性が変わった


## 海洋モディファイアによる海の表現

- 2021-07-09 : [【Blender 2.8】超簡単！フォトリアルな海の作り方【3DCG】 - YouTube](https://www.youtube.com/watch?v=uPDLLQom9O4)


## 流体シミュレーション

### 水のシミュレーション

- 2021-07-11 : [【blender2.9】え！CG？流体シミュレーション Byタピオカミルクティー - YouTube](https://www.youtube.com/watch?v=j-7y37e0sHA)
- 2021-07-11 : [ゆっくりのBlender解説第6回 流体シミュレーション - YouTube](https://www.youtube.com/watch?v=IBi6CXz6zoM)
- 2021-07-11 : [2.80 Blender Tutorial: Water Simulation in EEVEE, Nearly Real-Time - YouTube](https://www.youtube.com/watch?v=IOtZdysaJEA)
- 2021-07-11 : [Blender 2.9 フロー 流体シミュレーション - ほろほろりドットコム](https://horohorori.com/blender-note/physics-simulations/about-fluid-simulation-flow/)
- 2021-07-11 : [Blenderで流体シミュレーションをするときの手順と注意点](http://qcganime.web.fc2.com/BLENDER28/FluidHowToM01.html)
- 2021-07-11 : [Blenderで液体シミュレーションをするときの手順と注意点 4. 溜まり水と水しぶき](http://qcganime.web.fc2.com/BLENDER/FluidHowTo04.html)
- 2021-07-11 : [Blender 流体(液体)シミュレーションの基本的な使い方 - TomoGのごちゃまぜ倉庫](https://www.tomog-storage.com/entry/Blender-Beginner-HowToBaseOfWaterSimulation)

割と頻繁にベイクが出来なくなったり、シミュレーション結果が何も描画されなくなったりする。Blender を再起動すれば直ったりする。不安定。

### 煙・炎のシミュレーション

- 2021-10-03 : [【Blender】インクを垂らしたシミュレーションの作り方 - YouTube](https://www.youtube.com/watch?v=JUlRpHTLEug)
  - ドメインとフローを手作成する
  - 「乱流」で煙を動かせるようだが、「煙と炎」で効果が見られなかった
- 2021-10-03 : [#09 炎と煙のシミュレーション 勇者のBlender物理 - YouTube](https://www.youtube.com/watch?v=_nT_AY-eHPk)
  - クイックエフェクト → クイック煙で簡単にドメインとフローが作れる
  - レンダリング時に炎や煙を表示するには、「Shading」で「Blackbody Intensity」を 0.0 から 1.0 にする
  - > 「ブラックボディーインテンシティ」（日本語のBlenderでは「黒体の強度」）の値をクリックして数値入力で30くらいにするとそれっぽくなりましたよ  
    > 後その下の「温度」を調節すると低い値なら赤っぽく 高い値なら白っぽくなっていきます。  
    > ちなみに上から三番目の「密度」の値で煙の濃さが設定できます。  
    > 一番上のカラーで煙の色。
- 2021-10-03 : [Blender 2.9で煙と炎の物理シミュレーションを実行する - MRが楽しい](https://bluebirdofoz.hatenablog.com/entry/2020/11/24/231808)
  - 上の動画を基にしたブログ記事
- 2021-10-03 : [Blender 2.9 ドメイン 流体シミュレーション - ほろほろりドットコム](https://horohorori.com/blender-note/physics-simulations/about-fluid-simulation-domain/)
  - 流体シミュレーションの細かい設定
- 2021-10-03 : [baking - 'Bake data' button not visible in fluid options - Blender Stack Exchange](https://blender.stackexchange.com/questions/181499/bake-data-button-not-visible-in-fluid-options)
  - 「Bake Data」ボタンが出ない時は、「キャッシュ」のタイプを「リプレイ」ではなく「モジュール」などに変更する
- 2021-10-03 : [Blender 2.8 MantaFlow の使い方(気体＆流体シミュレーション) - とある紳士MMDerの3DCG関連wiki](https://shinshimmder.memo.wiki/d/Blender%202.8%20MantaFlow%20%A4%CE%BB%C8%A4%A4%CA%FD%28%B5%A4%C2%CE%A1%F5%CE%AE%C2%CE%A5%B7%A5%DF%A5%E5%A5%EC%A1%BC%A5%B7%A5%E7%A5%F3%29)
  - フローオブジェクトがレンダリングされないようにするには、フローオブジェクトに新規マテリアルを追加し、「アルファ」を 0 にし、「ブレンドモード」をアルファハッシュかアルファブレンドにする


## レンダリング時間の短縮

- 2021-10-03 : [Blender2.8 Cyclesレンダリングの速度検証【GPU+CPU使用】 |](https://your-3d.com/blender-cycles-speed/)
  - Cycles レンダリング時のタイルは 16x16 など小さいほど速いようだ
- 2021-10-03 : [Blenderのレンダリング・・・設定って大事だなぁ。](http://ganbareore.blogspot.com/2017/02/blender.html)
- 2021-10-03 : [仕組みから考えるレンダリングの高速化 Blender Cycles Rendering - Qiita](https://qiita.com/tring/items/9d6a2b5883071f4f3b5c)
- 2021-10-03 : [嘘つきCycles - Qiita](https://qiita.com/nacasora/items/f3c917f9fee69825b091)
