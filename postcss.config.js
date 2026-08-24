import postcssImport from 'postcss-import';
import cssnano from 'cssnano';

// PostCSS 設定
export default {
  plugins: [
    // `@import` の処理
    postcssImport(),
    // 圧縮処理
    cssnano({
      preset: 'default'
    })
  ]
};
