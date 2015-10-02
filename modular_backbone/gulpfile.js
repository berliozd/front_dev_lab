var gulp = require('gulp');
var browserify = require('gulp-browserify');
var stringify = require('stringify');
var sass = require('gulp-sass');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');


// Basic usage
gulp.task('browserify', ['clean-js'], function () {
  // Single entry point to browserify
  gulp.src('js/main.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: stringify({
        extensions: ['.html'],
        minify: true
      })
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
});

gulp.task('scss', ['clean-css'], function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/css'))
});

gulp.task('clean-css', function () {
  return del([
    'build/css/**/*.css',
  ]);
});

gulp.task('clean-js', function () {
  return del([
    'build/js/**/*.js',
  ]);
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['browserify']);
  gulp.watch('scss/**/*.scss', ['scss']);
});

gulp.task('default', ['browserify', 'scss', 'watch']);
