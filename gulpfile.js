var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('replace');

var paths = {
  sass: ['./scss/**/*.scss']
};

var replaceFiles = ['./www/js/app.js'];

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('add-proxies', function() {
  replace({
    regex: "https://www.nzbclub.com/nzbrss.aspx",
    replacement: "http://localhost:8100/nzbrss.aspx",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "https://campi-nas.net/nzbget",
    replacement: "http://localhost:8100/nzbget",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "https://campi-nas.net/sabnzbd",
    replacement: "http://localhost:8100/sabnzbd",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "https://api.nzb.su/api",
    replacement: "http://localhost:8100/api",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://findnzb.net/rss",
    replacement: "http://localhost:8100/rss",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://findnzb.net/nzb",
    replacement: "http://localhost:8100/nzb",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://www.binnews.in/new_rss",
    replacement: "http://localhost:8100/new_rss",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
});

gulp.task('remove-proxies', function() {
  replace({
    regex: "http://localhost:8100/nzbrss.aspx",
    replacement: "https://www.nzbclub.com/nzbrss.aspx",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/nzbget",
    replacement: "https://campi-nas.net/nzbget",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/sabnzbd",
    replacement: "https://campi-nas.net/sabnzbd",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/api",
    replacement: "https://api.nzb.su/api",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/rss",
    replacement: "http://findnzb.net/rss",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/nzb",
    replacement: "http://findnzb.net/nzb",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
  replace({
    regex: "http://localhost:8100/new_rss",
    replacement: "http://www.binnews.in/new_rss",
    paths: replaceFiles,
    recursive: false,
    silent: false
  });
});
