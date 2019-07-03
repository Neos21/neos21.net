(function() {
  console.log(`Neo's World Scripts`);
  
  /**
   * アンカーを生成する
   * 
   * AnchorJS を参考に、section 要素に振られた ID を最初の子要素の見出し要素に振るように改造
   *   - https://github.com/bryanbraun/anchorjs
   */
  const createAnchors = () => {
    // ID 属性の探索対象
    const selector = '#main > section section';
    // 見出しを探索する (true) : id 属性は section 要素に振っているが、アンカーは最初の子要素である見出し要素に振りたい
    const findHeading = true;
    // アンカーの挿入位置 : true で見出し文言の手前・false で見出し文言の後ろ
    const isInsertBefore = false;
    
    Array.prototype.forEach.call(document.querySelectorAll(selector), (element) => {
      // ID 属性値を取得する
      const id = element.getAttribute('id');
      
      // ID 属性値が空値ならアンカーを挿入しない
      if(!id || !`${id}`.trim()) {
        return;
      }
      
      // アンカー要素を生成する
      const anchor = document.createElement('a');
      anchor.className = 'js-anchor';
      anchor.href = `#${id}`;
      
      // リンクを挿入する対象の要素を指定する
      let targetElement;
      if(findHeading) {
        // 対象要素内の最初の見出し要素にリンクを付与する場合
        //   ex. selector に 'section' を指定した時に、section 内の最初の見出し要素にリンクを挿入する
        targetElement = element.querySelector('h2, h3, h4, h5, h6');
        // 見出し要素がなければリンクの挿入を諦める
        if(!targetElement) {
          return;
        }
      }
      else {
        // 通常は対象要素自体にリンクを挿入する
        targetElement = element;
      }
      
      // リンクを挿入する
      if(isInsertBefore) {
        targetElement.insertBefore(anchor, targetElement.firstChild);
      }
      else {
        targetElement.appendChild(anchor);
      }
    });
  };
  
  // 読み込みタイミングに関わらず確実に実行されるよう制御する
  if(!document.readyState || document.readyState === 'interactive') {
    console.log('window.onload 予約');
    window.addEventListener('load', createAnchors);
  }
  else if(document.readyState === 'loading') {
    console.log('DOMContentLoaded 予約');
    document.addEventListener('DOMContentLoaded', createAnchors);
  }
  else {
    console.log('即実行');
    createAnchors();
  }
  
  /**
   * TouchStart
   * 
   * タップ時の動作を早めるため空の関数を設定する
   */
  document.addEventListener('touchstart', () => {
    // Do Nothing
  });
})();
