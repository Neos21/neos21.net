// テンプレート HTML 内にインライン埋め込みする JS コード
// 
// LocalStorage を参照してライトテーマ (`light`) かダークテーマ (`dark`) かを `html` 要素の `data-theme` 属性に設定する
// このコードは `head` 要素の CSS ファイルを読み込む手前に注入しておくことで、わざとレンダリングをブロックして初期表示時のチラ付きを防ぐ
// このコードでは `data-theme` 属性値の復元までで、OS・ブラウザ設定の変更検知、テーマ切替ボタンの押下による LocalStorage 保存処理は別途 JS ファイル側に実装する

try {
  // 万が一 LocalStorage に `light`・`dark` 以外の値が入っていたらおかしくなるがチェックしていない
  // `??` 以降はカッコで囲まないとおかしくなる
  document.documentElement.dataset.theme = localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
}
catch {
  // プライベートウィンドウなどで LocalStorage 参照エラーが出たら固定値を設定する
  document.documentElement.dataset.theme = 'light';
}
