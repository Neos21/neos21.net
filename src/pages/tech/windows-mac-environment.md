---
title        : Windows と Mac で開発環境を揃える Tips 集
created      : 2020-11-24
last-modified: 2020-11-24
path:
  - /index.html Neo's World
  - /tech/index.html Tech
---

Windows と Mac でなるべく環境差異をなくすための手段を紹介する。


## 目次


## はじめに

自分は Windows・MacOS・Ubuntu マシンをそれぞれ所有している。これらは OS が異なるので、当然開発環境も全く同じモノにはならない。OS の差異・開発環境の差異は、その環境固有のバグを引くことにも繋がり、効率よく開発を進めていく時には避けたいものだ。

そこで今回は、Windows と Mac の環境差異をなるべく減らした開発環境を構築するための手法を紹介する。


## 環境を揃えるためのキーワード

まずは、環境を揃えていくための考え方を、キーワードとともに解説する。

### Linux に揃える

環境差異を何とかしようと思った時に、「Mac を Windows に寄せる」「Windows を Mac に寄せる」という発想では、なかなか難しいことが多い。そこで考え方を変えて、__「Windows も Mac も、Linux 環境に近付ける」__という発想で環境構築してみると、キレイに揃うだろう。

例えばシェル環境。Windows は PowerShell か Windows コマンドプロンプトという独自のシェルがある。Mac は最近は Zsh、少し前までは Bash だったが、各コマンドは BSD 系のコマンドになっている。

開発したプログラムを実際に動かす本番サーバは、大抵 Linux マシンであることが多い。となると、Windows も Mac も、それぞれの OS に寄った環境で作業していると、本番環境である Linux 環境との差異が考慮できていないことになる。であれば、最初から Linux 環境ないしはそれに近い環境で開発をしていた方が、本番環境との環境差異が少なく済み、安定したプログラムが作れるようになるのだ。

### クロスプラットフォームのアプリ・ツール

Windows 専用、Mac 専用のフリーソフトは多々あるが、それらはもう一方の OS で代替ツールを探す必要が出てくる。そうしたアプリは大抵、その OS 固有の特徴に準じて作られているため、なかなか代替ツールが見つからなかったりする。

そこで、GUI アプリ、CLI ツールのいずれの場合も、_クロスプラットフォーム_で提供されているソフトを優先的に選定すると良いだろう。そうすると、OS ごとの環境差異はショートカットキーの違いくらいに留められるので、OS の違いによって開発体験が大きく変わることは避けられるようになる。

### Node.js・JavaScript (クロスプラットフォームなランタイム言語)

多くのプログラミング言語は OS に依存しないモノが多い。だが、例えば C# は Windows、Swift は Mac フレンドリーなところもあったりする。

そんな中で、一番クロスプラットフォームに対応できる言語は何かというと、自分は _JavaScript_ だと考えている。つまり、Chrome や Firefox などのブラウザがクロスプラットフォームで提供されており、ランタイム (実行環境) であるブラウザが OS の差異を吸収する緩衝層になっているので、一度書いたコードがどの OS でも動くのだ。

JavaScript をブラウザ外で動かすためのランタイムとなる Node.js も、クロスプラットフォームで動作し、OS の差異による影響をほとんど受けない。使用するパッケージにもよるが、ビルドすればブラウザ上でも動作する JavaScript コードになりうるので、本当に実行環境を選ばない言語だと思っている。

メインで使用する言語は別にあったとしても、ちょっとしたツールを作ったりする時に、Node.js や JavaScript という選択肢を持っていれば、OS の差異をほとんど木にすることなくツールやアプリが作れるだろう。


## Windows を Linux に近付ける方法

Windows を Linux に近付ける方法は、大きく分けて2つある。

### WSL を使う

最近主流で、あまりトラブルの少ないやり方は、WSL を使うというモノ。Windows 10 Home でも WSL2 が安定動作するようになり、Docker の対応状況も問題ないのでオススメだ。

WSL を使えば、Windows マシンに Ubuntu 環境をほとんど同居させられる。必要なアプリは `apt-get` 等でインストールできるので、Ubuntu 向けの設定をしていけば良いことになる。Vim・Tmux も扱いやすく、クリップボード共有には `clip.exe` や `xsel` を使えば対応できる。GUI 環境を用意するにはまだ難しいところもあるが、VcXsrv で X Window System に接続することも可能ではある。

### GitBash・Git SDK を使う

WSL が安定するまでは、Cygwin や MSYS、これを用いた Git For Windows (GitBash) による擬似 Linux 環境がよく用いられた。最近も、Puppeteer のようなブラウザを操作するようなライブラリとの相性問題が WSL では解決しきれないため、活躍の場は多い。

自分は GitBash の上位互換版である __[Git SDK](https://github.com/git-for-windows/build-extra/releases)__ (Git For Windows SDK) を用いている。コレには通常の GitBash に搭載されていないパッケージマネージャの Pacman が搭載されているため、後から Tmux 等をインストールしやすいのだ。

Git SDK 搭載の Vim や、Pacman でインストールできる Tmux であれば、クリップボード共有もちょっとした設定で実現できる。Windows Terminal での利用も問題ない。生の Linux 環境に近い WSL と比べると、Windows 上で動いているのでプロセス生成が遅く若干もっさりするが、WSL が使えない場合の代用として使う程度であれば気にならないだろう。コレまではこの方法しかなかったので、コレを辛抱強く使ってきたのだ…。


## Mac を Linux に近付ける方法

Mac は BSD 系の OS なので、どちらかというと Windows よりは Linux 環境に近付けやすい。各種コマンドが BSD 系でオプションに違いがあるので、次のような GNU 系のコマンド群を Homebrew で入れておくと良いだろう。

```sh
$ brew install \
  coreutils binutils moreutils diffutils findutils \
  gnu-sed gnu-tar gnu-which gnu-time gnu-getopt gawk gnutls \
  grep gzip wget
```

コレで各種コマンドが Linux 環境に近いモノになるので、Mac だけコマンドの仕様が違ってつまづく、といった事態が減らせる。


## OS 固有のソフト・対応一覧

Windows のみ、Mac のみに対応しているソフトで、どうしても外せないモノを紹介する。なかなか良いクロスプラットフォームアプリがなく、仕方なく OS 固有のアプリを選んでいるモノたちだ。しかし、それぞれの OS で相当するソフトがあるので、それらを対応付けて紹介する。

見出しのソフト名は、Windows 用・Mac 用の順で記している。

### メモ帳：NotePad++・CotEditor

サッと何か文章を書きたい時に使う、シンプルなメモ帳。自分は以下を使っている。

| OS      | ソフト名 |
|---------|----------|
| Windows | [NotePad++](https://notepad-plus-plus.org/) |
| Mac     | [CotEditor](https://coteditor.com/) |

いずれもシンタックスハイライト、フォント指定、テーマ設定、エンコーディング指定などひととおりの機能が揃っているので、さほど使い勝手が変わるようなことはないだろう。

ちなみに Ubuntu Linux では Gedit を使っている。コレも同等の機能を有していて困ることはない。

Windows では[メモ帳++](http://hp.vector.co.jp/authors/VA017405/soft.html)、[ez-HTML](http://www.w-frontier.com/software/ezhtml.html)、Sakura エディタなども使ったことがあるが、NotePad++ が一番色々できてかつ軽量・高速だと感じている。コレは普通にダウンロード・インストールしても良いが、自分は Chocolatey からインストールしている。

CotEditor は Mac App Store からインストール可能。

### FTP クライアント：FFFTP・FileZilla

FileZilla は Windows・Linux 用も提供されているので、全ての OS で FileZilla を使用しても良いのだが、FFFTP は馴染みが深いので、ついつい…。ちなみに元々自分は「ホームページビルダー」に付属の「FTP ツール」から使い始めました…。

| OS      | ソフト名 |
|---------|----------|
| Windows | [FFFTP](https://github.com/ffftp/ffftp) |
| Mac     | [FileZilla](https://filezilla-project.org/download.php?show_all=1) |

ちなみに Mac App Store 内にも FileZilla があるが、コチラは有料版なので注意。無料版は FileZilla の公式サイトからダウンロードする。

### ターミナル：Windows Terminal・ターミナル.app

ターミナルソフトは、最近ようやく OS 公式のソフトが定まったと思う。

| OS      | ソフト名 |
|---------|----------|
| Windows | Windows Terminal |
| Mac     | ターミナル.app   |

Mac は最初から搭載されている「ターミナル.app」で十分。iTerm なども存在するが自分は使っていない。

Windows は、長らく GitBash (Msys ベース) を使ってきたが、MS 謹製の Windows Terminal が安定してきたので、コレを Microsoft Store からインストールすれば良さげだ。

自分はターミナルソフト自体には凝りすぎないようにしていて、Ubuntu でも標準の「端末」アプリで済ませている。


## クロスプラットフォームアプリ

ココからは、Windows と Mac とで同じアプリをインストールすれば良いモノを紹介する。

### ブラウザ：Chrome・Firefox・Edge

Chrome・Firefox・Chromium Edge ブラウザはクロスプラットフォームで利用できる。それぞれアカウントを用意すれば複数デバイスで設定を同期できるので、とても助かる。

自分はこの他に [Brave ブラウザ](https://brave.com/ja/)を使っているが、コチラも Chromium ベースなので、クロスプラットフォーム。

OS 固有なブラウザというと、Windows ではサポートが切れかかっている IE と Legacy Edge、Mac では Safari ブラウザぐらい。Mac Safari は iOS Safari と同様の路線なので、なかなか無視しづらいのが難点…。Safari さえ除けば、基本的には Chrome にさえ対応すれば良い時代になったので、とても楽になった…。

### エディタ：VSCode

開発エディタ・IDE は [VSCode](https://code.visualstudio.com/) 一択。一時期は Atom や Sublime Text なども人気だったが、MS がバックについている強みは凄い。統合ターミナルがどのエディタよりも軽量・高速に動作するし、多数の拡張機能がサクッと使える。Docker や WSL、SSH 接続先のサーバとの統合も簡単に行える。Linux 版もあるので、VSCode を選ばない手はないだろう。

ターミナルなどは OS ごとに異なる設定を保持できる。設定は「Settings Sync」拡張機能で同期するようにしておけば、どの OS でも同じ設定・拡張機能を持ち込める。

### オフィススイート：Microsoft Office

オフィススイートは最近、色々と互換性があるのでどれを選んでも問題ない。自分は MS Office (Word・Excel・PowerPoint) を Mac にも入れている。やはり Windows 版 Office でキーボードショートカットを多用しての文書作成が捗りまくるので、キーボードショートカットがほとんど使えない Mac 版の不便を選んでも、MS Office を選んでしまう。

以下も時と場合に応じて利用している。

- Google Workspace (ドキュメント・スプレッドシート・プレゼンテーション)
  - Google アカウント上で同期管理するのがメインな資料
- [LibreOffice](https://ja.libreoffice.org/)
  - Ubuntu 標準搭載。Ubuntu でとりあえず閲覧する時に
- iWork (Pages・Numbers・Keynote)
  - Mac App Store からすぐ入れられる。MS Office をインストールしていないま死んでとりあえず閲覧する時に

### 画像・動画編集：Adobe CC

- Adobe Photoshop
- Adobe Lightroom
- Adobe Lightroom Classic
- Adobe Illustrator
- Adobe Premiere Pro
- Adobe After Effects
- Adobe Audition
- Adobe XD

このあたりの Adobe CC 製品は Win・Mac 両方に入れている。特に Photoshop と Premiere Pro は必須。

### 日本語入力システム (IME)：Google 日本語入力

自分は「MS-IME」や「ことえり」は使っていない。[Google 日本語入力](https://www.google.co.jp/ime/) が一番使いやすい。

Mac は「英数」「かな」キーで IME のオン・オフができ、コレばかりは便利すぎて、他の OS でも再現したくなるほどだ。

Windows の場合は [AutoHotKey](https://sites.google.com/site/autohotkeyjp/) をインストールし、[alt-ime-ahk](https://github.com/karakaram/alt-ime-ahk) を導入することで、Alt キーの空打ちで IME の ON・OFF が切り替えられるようになる。

ちなみに Ubuntu の場合は Google 日本語入力のオープンソース版である Mozc を用いると同じ感覚で変換できる。Alt キーの空打ちによる IME 切り替えは Fcitx で実現できる。

### フォント：Noto Sans Mono CJK JP

Windows と Mac には游ゴシックフォントが標準搭載されているが、搭載されているウェイトに違いがあったりして、厳密には同じように表示できなかったりする。

そこで、Google が提供するオープンソースのフォント、Noto CJK JP シリーズを入れておくと良いだろう。

- [Noto Sans CJK JP](https://www.google.com/get/noto/#sans-jpan)
  - サンセリフ体 (ゴシック体)
  - 等幅フォントの _Noto Sans Mono CJK JP_ も同梱
- [Noto Serif CJK JP](https://www.google.com/get/noto/#serif-jpan)
  - セリフ体 (明朝体)

特に、Noto Sans CJK JP に同梱されている等幅フォントの _Noto Sans Mono CJK JP_ は、日本語にも対応しているので、VSCode などのエディタで使用するにももってこいだ。実際、Ubuntu のデフォルトフォントとして Noto Sans 系が使用されていたりする。

Noto Sans をブラウザのデフォルトフォントに設定しておけば、どの環境でも同じように見える。


## Docker を使って開発する

最近ようやく WSL 向けの Docker も安定してきたので、Mac でも Windows でも、Docker を使った開発が同じように行える。

Docker を使えば、プログラミング言語やランタイムをホストマシンにインストールする必要もなく、Docker イメージを取得してくるだけで済む。ホストマシンを汚さないだけでなく、開発時点から Linux 環境に入り込んで作業できるので、ホスト OS の影響を受けにくくなる。

VSCode は Docker コンテナ内にアタッチできる拡張機能もあったりするので、より開発がしやすい。Docker と VSCode を最初から使った開発環境を整えておくと良いだろう。


## OS の差異を吸収する dotfiles 設定

ターミナル環境を整えていくためには、`.bashrc` などの dotfiles を自分なりに構築していくことになるだろう。ココでは OS 間の差異を吸収する dotfiles の設定を紹介する。

### `.bashrc`

`.bashrc` で OS の差異を吸収するには、`uname` の結果を見て OS を判別すると良いだろう。

```bash
if [ "$(uname)" == 'Darwin' ]; then
  echo 'MacOS のみに適用したいエイリアス等をココに書く'
elif [ "$(uname)" == 'Linux' ]; then
  echo 'Linux 環境で適用したいエイリアス等をココに書く'
  
  if [[ "$(uname -r)" == *microsoft* ]]; then
    echo 'WSL 環境のみに適用したいエイリアス等をココに書く'
  fi
else
  echo 'Windows (Git SDK) 環境の場合'
fi
```

こんな感じで判定できる。

自分は `open`・`start` コマンドを OS ごとに調整したり、クリップボードのコピー・ペーストを行うコマンドを OS 別に用意したりしている。

### `.vimrc`

Vim の設定ファイルである `.vimrc` でも OS 判定ができる。クリップボード共有を有効にするために必要になるだろう。

```
" クリップボード連携を有効にする (Windows・MacOS の場合は unnamedplus ではなく unnamed を使用・vi ではなく vim を使う)
if has("mac")
  "echo 'mac'
  set clipboard&
  set clipboard^=unnamed
elseif has("unix")
  "echo 'unix'
  set clipboard=unnamedplus
else
  "echo 'win'
  set clipboard&
  set clipboard^=unnamed
endif
```

### `.tmux.conf`

Tmux もクリップボード共有に一工夫が必要なので、OS 判定の術を覚えておくと良いだろう。`if` 命令の中で `command` コマンドを使い、指定のコマンドが存在するかどうかをチェックできる。

Mac の場合は、Homebrew でインストールできる `reattach-to-user-namespace` というツールを使ってクリップボードを利用する。一方 Windows (Git SDK など) の場合は `clip.exe` を使ってクリップボード共有を行う。

```
# コピーモード中 y か Enter でヤンク (コピー) できるようにする

# MacOS : reattach-to-user-namespace を使用してクリップボード共有を有効にする
if -b 'command -v reattach-to-user-namespace > /dev/null 2>&1'  'set-option -g default-command "reattach-to-user-namespace -l bash"'
if -b 'command -v reattach-to-user-namespace > /dev/null 2>&1'  'bind-key -T copy-mode-vi y     send-keys -X copy-pipe-and-cancel "reattach-to-user-namespace pbcopy" \; display "Copied!"'
if -b 'command -v reattach-to-user-namespace > /dev/null 2>&1'  'bind-key -T copy-mode-vi Enter send-keys -X copy-pipe-and-cancel "reattach-to-user-namespace pbcopy" \; display "Copied!"'

# Windows : tmux save-buffer で echo しパイプを使って clip.exe に渡す
if -b 'command -v clip.exe > /dev/null 2>&1'  'bind-key -T copy-mode-vi y     send-keys -X copy-pipe-and-cancel "tmux save-buffer - | clip.exe" \; display "Copied!"'
if -b 'command -v clip.exe > /dev/null 2>&1'  'bind-key -T copy-mode-vi Enter send-keys -X copy-pipe-and-cancel "tmux save-buffer - | clip.exe" \; display "Copied!"'
```


## 最後に：各 OS の良いところはそれぞれそのまま使う

コレまで、OS の差異を減らすための Tips を紹介してきたが、__無理に合わせすぎないこと__も大事にして欲しい。それぞれの OS にはそれぞれの設計思想があるので、それを捻じ曲げるようなカスタマイズは、標準から逸脱してかえって使いづらくなってしまう。

例えば、Mac 環境を Windows のキーボードショートカットに近付けたいからといって、Cmd キーと Control キーの位置を入れ替えたりしても、ソフト側が提供するキーボードショートカットが厳密には違うので、なかなか全く同じようにはいかない。そうではなく、「Cmd キーは親指で押すモノ」という設計思想である Mac は、その設計思想に則ってそのまま使い、「Ctrl キーを多用する Windows」は Windows で、そのまま受け入れるのだ。

OS ごとに異なる操作や考慮が必要になるが、それは Windows と Mac に限った話ではない。スマホでいえば Android と iOS で操作が異なるし、ブラウザだって Chrome と Firefox で微妙に機能や挙動が違ったりする。でもそうした挙動の違いは、ある程度は受け入れ、無理のない範囲で平仄を合わせていく方が、変化に強い開発環境になるだろう。
