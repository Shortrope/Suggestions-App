var gulp = require('gulp'),
  bsync = require('browser-sync').create(),
  reload = bsync.reload,
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  gutil = require('gulp-util'),
  gprint = require('gulp-print'),
  gif = require('gulp-if'),
  args = require('yargs').argv;

gulp.task('vetHtml', function() {
});

gulp.task('vetHtml-refresh', ['vetHtml'], function() {
  reload();
});

gulp.task('sass', function() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle:'expanded'}).on('error', sassErrorHandler))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('sass-refresh', ['sass'], function() {
  reload();
});

gulp.task('vetjs', function() {
  return gulp
    .src([
      './*.js',
      './src/**/*.js',
      '!./src/js/jquery-?.?.?.js',
      '!./src/js/jquery-?.?.?.min.js'
    ])
    .pipe(gif(!args.q, gprint()))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js-refresh', ['vetjs'], function() {
  reload();
});

gulp.task('bsync', ['vetHtml', 'sass', 'vetjs'], function() {
  bsync.init({
    server: {
      baseDir: './src/'
    }
  });
});

gulp.task('default', ['bsync'], function() {
  gulp.watch('./src/**/*.html', ['vetHtml-refresh']);
  gulp.watch('./src/scss/**/*.scss', ['sass-refresh']);
  gulp.watch(['./src/**/*.js', './*.js'], ['js-refresh']);
});

//////////////////////////////////////////////////////////

function sassErrorHandler(err) {
  gutil.log(gutil.colors.red.underline('*** Sass Error ***\n') +
            gutil.colors.yellow.bold(err.message));
  this.emit('end');
}
