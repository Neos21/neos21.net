// `head` 要素内で `defer` 属性付きで読み込まれる JS ファイル

// - `defer` 属性を付けると実行タイミングが「DOMContentLoaded イベントの直前」に固定されるので
//   `document.addEventListener('DOMContentLoaded')` は書いても書かなくてもほぼ同じ意味になる
//   (HTML 読み込み前で DOM 要素が見つからない、といったことは起きない)
// - `window.addEventListener('DOMContentLoaded')` は書いても動くが、厳密には誤り・内部的には `document` に引き渡されている模様
// - `window.onload` のタイミングに遅延させても良いが、画像なども含めて読み込みが終わらないとイベントが発火しないため
//   読み込みが長引いた場合のために `setTimeout` でも実行するような実装が必要 (`window.onload` と重複実行しないようフラグ変数での管理が必要になる)
document.addEventListener('DOMContentLoaded', () => {
  /**
   * `window.requestIdleCallback` はメインスレッドがアイドル状態になったら処理を開始する・Safari ブラウザにはまだ `requestIdleCallback` がないので `setTimeout` で代用する
   * なお、Terser は変数化が不要なモノは自動的にインライン展開して短縮してくれる
   */
  const safeIdle = requestIdleCallback || (callback => setTimeout(callback, 1));
  
  safeIdle(async () => {
    /**
     * ライトテーマ ⇔ ダークテーマを切り替えつつ LocalStorage に保存する
     * Terser が `const` を `let` へと短縮はできないので自前で `let` 宣言にしておく
     */
    let setTheme = condition => {
      let nextTheme = condition ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem('theme', nextTheme);
      }
      catch { /* Do Nothing */ }
    };
    
    // `window.matchMedia` を監視する
    matchMedia('(prefers-color-scheme:dark)').onchange = event => setTheme(event.matches);
    // テーマ切替ボタン (万が一要素がなくてもエラーにしないよう、オプショナルチェーン演算子 `?.` で繋ぐ)
    document.querySelector('#header-link-theme>a')?.addEventListener('click', event => {
      event.preventDefault();
      setTheme(document.documentElement.dataset.theme === 'light');
    });
    
    // PV カウンタ
    try {
      let url = 'https://app.neos21.net/api/access-counter/pv';
      let body = {
        id      : 1,
        ref     : document.referrer || '-',
        url     : location.href || '-',
        title   : document.title || '-',
        langs   : navigator.languages ?? [navigator.language || '-'],
        lang    : navigator.languages?.[0] ?? (navigator.language || '-'),
        ua      : navigator.userAgent || '-',
        ua_data : navigator.userAgentData ?? '-',
        ua_model: '- (UNDEF)'
      };
      if(navigator.userAgentData) body.ua_model = await navigator.userAgentData.getHighEntropyValues(['model']).then(values => values.model || '-').catch(_ => '- (ERROR)');
      
      // `sendBeacon`・`keepalive` 付き Fetch ともに送れるデータ長は 65536 バイトまで、それを超えるとエラーになる
      if(navigator.sendBeacon) {
        // `sendBeacon` は POST メソッドのみで CORS プリフライト (OPTION メソッド) が事前に飛ばない
        // クロスオリジンリクエストには変わりないので、サーバ側での CORS 設定 (`Access-Control-Allow-Origin` など) は変わらず必要
        // `sendBeacon` 関数の戻り値は `boolean` だが、コレは「ブラウザの送信キューにデータを格納できたか否か」であり「送信が完了した」ことは示していない
        navigator.sendBeacon(url, JSON.stringify(body));
      }
      else {
        // `await` は書かないが `catch()` でエラーは握りつぶしておく : `await` を付けると内部的なステートマシンのメモリを食う・`await` しない方がイベントループの経由回数が少なく済む
        fetch(url, {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true
        }).catch(() => { /* Do Nothing */ });
      }
    }
    catch { /* Do Nothing */ }
    
    // Google Tag Manager (アクセス解析) のコード相当を再実装し、自前で定義した `user_interacted` イベントを設定したタイミングでトリガーされるようにする
    // - GTM の管理画面でトリガーを「All Pages (自動で最速読込)」や「Window Loaded」にせず、「カスタムイベント」として `user_interacted` を設定しておく必要がある
    // - 元コード : `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MZCGD23');</script>`
    //   - トリガーを「All Pages」に設定していた場合は `gtm.js` イベントの時点で各種タグのロードが始まる
    //   - `window.dataLayer` というグローバル変数名を変更している場合は `?l=` パラメータを付けた上で読み込んでる
    //   - インラインの `script` 要素でコードを実行しているので、`getElementsByTagName(s)[0]` で必ず `script` 要素が何かしら見つかる前提になっている
    //   - 以前の `appendChild` にはバグがあったため、歴史的経緯と後方互換性のために挿入操作を `insertBefore` で行っている
    window.dataLayer = window.dataLayer || [];  // グローバル変数の `window.` は省略不可
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    
    /** GTM のスクリプトを挿入する */
    let gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MZCGD23';  // GTM の識別コードを付ける・`window.dataLayer` という変数名は維持しているので `&l=` は要らない
    document.head.appendChild(gtmScript);
    
    /** 複数イベントが重複実行しないようにフラグでチェックする */
    let isGtmTriggered = false;
    /** 画面操作があったタイミングで動かす関数 */
    let triggerGtm = () => {
      if(isGtmTriggered) return;
      isGtmTriggered = true;
      
      // GTM に画面操作があったことを通知する → GTM 内で紐付けている Google Analytics・Microsoft Clarity が発火する
      window.dataLayer.push({ event: 'user_interacted' });
      // イベントを解除する
      removeListeners();
      
      // Google AdSense 相当のコードをココで初めて挿入する
      // - 元コード : `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6475907504235292" crossorigin="anonymous"></script>`
      let adsenseScript = document.createElement('script');
      adsenseScript.crossOrigin = 'anonymous';
      adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6475907504235292';
      document.head.appendChild(adsenseScript);
    };
    
    /** イベントの種類定義 : ページロード後に最初に行われるであろうユーザ操作のどれかを検知する (`click`・`mousedown` は含めなくて大丈夫) */
    let listenerTypes = ['scroll', 'keydown', 'touchstart', 'mousemove'];
    /** どれか1つのイベントが発火したらこの関数を呼び出すことで、全てのイベントを解除する (全イベントを解除したので `once: true` での登録では不十分) */
    let removeListeners = () => listenerTypes.forEach(type => removeEventListener(type, triggerGtm));  // `window.removeEventListener`
    
    // イベントを登録する : `passive: true` は対象の関数が `event.preventDefault()` を呼び出さないことを示す。関数がスクロール操作などをブロックしないことが明確になるため操作がスムーズになる
    listenerTypes.forEach(type => addEventListener(type, triggerGtm, { passive: true }));  // `window.addEventListener`
  }, { timeout: 2000 });  // `timeout` により、「2秒待ってもアイドル状態にならなかったら強制実行する」という設定になる
});
