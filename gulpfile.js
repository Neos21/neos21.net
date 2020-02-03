const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: ['browser-sync', 'browserify', 'del', 'vinyl-buffer', 'vinyl-source-stream'],
  overridePattern: false,  // デフォルトのパターン ('gulp-*', 'gulp.*', '@*/gulp{-,.}*') を残す
  maintainScope: false     // スコープパッケージを階層化しない
});

// コピーのみする画像ファイルなど
const assetFileNames = [
  './src/pages/**/*.jpg',
  './src/pages/**/*.gif',
  './src/pages/**/*.png',
  './src/pages/**/*.ico',
  './src/pages/**/*.swf',
  './src/pages/**/*.txt',
  './src/pages/.htaccess'
];


// Build
// --------------------------------------------------------------------------------

/**
 * テンプレート HTML を適用して全ファイルを出力する (追加・変更のみ、削除には非対応)
 */
function htmlAll(done) {
  gulp
    .src('./src/pages/**/*.html')
    .pipe($.templateHtml('./src/templates/template.html'))
    .pipe(gulp.dest('./docs'));
  done();
}
gulp.task('html-all', htmlAll);

/**
 * テンプレート HTML を適用して出力する (追加・変更のみ、削除には非対応)
 */
function html(done) {
  gulp
    .src('./src/pages/**/*.html', {
      since: gulp.lastRun(html)
    })
    .pipe($.templateHtml('./src/templates/template.html'))
    .pipe(gulp.dest('./docs'));
  done();
}
gulp.task('html', html);

/**
 * SCSS をトランスパイルして CSS を出力する
 */
function css(done) {
  gulp
    .src(['./src/styles/index.scss'])  // エントリポイント
    .pipe($.plumber(function(_error) {
      return this.emit('end');
    }))
    .pipe(
      $.sass({
        outputStyle: 'compressed'
      })
      .on('error', $.sass.logError)
    )
    .pipe($.cleanCss())              // import('.css') をインライン化して全体を圧縮・ついでに UTF-8 BOM を除去する
    .pipe($.rename('./styles.css'))  // リネームする
    .pipe(gulp.dest('./docs'));      // ./docs/styles.css を出力する
  done();
}
gulp.task('css', css);

/**
 * ES2015 をトランスパイルして JS を出力する
 */
function js(done) {
  $.browserify({
    entries: ['./src/scripts/index.js'],  // エントリポイント
    transform: [
      ['babelify', {
        presets: ['@babel/preset-env']
      }]
    ]
  })
    .bundle()  // Do Browserify!
    .on('error', function(error) {
      console.log(`Browserify Error : ${error.message}`);
      this.emit('end');
    })
    .pipe($.vinylSourceStream('scripts.js'))  // Vinyl に変換しリネームする
    .pipe($.vinylBuffer())                    // Uglify できるように変換する
    .pipe($.uglify())                         // Uglify する
    .pipe(gulp.dest('./docs'));               // ./docs/scripts.js を出力する
  done();
}
gulp.task('js', js);

/**
 * HTML・CSS・JS 以外の画像ファイルなどを全てコピーする (追加・変更のみ、削除には非対応)
 */
function assetsAll(done) {
  gulp
    .src(assetFileNames, { base: 'src/pages' })
    .pipe(gulp.dest('docs'));
  done();
}
gulp.task('assets-all', assetsAll);

/**
 * HTML・CSS・JS 以外の画像ファイルなどをコピーする (追加・変更のみ、削除には非対応)
 */
function assets(done) {
  gulp
    .src(assetFileNames, {
      base: 'src/pages',
      since: gulp.lastRun(assets)
    })
    .pipe(gulp.dest('docs'));
  done();
}
gulp.task('assets', assets);


// Build All
// --------------------------------------------------------------------------------

/**
 * docs ディレクトリ配下のファイルを削除する
 */
function clean(done) {
  $.del(['./docs/**/*', './docs/.htaccess']);
  done();
}
gulp.task('clean', clean);

/**
 * 全ファイルをビルドする : コレだけ関数で囲まない
 */
const build = gulp.series(
  clean,
  gulp.parallel(htmlAll, css, js, assetsAll)
);
gulp.task('build', build);


// Live-Reload
// --------------------------------------------------------------------------------

/**
 * ライブリロード開発用に Browser-Sync サーバを起動する
 */
function initBrowserSync(done) {
  $.browserSync.init({
    server: {
      baseDir: 'docs',
      index: 'index.html'
    }
  });
  done();
}

/** 監視する */
function watch() {
  /** リロードする */
  const reload = (done) => {
    $.browserSync.reload();
    done();
  };
  /** ファイルを削除する */
  const removeFile = (path) => {
    $.del(path.replace(/src\\pages/, 'docs').replace(/src\/pages/, 'docs'));
  };
  
  // src ファイルを監視して処理する
  gulp.watch('./src/styles/**/*.scss'   ).on('change', gulp.series(css    , reload));
  gulp.watch('./src/scripts/**/*.js'    ).on('change', gulp.series(js     , reload));
  gulp.watch('./src/templates/**/*.html').on('change', gulp.series(htmlAll, reload));  // テンプレート HTML 変更時は全 HTML ファイルに再適用する
  // 各 HTML
  gulp.watch('./src/pages/**/*.html')
    .on('add'   , gulp.series(html, reload))
    .on('change', gulp.series(html, reload))
    .on('unlink', removeFile);
  // アセットファイル
  gulp.watch(assetFileNames)
    .on('add'   , gulp.series(assets))
    .on('change', gulp.series(assets))
    .on('unlink', removeFile);
}

/**
 * ファイルを監視してライブリロード開発を行う
 */
gulp.task('dev', gulp.series(initBrowserSync, watch));
