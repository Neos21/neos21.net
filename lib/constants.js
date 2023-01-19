/** 定数 */
export const constants = {
  protocol: 'https://',
  host: 'neos21.net',
  siteName: "Neo's World",
  author: 'Neo',
  
  src : 'src',
  dist: 'dist',
  
  pages: {
    src : 'src/pages',
    dist: 'dist'
  },
  templates: {
    src : 'src/templates/templates.html'
  },
  styles: {
    src : 'src/styles/styles.css',
    dist: 'dist/styles.css'
  },
  news: {
    src : 'src/news/news.yaml',
    dist: [  // `news.yaml` を埋め込むファイルのメモ (未使用)
      'dist/index.html',
      'dist/about/new.html'
    ]
  },
  feeds: {
    src : 'src/feeds/feeds.xml',
    dist: 'dist/feeds.xml',
    canonical: '/feeds.xml',
    feedsCount: 30
  },
  sitemap: {
    src : 'src/sitemap/sitemap.xml',
    dist: 'dist/sitemap.xml'
  },
  documents: {
    src : 'src/documents',
    dist: 'dist/documents'
  }
};
