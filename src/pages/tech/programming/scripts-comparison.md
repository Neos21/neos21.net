---
title        : Scripts Comparison
created      : 2020-11-21
last-modified: 2022-05-26
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
head : |
  <style>
    /* div */
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
    
    /* 言語名 */
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

```batch
Rem 同プロセスで呼ぶ
Call "script.bat"

Rem 別プロセスで呼ぶ
Start "script.bat"
```

```batch
Rem PowerShell を呼び出す
PowerShell.exe -ExecutionPolicy RemoteSigned -F "script.ps1"
```

```batch
Rem Msys Bash を呼び出す場合
"C:\msys\bin\sh.exe" --login -i "script.sh"
```

```batch
Rem VBScript を呼び出す場合
CScript //NoLogo //E:VBScript "script.vbs"
```

```batch
Rem JScript を呼び出す場合
CScript //NoLogo //E:JScript "script.js"
```

```batch
Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\vbc.exe" "script.vb"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )
```

```batch
Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\jsc.exe" "script.js"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )
```

```batch
Rem コンパイルした exe ファイルが存在していたら削除する
If Exist "script.exe" ( Del "script.exe" )

Rem コンパイラでコンパイルする
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" "script.cs"

Rem コンパイルできたら実行する
If "%ERRORLEVEL%" == "0" ( "script.exe" )
```

</div>


## Template

オレオレテンプレート。

<div class="codes">

```batch
@Echo Off

Rem ココにコード

Pause
Exit /b
```

```powershell
# ココにコード

Read-Host Please Enter key to continue...
Exit
```

```bash
#!/bin/bash

# ココにコード

read -p "Please any key to continue... " -n 1
exit
```

```vb
Option Explicit

' ココにコード

WScript.Echo("Please Enter key to continue...")
WScript.StdIn.ReadLine()
WScript.Quit()
```

```javascript
// ココにコード

WScript.Echo("Please Enter key to continue...");
WScript.StdIn.ReadLine();
WScript.Quit();
```

```vb
Imports System

Module Module1
  Sub Main()
    ' ココにコード
    
    Console.WriteLine("Please Enter key to continue...")
    Console.ReadKey()
    Environment.Exit(0)
  End Sub
End Module
```

```javascript
import System;

// 即時関数は必須ではないけど…
(function() {
  // ココにコード
  
  Console.WriteLine("Please Enter key to continue...");
  Console.ReadKey();
  Environment.Exit(0);
})();
```

```csharp
using System;

class CSharp {
  public static void Main() {
    // ココにコード
    
    Console.WriteLine("Please Enter key to continue...");
    Console.ReadKey();
    Environment.Exit(0);
  }
}
```

</div>


## Echo

コンソールに文字列を出力する。

<div class="codes">

```batch
Echo FooBar
Echo ほげピヨ
```

```powershell
Write-Output FooBar
Write-Host ほげピヨ
```

```bash
echo FooBar
echo ほげピヨ
```

```vb
WScript.Echo("FooBar")
Wscript.StdOut.Write("ほげピヨ")

' カッコがなくても OK
WScript.Echo "FooBar"
Wscript.StdOut.Write "ほげピヨ"
```

```javascript
WScript.Echo("FooBar");
Wscript.StdOut.Write("ほげピヨ");
```

```vb
Imports System

Console.WriteLine("FooBar")
Console.WriteLine("ほげピヨ")
```

```javascript
import System;

print("FooBar");
Console.WriteLine("ほげピヨ");
```

```csharp
using System;

Console.WriteLine("FooBar");
Console.WriteLine("ほげピヨ");
```

</div>


## Sleep

指定時間処理を一時停止する。3秒停止させるサンプル。

<div class="codes">

```batch
Ping localhost -n 4
Timeout 3

Rem sleep.exe を持っていれば
Sleep 3
```

```powershell
Start-Sleep -s 3
```

```bash
sleep 3
```

```vb
WScript.Sleep(3000)
```

```javascript
WScript.Sleep(3000);
```

```vb
Imports System

System.Threading.Thread.Sleep(3000)
```

```javascript
import System;

System.Threading.Thread.Sleep(3000);
```

```csharp
using System;

System.Threading.Thread.Sleep(3000);
```

</div>


## Pause

ユーザからのキー入力を待つ。

<div class="codes">

```batch
Pause
Rem => 続行するには何かキーを押してください . . .
```

```powershell
Read-Host "続行するには Enter キーを押してください。"
```

```bash
read -p "続行するには何かキーを押してください。" -n 1
```

```vb
WScript.Echo "続行するには Enter キーを押してください。"
WScript.StdIn.ReadLine
```

```javascript
WScript.Echo("続行するには Enter キーを押してください。");
WScript.StdIn.ReadLine();
```

```vb
Imports System

Console.WriteLine("続行するには Enter キーを押してください。")
Console.ReadLine()
```

```javascript
import System;

Console.WriteLine("続行するには Enter キーを押してください。");
Console.ReadLine();
```

```csharp
using System;

Console.WriteLine("続行するには Enter キーを押してください。");
Console.ReadLine();
```

</div>


## Comment

スクリプト内でのコメント。

<div class="codes">

```batch
Rem コメント

:: コロン「:」はラベルを表すのでコメント代わりに使える
```

```powershell
# 1行コメント

<# 複数行コメント
終わり #>
```

```powershell
# コメント
```

```vb
' シングルクォートでコメント
```

```javascript
// 1行コメント

/* 複数行コメント
終わり */
```

```vb
' シングルクォートでコメント

''' ドキュメントコメント
```

```javascript
// 1行コメント

/* 複数行コメント
終わり */

/// ドキュメントコメント
```

```csharp
// 1行コメント

/* 複数行コメント
終わり */

/// ドキュメントコメント
```

</div>
