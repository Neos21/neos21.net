/** 定数 */
export const constants = {
  protocol: 'https://',
  host: 'neos21.net',
  siteName: "Neo's World",
  author: 'Neo',
  
  src : 'src',
  dist: 'dist',
  
  /** ページデータのディレクトリパス (配下の HTML・Markdown はビルド対象・それ以外のファイルはコピー) */
  pages: {
    src : 'src/pages',
    dist: 'dist'
  },
  /** テンプレート HTML */
  templates: {
    src : 'src/templates/templates.html'
  },
  /** CSS */
  styles: {
    src : 'src/styles/styles.css',
    dist: 'dist/styles.css'
  },
  /** トップページの「News」欄と「更新履歴」ページのデータとなる YAML */
  news: {
    src : 'src/news/news.yaml',
    dist: [  // `news.yaml` を埋め込むファイルのメモ (未使用)
      'dist/index.html',
      'dist/about/new.html'
    ]
  },
  /** Atom フィード XML */
  feeds: {
    src : 'src/feeds/feeds.xml',
    dist: 'dist/feeds.xml',
    /** `{{ feeds-path }}` に使用する */
    canonical: '/feeds.xml',
    /** フィードに乗せる最大件数 */
    feedsCount: 30
  },
  /** サイトマップ XML */
  sitemap: {
    src : 'src/sitemap/sitemap.xml',
    dist: 'dist/sitemap.xml'
  },
  /** Neo's Documents */
  documents: {
    src : 'src/documents',
    dist: 'dist/documents'
  }
};
