var gulp = require('gulp');
var browserify = require('gulp-browserify');
var stringify = require('stringify');

// Basic usage
gulp.task('browserify', function () {
  // Single entry point to browserify
  gulp.src('js/main.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: stringify({
        extensions: ['.html'],
        minify: true
      })
    }))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('default', ['browserify']);
