var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  mocha = require('gulp-mocha');

gulp.task('develop', function() {
  livereload.listen();
  nodemon({
    script: 'server.js',
    ext: 'js ejs',
  }).on('restart', function() {
    setTimeout(function() {
      livereload.changed(__dirname);
    }, 500);
  });
});


gulp.task('mocha', function() {
  process.env.NODE_ENV = 'test';
  process.env.PORT=8001;
  return gulp.src([
    'modules/**/*.spec.js'
  ], {
    read: false
  }).pipe(mocha({

  }));
});

gulp.task('watch-mocha', function() {
  gulp.watch([
    'modules/**/*.spec.js'
  ],['mocha']);
});

gulp.task('test', ['mocha', 'watch-mocha']);

gulp.task('default', ['develop']);
