var globalConfig  = require('./config');

var gulp          = require('gulp');
var sass          = require('gulp-sass');

var sourcemaps    = require('gulp-sourcemaps');
var jshint        = require('gulp-jshint');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require('gulp-notify');
var browserSync   = require('browser-sync').create();

/*================================================================
 # HELPER
 ================================================================*/

function handleError(err) {
  var msg = 'Error: ' + err.message;

  console.error('Error', err.message);
  browserSync.notify('Error: ' + err.message);

  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end')
}

/*================================================================
 # TEST
 ================================================================*/

// unfinished
gulp.task('test', function() {

});

/*================================================================
 # TASK
 ================================================================*/

gulp.task('js', function() {
  var config = globalConfig.tasks.js;

  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(browserSync.stream(config.browserSyncOpt));
});

gulp.task('sass', function() {
  var config = globalConfig.tasks.sass;

  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.opt)).on('error', handleError)
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream(config.browserSyncOpt));
});

gulp.task('html', function() {
  var config = globalConfig.tasks.html;

  return gulp.src(config.src)
    .pipe(browserSync.stream(config.browserSyncOpt));
})

gulp.task('serve', function() {
  var config = globalConfig.tasks.serve;

  browserSync.init(config.browserSyncInit);
  gulp.watch(config.watch.js, ['js']);
  gulp.watch(config.watch.sass, ['sass']);
  gulp.watch(config.watch.html, ['html']);
});

var allTasks = [
  'js',
  'sass',
  'serve'
];
gulp.task('all', allTasks);
gulp.task('default', ['serve']);
