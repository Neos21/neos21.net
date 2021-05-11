---
title        : 自分が使ったことのある Homebrew アプリ一覧
created      : 2021-05-11
last-modified: 2021-05-11
path:
  - /index.html Neo's World
  - /tech/index.html Tech
---

自分が MacOS 環境に `brew install` コマンドを明示的に入力してインストールし、使用したことがある Homebrew アプリの一覧を紹介する。依存パッケージとして勝手にインストールされ、`brew list` で確認していても自分が意識していないアプリについては記載しない。そのままインストールできるようにコマンド形式で記載する。


## 目次


## ジョーク系

```bash
$ brew install asciiquarium
$ brew install cowsay
$ brew install cmatrix
$ brew install figlet
$ brew install fortune
$ brew install lolcat
$ brew install nyancat
$ brew install ponysay
$ brew install sl
$ brew install toilet
```


## システム関連

```bash
$ brew install archey
$ brew install neofetch
$ brew install pstree
$ brew install screenfetch
```


## ターミナル環境全般

```bash
$ brew install bash-completion
$ brew install reattach-to-user-namespace  # For Clipboard In Tmux
$ brew install tmux
$ brew install vim
```


## コマンド

### Utils 系

```bash
$ brew install binutils
$ brew install coreutils
$ brew install dateutils
$ brew install diffutils
$ brew install findutils
$ brew install moreutils
```

### GNU 関連コマンド

```bash
$ brew install gawk
$ brew install gnu-getopt
$ brew install gnu-sed
$ brew install gnu-tar
$ brew install gnu-time
$ brew install gnu-which
$ brew install gnupg
$ brew install gnutls
$ brew install grep
$ brew install gzip
```

### 標準コマンドの改善版

```bash
$ brew install bat  # cat
$ brew install ccat  # cat
$ brew install colordiff  # diff
$ brew install exa  # ls
$ brew install htop  # top
$ brew install ripgrep  # grep
$ brew install ydiff  # diff
```

### コマンドヘルプ

```bash
$ brew install eg-examples
$ brew install thefuck
$ brew install tldr
```


## ファイル・エクスプローラ

```bash
$ brew install midnight-commander
$ brew install tree
```


## ネットワーク

```bash
$ brew install iproute2mac
$ brew install nmap
$ brew install openssh
$ brew install sshrc
$ brew install telnet
$ brew install wakeonlan
$ brew install w3m
$ brew install wget
$ brew install wifi-password
```


## 各種ユーティリティ

```bash
$ brew install jq
$ brew install pwgen
$ brew install rig  # ダミープロフィール
$ brew install watch
$ brew install yq
```


## アプリ・ツール別

### Git・GitHub

```bash
$ brew install ghi
$ brew install git
$ brew install tig
```

### Docker

```bash
$ brew install dive
$ brew tap knqyf263/trivy && brew install knqyf263/trivy/trivy
```

### Kubernetes

```bash
$ brew install kubectx
$ brew install kubernetes-cli
$ brew install kubeseal
$ brew tap derailed/k9s && brew install k9s
$ brew tap dtan4/dtan4 && brew install k8stail
```

### Terraform

```bash
$ brew install terraform
$ brew install tfenv
```


## データベース

```bash
$ brew install mysql
$ brew install postgresql
```


## テキスト関連

```bash
$ brew install mecab
$ brew install mecab-ipadic
$ brew install nkf
```


## オーディオ・音声関連

```bash
$ brew install espeak
$ brew install open-jtalk
```


## 画像・イラスト関連

```bash
$ brew install graphviz
$ brew install imagemagick
```


## プログラミング言語

```bash
$ brew install go
$ brew install gradle
$ brew install python
$ brew install rbenv
$ brew install ruby-build
$ brew install shellcheck
```


## プログラミング・開発・テスト

```bash
$ brew install cloc
$ brew install locust
```


## ウェブサービスと連動するモノ

```bash
$ brew install certbot  # Let's Encrypt
$ brew install ngrok
```


## Homebrew Cask

### ジョーク系

```bash
$ brew cask install cool-retro-term
```

### 各種ユーティリティ

```bash
$ brew cask install finicky
$ brew cask install mounty
$ brew cask install rectangle
```

### プログラミング言語

```bash
$ brew cask install java
$ brew cask install powershell
```


<div class="ad-amazon">
  <div class="ad-amazon-image">
    <a href="https://www.amazon.co.jp/dp/B087QK53C7?tag=neos21-22&amp;linkCode=osi&amp;th=1&amp;psc=1">
      <img src="https://m.media-amazon.com/images/I/51DqDUiERJL._SL160_.jpg" width="113" height="160">
    </a>
  </div>
  <div class="ad-amazon-info">
    <div class="ad-amazon-title">
      <a href="https://www.amazon.co.jp/dp/B087QK53C7?tag=neos21-22&amp;linkCode=osi&amp;th=1&amp;psc=1">［新版 zsh&amp;bash対応］macOS×コマンド入門 ──ターミナルとコマンドライン、基本の力 WEB+DB PRESS plus</a>
    </div>
  </div>
</div>


## 参考文献

- [Top homebrew packages](https://gist.github.com/pmkay/e09034971b6f23214fd9f95a3e6d1c44)
