---
title        : Unix Like Commands For Windows
created      : 2020-11-21
last-modified: 2020-11-21
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
head: |
  <style>
    .table-wrapper table {
      min-width: 100%;
      white-space: nowrap;
    }
    
    .table-wrapper td:not(:first-child) {
      min-width: 15rem;
      color: #000;
      font-size: .86rem;
    }
    
    .ok   { background: #f6ffff; }
    .warn { background: #fffff6; }
    .ng   { background: #fff6f6; }
    .none { background: #f0f0f0; }
    
    .mark {
      font-size: 1rem;
      text-align: center;
    }
  </style>
---

Bash コマンド名と、それを Windows で再現する方法をまとめた一覧表。完全な空欄セルは調査未済な部分です。

Windows コマンドプロンプトと、Windows GitBash までをベース環境とし、それ以外の統合環境 (Cygwin や MSYS・MinGW など) は、依存するモノを減らすためなるべく利用しないようにします。

<div class="table-wrapper monospace">
  <table>
    <thead>
      <tr>
        <th rowspan="2" title="Windows 環境で再現したい、元とするコマンド。">コマンド</th>
        <th colspan="2" title="Windows コマンドプロンプトで再現する方法。">コマンドプロンプト</th>
        <th colspan="2" title="GitBash 上で再現する方法。">GitBash</th>
      </tr>
      <tr>
        <th title="Windows コマンドプロンプトでの再現度を「○△×」で示し、同等のことが実現できる場合はそのコマンドを記載。">標準</th>
        <th title="Windows コマンドプロンプト標準で実現できない場合、代替案を記載。">代替手法</th>
        <th title="GitBash での再現度を「○△×」で示し、同等のことが実現できる場合はそのコマンドを記載。">標準</th>
        <th title="GitBash 標準で実現できない場合、代替案を記載。">代替手法</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>alias</td>
        <td class="ok">
          <div class="mark">○</div>doskey
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>apropos</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>awk</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div><a href="http://gnuwin32.sourceforge.net/packages/gawk.htm">Gawk for Windows</a><br><a href="https://www.vector.co.jp/soft/win95/util/se376460.html">gawk 3.1.5 for Windows</a>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>cal</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>cat</td>
        <td class="ok">
          <div class="mark">○</div>type
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>cd</td>
        <td class="ok">
          <div class="mark">○</div>cd
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>chgrp</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>chmod</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>chown</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>chroot</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>clear</td>
        <td class="ok">
          <div class="mark">○</div>cls
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>cp</td>
        <td class="ok">
          <div class="mark">○</div>copy
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>date</td>
        <td class="ok">
          <div class="mark">○</div>date
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>df</td>
        <td class="ok">
          <div class="mark">○</div>fsutil volume diskfree 【ドライブ名】
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>diff</td>
        <td class="ok">
          <div class="mark">○</div>fc
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>diff3</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>echo</td>
        <td class="ok">
          <div class="mark">○</div>echo
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>expr</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>file</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>find</td>
        <td class="ok">
          <div class="mark">○</div>dir /b /s
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>grep</td>
        <td class="warn">
          <div class="mark">△</div>findstr
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>gzip</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>halt</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>head</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>history</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>kill</td>
        <td class="ok">
          <div class="mark">○</div>taskkill
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>less</td>
        <td class="ok">
          <div class="mark">○</div>more
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>ln</td>
        <td class="warn">
          <div class="mark">△</div>mklink
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>ls</td>
        <td class="ok">
          <div class="mark">○</div>dir
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>man</td>
        <td class="warn">
          <div class="mark">△</div>【コマンド】 /?
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="warn">
          <div class="mark">△</div><a href="https://gist.github.com/lkptrzk/3657247">man.sh</a> (<a href="/blog/2016/07/20-02.html" title="要 wget、HTML がそのままパースされる不備アリ">※</a>)
        </td>
      </tr>
      <tr>
        <td>mkdir</td>
        <td class="ok">
          <div class="mark">○</div>md<br>mkdir
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>more</td>
        <td></td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>mv</td>
        <td class="ok">
          <div class="mark">○</div>move
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>ping</td>
        <td class="ok">
          <div class="mark">○</div>ping
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>pwd</td>
        <td class="ok">
          <div class="mark">○</div>cd<br>chdir
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>reset</td>
        <td class="ok">
          <div class="mark">○</div>cls
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>rm</td>
        <td class="ok">
          <div class="mark">○</div>del<br>erase<br>rd /s<br>rmdir /s
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>rmdir</td>
        <td class="ok">
          <div class="mark">○</div>del<br>erase<br>rd /s<br>rmdir /s
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>sed</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div><a href="http://gnuwin32.sourceforge.net/packages/sed.htm">sed for Windows</a> (<a href="http://ac206223.ppp.asahi-net.or.jp/adiary/memo/adiary.cgi/hirosugu/GNU%20sed%20%E3%82%92Windows%E3%81%A7%E4%BD%BF%E3%81%86" title="必要なライブラリを同梱したモノを再配布している">※</a>)
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>sleep</td>
        <td class="ok">
          <div class="mark">○</div>timeout
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>sort</td>
        <td class="ok">
          <div class="mark">○</div>sort
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>tail</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>(拙作) TailF.bat
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>tee</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div><a href="https://www.vector.co.jp/soft/winnt/util/se426028.html">Tee.CMD</a>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>touch</td>
        <td class="ok">
          <div class="mark">○</div>type nul > 【ファイル名】<br>copy 【ファイル名】 +
        </td>
        <td class="ok">
          <div class="mark">○</div>(拙作) Touch.bat
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>tr</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>vi</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div><a href="https://www.kaoriya.net/software/vim/">KaoriYa Vim</a>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>wc</td>
        <td class="ok">
          <div class="mark">○</div>find /c /v "" (<a href="/blog/2016/07/19-01.html" title="詳細">※</a>)
        </td>
        <td></td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>wget</td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td></td>
        <td class="ng">
          <div class="mark">×</div>
        </td>
        <td class="ok">
          <div class="mark">○</div><a href="https://sourceforge.net/projects/mingw/files/Other/mingwPORT/Current%20Releases/wget-1.9.1-mingwPORT.tar.bz2/download">MinGW wget 1.9.1</a>
        </td>
      </tr>
      <tr>
        <td>which</td>
        <td class="ok">
          <div class="mark">○</div>where
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
      <tr>
        <td>who</td>
        <td class="ok">
          <div class="mark">○</div>query user
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
        <td class="ok">
          <div class="mark">○</div>
        </td>
        <td class="none">
          <div class="mark">-</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
