var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var ejs = require("gulp-ejs");
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');

// Sassの読み込み先とCssの保存先を指定
gulp.task('sass', (done) => {
  gulp
    .src(["src/common/scss/*.scss", "src/common/scss/**/*.scss", "src/common/scss/**/**/*.scss"])
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/common/css'));
  done();
});

// ejsの読み込み先とhtmlの保存先を指定
gulp.task("ejs", (done) => {
  gulp
    .src(["src/*.ejs", "src/**/*.ejs", "src/**/**/*.ejs",// 吐き出し対象のejs
      "!" + "src/**/_*.ejs", "!" + "src/_*.ejs"]) // 吐き出し非対称のejs
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("dist/"));
  done();
});

// 共通ファイルの転送元と転送先を指定
gulp.task("common", (done) => {
  gulp
    .src(["src/common/**", "!" + "src/common/scss/**",
      "!" + "src/common/*.ejs"])
    .pipe(gulp.dest("dist/common"));
  done();
});

// ローカルサーバーの立ち上げ
gulp.task('connect', (done) => {
  connect.server({
    root: 'dist',
  });
  done();
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('task-watch', gulp.series('sass', (cb) => {
  var watcher_scss = gulp.watch(
    ["src/common/scss/*.scss", "src/common/scss/**/*.scss"], gulp.task('sass')
  );
  var watcher_ejs = gulp.watch(
    ["src/*.ejs", "src/**/*.ejs"], gulp.task('ejs')
  );
  var watcher_common = gulp.watch(
    ["src/common/**", "!" + "src/common/scss/**"], gulp.task('common')
  );
  watcher_scss.on('change', function (event) {
  });
  watcher_ejs.on('change', function (event) {
  });
  watcher_common.on('change', function (event) {
  });
  cb();
}));

// タスク"task-watch"がgulpと入力しただけでdefaultで実行されるようになる
gulp.task('default', gulp.series(['task-watch']));
