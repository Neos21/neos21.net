---
title        : MacOS で iOS シミュレータを起動する
created      : 2021-01-27
last-modified: 2021-01-27
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/cheat-sheets/index.html オレオレチートシート
---

```bash
# インストールされているデバイスと UUID を確認できる
$ xcrun simctl list

# 次のように UUID を指定して起動する
$ open -a Simulator --args -CurrentDeviceUDID XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```
