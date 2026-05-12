// ライトテーマ ⇔ ダークテーマ切替機能
const setTheme = condition => {
  const nextTheme = condition ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('theme', nextTheme);
};
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.onchange = event => setTheme(event.matches);

const lastTheme = localStorage.getItem('theme');
if(lastTheme == null) { setTheme(darkModeMediaQuery.matches); }
else { document.documentElement.dataset.theme = lastTheme; }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#header-link-theme > a').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light'));
});

// PV カウンタ
(async () => {
  const body = {
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
  
  fetch('https://app.neos21.net/api/access-counter/pv', {
    mode: 'cors',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true
  }).catch(() => { /* Do Nothing */});
})();
