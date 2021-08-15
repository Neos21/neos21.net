---
title        : Scripts Comparison
created      : 2020-11-21
last-modified: 2020-11-21
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
  - /tech/programming/knowledges/index.html プログラミング関連ナレッジ
head : |
  <style>
    .codes {
      display: grid;
      grid-template-columns: repeat(8, 30rem);
      column-gap: 1px;
      overflow-x: scroll;
    }
    
    .codes > pre {
      margin: 0 0 var(--nn-space-tiny);
      border-radius: 0;
      overflow-x: scroll;
    }
    
    .codes > pre::before {
      display: block;
      margin-bottom: var(--nn-space-tiny);
      border-bottom: 1px solid #fff;
      padding-bottom: var(--nn-space-tiny);
    }
    
    .codes > pre:nth-child(1)::before { content: "Windows Batch"; }
    .codes > pre:nth-child(2)::before { content: "PowerShell"   ; }
    .codes > pre:nth-child(3)::before { content: "Bash"         ; }
    .codes > pre:nth-child(4)::before { content: "VBScript"     ; }
    .codes > pre:nth-child(5)::before { content: "JScript"      ; }
    .codes > pre:nth-child(6)::before { content: "VB.NET"       ; }
    .codes > pre:nth-child(7)::before { content: "JScript.NET"  ; }
    .codes > pre:nth-child(8)::before { content: "C#"           ; }
  </style>
---

「あの処理はあのスクリプト言語でどう書くの？」のまとめ。Windows 向けのスクリプト言語多め。


## 目次


## Call From Windows Batch

Windows Batch から各スクリプトを呼び出す方法。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">Rem 同プロセスで呼ぶ
Call "script.bat"

Rem 別プロセスで呼ぶ
Start "script.bat"</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem PowerShell を呼び出す
PowerShell.exe -ExecutionPolicy RemoteSigned -F "script.ps1"</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem Msys Bash を呼び出す場合
"C:\msys\bin\sh.exe" --login -i "script.sh"</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem VBScript を呼び出す場合
CScript //NoLogo //E:VBScript "script.vbs"</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem JScript を呼び出す場合
CScript //NoLogo //E:JScript "script.js"</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\vbc.exe" "script.vb"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\jsc.exe" "script.js"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )</code></pre>
  <pre class="language-batch language-batch"><code class="language-batch">Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" "script.cs"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )</code></pre>
</div>


## Template

オレオレテンプレート。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">@Echo Off

Rem ココにコード

Pause
Exit /b</code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell"># ココにコード

Read-Host Please Enter key to continue...
Exit</code></pre>
  <pre class="language-bash language-bash"><code class="language-bash">#!/bin/bash

# ココにコード

read -p "Please any key to continue... " -n 1
exit</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">Option Explicit

' ココにコード

WScript.Echo("Please Enter key to continue...")
WScript.StdIn.ReadLine()
WScript.Quit()</code></pre>
  <pre class="language-js language-js"><code class="language-js">// ココにコード

WScript.Echo("Please Enter key to continue...");
WScript.StdIn.ReadLine();
WScript.Quit();</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">Imports System

Module Module1
  Sub Main()
    ' ココにコード
    
    Console.WriteLine("Please Enter key to continue...")
    Console.ReadKey()
    Environment.Exit(0)
  End Sub
End Module</code></pre>
  <pre class="language-js language-js"><code class="language-js">import System;

// 即時関数は必須ではないけど…
(function() {
  // ココにコード
  
  Console.WriteLine("Please Enter key to continue...");
  Console.ReadKey();
  Environment.Exit(0);
})();</code></pre>
  <pre class="language-cs language-cs"><code class="language-cs">using System;

class CSharp {
  public static void Main() {
    // ココにコード
    
    Console.WriteLine("Please Enter key to continue...");
    Console.ReadKey();
    Environment.Exit(0);
  }
}</code></pre>
</div>


## Echo

コンソールに文字列を出力する。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">Echo FooBar
Echo ほげピヨ</code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell">Write-Output FooBar
Write-Host ほげピヨ</code></pre>
  <pre class="language-bash language-bash"><code class="language-bash">echo FooBar
echo ほげピヨ</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">WScript.Echo("FooBar")
Wscript.StdOut.Write("ほげピヨ")

' カッコがなくても OK
WScript.Echo "FooBar"
Wscript.StdOut.Write "ほげピヨ"</code></pre>
  <pre class="language-js language-js"><code class="language-js">WScript.Echo("FooBar");
Wscript.StdOut.Write("ほげピヨ");</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">Imports System

Console.WriteLine("FooBar")
Console.WriteLine("ほげピヨ")</code></pre>
  <pre class="language-js language-js"><code class="language-js">import System;

print("FooBar");
Console.WriteLine("ほげピヨ");</code></pre>
  <pre class="language-cs language-cs"><code class="language-cs">using System;

Console.WriteLine("FooBar");
Console.WriteLine("ほげピヨ");</code></pre>
</div>


## Sleep

指定時間処理を一時停止する。3秒停止させるサンプル。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">Ping localhost -n 4
Timeout 3

Rem sleep.exe を持っていれば
Sleep 3</code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell">Start-Sleep -s 3</code></pre>
  <pre class="language-bash language-bash"><code class="language-bash">sleep 3</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">WScript.Sleep(3000)</code></pre>
  <pre class="language-js language-js"><code class="language-js">WScript.Sleep(3000);</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">Imports System

System.Threading.Thread.Sleep(3000)</code></pre>
  <pre class="language-js language-js"><code class="language-js">import System;

System.Threading.Thread.Sleep(3000);</code></pre>
  <pre class="language-cs language-cs"><code class="language-cs">using System;

System.Threading.Thread.Sleep(3000);</code></pre>
</div>


## Pause

ユーザからのキー入力を待つ。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">Pause
Rem => 続行するには何かキーを押してください . . .</code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell">Read-Host "続行するには Enter キーを押してください。"</code></pre>
  <pre class="language-bash language-bash"><code class="language-bash">read -p "続行するには何かキーを押してください。" -n 1</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">WScript.Echo "続行するには Enter キーを押してください。"
WScript.StdIn.ReadLine</code></pre>
  <pre class="language-js language-js"><code class="language-js">WScript.Echo("続行するには Enter キーを押してください。");
WScript.StdIn.ReadLine();</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">Imports System

Console.WriteLine("続行するには Enter キーを押してください。")
Console.ReadLine()</code></pre>
  <pre class="language-js language-js"><code class="language-js">import System;

Console.WriteLine("続行するには Enter キーを押してください。");
Console.ReadLine();</code></pre>
  <pre class="language-cs language-cs"><code class="language-cs">using System;

Console.WriteLine("続行するには Enter キーを押してください。");
Console.ReadLine();</code></pre>
</div>


## Comment

スクリプト内でのコメント。

<div class="codes">
  <pre class="language-batch language-batch"><code class="language-batch">Rem コメント

:: コロン「:」はラベルを表すのでコメント代わりに使える</code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell"># 1行コメント

&#x3C;# 複数行コメント
終わり #></code></pre>
  <pre class="language-powershell language-powershell"><code class="language-powershell"># コメント</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">' シングルクォートでコメント</code></pre>
  <pre class="language-js language-js"><code class="language-js">// 1行コメント

/* 複数行コメント
終わり */</code></pre>
  <pre class="language-vb language-vb"><code class="language-vb">' シングルクォートでコメント

''' ドキュメントコメント</code></pre>
  <pre class="language-js language-js"><code class="language-js">// 1行コメント

/* 複数行コメント
終わり */

/// ドキュメントコメント</code></pre>
  <pre class="language-cs language-cs"><code class="language-cs">// 1行コメント

/* 複数行コメント
終わり */

/// ドキュメントコメント</code></pre>
</div>
