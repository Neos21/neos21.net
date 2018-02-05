(() => {
  
  // アンカーを生成する
  // https://github.com/bryanbraun/anchorjs
  const createAnchors = () => {
    // Target Elements Selector
    const selector = '#main > section section';  // 'h2, h3, h4, h5, h6';  // '#main > section section'
    // Find Heading
    const findHeading = true;
    // Insert Placement
    //   - true  : insertBefore
    //   - false : appendChild
    const isInsertBefore = false;
    
    const elements = [].slice.call(document.querySelectorAll(selector));
    elements.forEach((element) => {
      // ID 属性値を取得する
      const id = element.getAttribute('id');
      console.log(element, `${id}`);
      
      // ID 属性値が空値ならリンクを挿入しない
      if(!id || !`${id}`.trim()) {
        return;
      }
      
      // リンク要素を生成する
      const anchor = document.createElement('a');
      anchor.className = 'js-anchor';
      anchor.href = `#${id}`;
      
      // リンクを挿入する対象の要素を指定する
      let targetElement;
      if(findHeading) {
        // 対象要素内の最初の見出し要素にリンクを付与する場合
        //   ex. selector に 'section' を指定した時に、section 内の最初の見出し要素にリンクを挿入する
        targetElement = element.querySelector('h1, h2, h3, h4, h5, h6');
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
  
  document.addEventListener('DOMContentLoaded', () => {
    createAnchors();
  });
  
})();