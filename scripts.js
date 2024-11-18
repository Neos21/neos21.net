// 本 JS ファイルは `head` 内で `defer` 等を付けずに同期読み込みしている

// ライトテーマ ⇔ ダークテーマの切替機能
try {
  const setTheme = condition => {
    const nextTheme = condition ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };
  
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.onchange = event => setTheme(event.matches);  // OS・ブラウザ設定変更時に動的にテーマを切り替える
  
  const lastTheme = localStorage.getItem('theme');
  if(lastTheme) {
    document.documentElement.dataset.theme = lastTheme;  // 2回目以降の訪問時の初期表示
  }
  else {
    setTheme(darkModeMediaQuery.matches);  // 初回訪問時の初期表示
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#header-link-theme > a').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light'));
  });
}
catch(error) {
  console.warn('Failed To Setup Toggle Theme', error);
}

// PV カウンタ
fetch('https://ct.neos21.net/ct/pv?id=1&referrer=' + encodeURIComponent(document.referrer ?? '') + '&landing=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(document.title ?? '')).catch(error => console.warn('Failed To Update Counter', error));
