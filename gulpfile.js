var gulp = require('gulp'),
  bsync = require('browser-sync').create(),
  reload = bsync.reload,
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  gutil = require('gulp-util'),
  gprint = require('gulp-print'),
  gif = require('gulp-if'),
  args = require('yargs').argv;

gulp.task('move', function() {
  return gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('move-refresh', ['move'], function() {
  reload();
});

gulp.task('sass', function() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle:'expanded'}).on('error', sassErrorHandler))
    .pipe(gulp.dest('./build/css/'));
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
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('js-refresh', ['vetjs'], function() {
  reload();
});

gulp.task('bsync', ['move', 'sass', 'vetjs'], function() {
  bsync.init({
    server: {
      baseDir: './build/'
    }
  });
});

gulp.task('default', ['bsync'], function() {
  gulp.watch('./src/**/*.html', ['move-refresh']);
  gulp.watch('./src/scss/**/*.scss', ['sass-refresh']);
  gulp.watch(['./src/**/*.js', './*.js'], ['js-refresh']);
});

//////////////////////////////////////////////////////////

function sassErrorHandler(err) {
  gutil.log(gutil.colors.red.underline('*** Sass Error ***\n') +
            gutil.colors.yellow.bold(err.message));
  this.emit('end');
}
