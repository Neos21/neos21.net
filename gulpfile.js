const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: ['browser-sync', 'browserify', 'del', 'run-sequence', 'vinyl-buffer', 'vinyl-source-stream'],
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
  './src/pages/.htaccess'
];


// Build
// --------------------------------------------------------------------------------

/**
 * テンプレート HTML を適用して全ファイルを出力する
 */
gulp.task('html-all', () => {
  return gulp
    .src('./src/pages/**/*.html')
    .pipe($.templateHtml('./src/templates/template.html'))
    .pipe(gulp.dest('./docs'));
});

/**
 * テンプレート HTML を適用して出力する (差分のみ)
 */
gulp.task('html', () => {
  return gulp
    .src('./src/pages/**/*.html')
    .pipe($.changed('./docs'))
    .pipe($.templateHtml('./src/templates/template.html'))
    .pipe(gulp.dest('./docs'));
});

/**
 * SCSS をトランスパイルして CSS を出力する
 */
gulp.task('css', () => {
  return gulp
    .src(['./src/styles/index.scss'])  // エントリポイント
    .pipe($.plumber(function(error) {
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
});

/**
 * ES2015 をトランスパイルして JS を出力する
 */
gulp.task('js', () => {
  return $.browserify({
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
});

/**
 * HTML・CSS・JS 以外の画像ファイルなどを全てコピーする
 */
gulp.task('assets-all', () => {
  return gulp
    .src(assetFileNames, { base: 'src/pages' })
    .pipe(gulp.dest('docs'));
});

/**
 * HTML・CSS・JS 以外の画像ファイルなどをコピーする (差分のみ)
 */
gulp.task('assets', () => {
  return gulp
    .src(assetFileNames, { base: 'src/pages' })
    .pipe($.changed('./docs'))
    .pipe(gulp.dest('docs'));
});


// Build All
// --------------------------------------------------------------------------------

/**
 * docs ディレクトリ配下のファイルを削除する
 */
gulp.task('clean', () => {
  return $.del(['./docs/**/*']);
});

/**
 * 全ファイルをビルドする
 */
gulp.task('build', (callback) => {
  return $.runSequence(
    'clean',
    ['html-all', 'css', 'js', 'assets-all'],
    callback
  );
});


// Live-Reload
// --------------------------------------------------------------------------------

/**
 * ライブリロード開発用に Browser-Sync サーバを起動する
 */
gulp.task('browser-sync', () => {
  return $.browserSync.init({
    server: {
      baseDir: "docs",
      index: "index.html"
    }
  });
});

/**
 * リロードする
 */
gulp.task('reload', function () {
  return $.browserSync.reload();
});

/**
 * ファイルを監視してライブリロード開発を行う
 */
gulp.task('dev', ['browser-sync'], function () {
  // src ファイルを監視して処理する
  $.watch('./src/styles/**/*.scss', () => {
    return gulp.start(['css'])
  });
  $.watch('./src/scripts/**/*.js', () => {
    return gulp.start(['js']);
  });
  $.watch('./src/pages/**/*.html', (file) => {
    // ファイルが削除された時は docs ディレクトリからも削除する
    if(file.event === 'unlink') {
      return $.del(file.path.replace(/src\\pages/, 'docs').replace(/src\/pages/, 'docs'));
    }
    return gulp.start(['html']);
  });
  // テンプレート変更時は全ファイルに再適用する
  $.watch('./src/templates/**/*.html', () => {
    return gulp.start(['html-all']);
  });
  $.watch(assetFileNames, (file) => {
    // ファイルが削除された時は docs ディレクトリからも削除する
    if(file.event === 'unlink') {
      return $.del(file.path.replace(/src\\pages/, 'docs').replace(/src\/pages/, 'docs'));
    }
    return gulp.start(['assets']);
  });
  
  // docs ファイルを監視してライブリロードする
  $.watch('./docs/**/*', () => {
    return gulp.start(['reload']);
  });
});
