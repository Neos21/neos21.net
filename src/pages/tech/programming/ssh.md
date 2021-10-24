---
title        : SSH
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

SSH とか OpenSSL とかその辺の話。`ssh-keygen` とか `openssl` とかコマンド複雑すぎて分からんねん。作り方、どんなファイルが出てくるか、中身の確認方法、ペアとなるファイルの同一性確認方法などをまとめる。


## 目次


## SSH 鍵ペアの作り方と中身の見方

OpenSSH 形式の鍵ペア。SSH 接続時に使用する。`ssh-keygen` コマンドを使用する。

### 生成方法

```bash
# 秘密鍵と公開鍵をセットで作成する
$ ssh-keygen -t rsa -b 4096 -N '【パスフレーズ】' -C '【コメント】' -f "${HOME}/.ssh/id_rsa"

Generating public/private rsa key pair.
Your identification has been saved in /Users/Example/.ssh/id_rsa.
Your public key has been saved in /Users/Example/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 【コメント】
The key's randomart image is:
+---[RSA 4096]----+
|          .      |
|       o o       |
|    . . = o      |
|     + + B  .    |
|    o . S+.. +o  |
|     ..+o E.++.+ |
|      .++..ooo+..|
|       .+*+ o+o  |
|         +OXo..  |
+----[SHA256]-----+

# 秘密鍵ファイルから公開鍵ファイルを作るには `-y` オプションを使う
$ ssh-keygen -yf "${HOME}/.ssh/id_rsa"
ssh-rsa ……中略……
# コメントは付いていないことに留意
# `> "${HOME}/.ssh/id_rsa.pub` などとリダイレクトすればファイルに保存できる
```

- `-b 4096` と指定したとおり、4096 bit で作成した
- `-N ''` とすると、パスフレーズなしの秘密鍵ファイルが生成できる
- `-f` でファイルの出力先を指定。`${HOME}/.ssh/id_rsa` (秘密鍵) と `${HOME}/.ssh/id_rsa.pub` (公開鍵) の2ファイルが生成される
- 各オプションを記述しないと、対話式プロンプトの中で入力していくことになる

### ファイルの内容 (サンプル)

#### `id_rsa` (秘密鍵)

```
-----BEGIN OPENSSH PRIVATE KEY-----
……中略……
-----END OPENSSH PRIVATE KEY-----
```

#### `id_rsa.pub` (公開鍵)

```bash
ssh-rsa ……中略…… 【コメント】
```

### 内容確認

```bash
# 秘密鍵からフィンガープリントを確認する
$ ssh-keygen -l -f "${HOME}/.ssh/id_rsa"
4096 SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 【コメント】 (RSA)

# 公開鍵からフィンガープリントを確認する
$ ssh-keygen -l -f "${HOME}/.ssh/id_rsa.pub"
4096 SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 【コメント】 (RSA)
```

- オプションは `-l -f` と書いても `-lf` と書いても良い

Hash Visualization を見るには `-v` オプションを付ける。

```bash
# 秘密鍵から Hash Visualization を見る
$ ssh-keygen -vlf "${HOME}/.ssh/id_rsa"
+---[RSA 4096]----+
|          .      |
|       o o       |
|    . . = o      |
|     + + B  .    |
|    o . S+.. +o  |
|     ..+o E.++.+ |
|      .++..ooo+..|
|       .+*+ o+o  |
|         +OXo..  |
+----[SHA256]-----+

# 公開鍵から Hash Visualization を見る
$ ssh-keygen -vlf "${HOME}/.ssh/id_rsa.pub"
+---[RSA 4096]----+
|          .      |
|       o o       |
|    . . = o      |
|     + + B  .    |
|    o . S+.. +o  |
|     ..+o E.++.+ |
|      .++..ooo+..|
|       .+*+ o+o  |
|         +OXo..  |
+----[SHA256]-----+
```

### 参考文献

- [ssh鍵の鍵指紋を表示 - Qiita](https://qiita.com/matoken/items/c5f2cda7466ab7a2fae6)
- [秘密鍵から公開鍵作る - Qiita](https://qiita.com/koudaiii/items/45f9f5929afb0039ffdb)


## サーバ証明書

サーバ証明書は `openssl` コマンドで作成・確認できる。証明書発行要求 (CSR) ファイルというモノを経由するので若干分かりにくい。

### 生成方法

以下では自己署名証明書、いわゆるオレオレ証明書の作り方を説明する。正規のサーバ証明書を受け取った際に、各ファイルの組合せを理解できるようになるだろう。

```bash
# 秘密鍵を作成する
$ openssl genrsa -aes256 -out ./ca-key.pem 2048
Generating RSA private key, 2048 bit long modulus
....................................................................+++
......+++
e is 65537 (0x10001)
Enter pass phrase for ./ca-key.pem:  # パスフレーズを入力する
Verifying - Enter pass phrase for ./ca-key.pem:  # 再度パスフレーズを入力する

# 証明書発行要求 CSR ファイルを作成する
$ openssl req -new -key ./ca-key.pem -out ./ca-cert.csr
Enter pass phrase for ./ca-key.pem:  # 秘密鍵のパスフレーズを入力する
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:JP  # 「JP」と入力する
State or Province Name (full name) []:Tokyo  # 適当に「Tokyo」などと入力する
Locality Name (eg, city) []:Ikebukuro  # 適当に入力する
Organization Name (eg, company) []:Neo's World  # 適当に入力する
Organizational Unit Name (eg, section) []:Section  # 適当に入力する
Common Name (eg, fully qualified host name) []:example.com  # ドメイン名などを入力する
Email Address []:  # 未入力のまま進める

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:  # 未入力のまま進める

# サーバ証明書 (自己署名証明書) を作成する
$ openssl x509 -days 825 -in ./ca-cert.csr -req -signkey ./ca-key.pem -out ./ca-cert.pem
Signature ok
subject=/C=JP/ST=Tokyo/L=Ikebukuro/O=Neo's World/OU=Section/CN=example.com
Getting Private key
Enter pass phrase for ./ca-key.pem:  # 自己署名認証局の秘密鍵のパスフレーズを入力する
```

### ファイルの内容 (サンプル)

#### `ca-key.pem` (自己署名認証局の秘密鍵)

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

……中略……
-----END RSA PRIVATE KEY-----
```

#### `ca-cert.csr` (証明書発行要求 CSR)

```
-----BEGIN CERTIFICATE REQUEST-----
……中略……
-----END CERTIFICATE REQUEST-----
```

#### `ca-cert.pem` (サーバ証明書)

```
-----BEGIN CERTIFICATE-----
……中略……
-----END CERTIFICATE-----
```

### 内容確認

```bash
# 秘密鍵の内容を確認する
$ openssl rsa -text -noout -in ./ca-key.pem 
Enter pass phrase for ./ca-key.pem:  # パスフレーズを入力する
Private-Key: (2048 bit)
modulus:
    xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:
    ……中略……
    xx:xx
publicExponent: 65537 (0x10001)
privateExponent:
    ……中略……
prime1:
    ……中略……
prime2:
    ……中略……
exponent1:
    ……中略……
exponent2:
    ……中略……
coefficient:
    ……中略……

# 秘密鍵のフィンガープリントを確認する
$ openssl rsa -pubout -outform DER -in ./ca-key.pem | openssl md5 -c
Enter pass phrase for ./ca-key.pem:  # パスフレーズを入力する
writing RSA key
xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx

# 証明書発行要求 (CSR) の内容を確認する
$ openssl req -text -noout -in ./ca-cert.csr 
Certificate Request:
    Data:
        Version: 0 (0x0)
        Subject: C=JP, ST=Tokyo, L=Ikebukuro, O=Neo's World, OU=Section, CN=example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    ……中略……
                Exponent: 65537 (0x10001)
        Attributes:
            a0:00
    Signature Algorithm: sha256WithRSAEncryption
         ……中略……

# 証明書発行要求 (CSR) の公開鍵を表示する (サーバ証明書の公開鍵と一致する)
$ openssl req -pubkey -noout -in ./ca-cert.csr
-----BEGIN PUBLIC KEY-----
……中略……
-----END PUBLIC KEY-----

# 証明書発行要求 (CSR) のフィンガープリントを表示する (サーバ証明書のフィンガープリントと一致する)
$ openssl req -pubkey -noout -in ./ca-cert.csr | openssl md5 -c
xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx

# サーバ証明書の内容を確認する
$ openssl x509 -text -fingerprint -noout -in ca-cert.pem 
Certificate:
    Data:
        Version: 1 (0x0)
        Serial Number: 00000000000000000000 (0xffffffffffffffff)
    Signature Algorithm: sha1WithRSAEncryption
        Issuer: C=JP, ST=Tokyo, L=Ikebukuro, O=Neo's World, OU=Section, CN=example.com
        Validity
            Not Before: Jan 25 00:00:00 2021 GMT
            Not After : Jan 23 00:00:00 2031 GMT
        Subject: C=JP, ST=Tokyo, L=Ikebukuro, O=Neo's World, OU=Section, CN=example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    ……中略……
                Exponent: 65537 (0x10001)
    Signature Algorithm: sha1WithRSAEncryption
         ……中略……
SHA1 Fingerprint=xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx

# サーバ証明書の公開鍵を表示する (証明書発行要求 (CSR) の公開鍵と一致する)
$ openssl x509 -pubkey -noout -in ./ca-cert.pem 
-----BEGIN PUBLIC KEY-----
……中略……
-----END PUBLIC KEY-----

# サーバ証明書のフィンガープリントを表示する (証明書発行要求 (CSR) のフィンガープリントと一致する)
$ openssl x509 -pubkey -noout -in ./ca-cert.pem | openssl md5 -c
```

### 参考文献

- [オレだよオレオレ認証局で証明書つくる - Qiita](https://qiita.com/ll_kuma_ll/items/13c962a6a74874af39c6)
- [opensslコマンドで証明書情報を確認したい | サポート・お申し込みガイド | GMOグローバルサイン【公式】](https://jp.globalsign.com/support/faq/07.html)


## RSA 鍵ペア

クラウドサービスで API キーとして用いるような鍵ペア。`openssl` コマンドで作成・確認できる。

### 生成方法

```bash
# 秘密鍵を作成する
$ openssl genrsa -out ./rsa.key 4096
Generating RSA private key, 4096 bit long modulus
.....++
...........................................................................................................................................................................++
e is 65537 (0x10001)

# 秘密鍵から公開鍵を作成する
$ openssl rsa -pubout -in ./rsa.key -out ./rsa-public.pem
writing RSA key
```

### ファイルの内容 (サンプル)

#### `rsa.key` (秘密鍵)

```
-----BEGIN RSA PRIVATE KEY-----
……中略……
-----END RSA PRIVATE KEY-----
```

#### `rsa-public.pem` (公開鍵)

```
-----BEGIN PUBLIC KEY-----
……中略……
-----END PUBLIC KEY-----
```

### 内容確認

```bash
# 秘密鍵ファイルから公開鍵のフィンガープリントを確認する
$ openssl rsa -pubout -outform DER -in ./rsa.key | openssl md5 -c
writing RSA key
xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx

# 公開鍵ファイルからフィンガープリントを確認する
$ openssl rsa -pubin -outform DER -in ./rsa-public.pem | openssl md5 -c
writing RSA key
xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx
```

### 参考文献

- [OpenSSL - User - cannot read PEM key file - no start line](http://openssl.6102.n7.nabble.com/cannot-read-PEM-key-file-no-start-line-td53438.html)
