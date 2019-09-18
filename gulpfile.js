const gulp = require('gulp');
const log = require('fancy-log');
const c = require('ansi-colors');
const sass = require('gulp-sass');
const imagemin = require('imagemin');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();


/* VARIABLES */
// Set local URL if using Browser-Sync
const LOCAL_URL = 'http://boulder.tom/';

const SOURCE = {

  scripts: 'js/src/**/*.js',

  // Scss files will be concantonated, minified if ran with --production
  styles: 'css/sass/**/*.scss',

  // Images placed here will be optimized
  images: 'assets/images/src/**/*',

  // HTML & PHP files
  html: '**/*.html',
  php: '**/*.php'
}

const ASSETS = {
  styles: 'css/',
  scripts: 'js/',
  images: 'assets/images/',
  all: 'assets/'
};

const JSHINT_CONFIG = {
  "node": true,
  "esversion": 6,
  "globals": {
    "document": true,
    "jQuery": true
  }
};

/* TASK COORDINATION */

// JSHint, concat, and minify JavaScript
gulp.task('scripts', function() {

  // Use a custom filter so we only lint custom JS
  const CUSTOMFILTER = filter(ASSETS.scripts + 'js/src/**/*.js', { restore: true });

  console.log(SOURCE.scripts);

  return gulp.src(SOURCE.scripts)
    .pipe(plugin.plumber(function(error) {
      log(c.red(error.message));
      this.emit('end');
    }))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.babel({
      presets: ["@babel/preset-env"],
      compact: true,
      ignore: ['what-input.js', 'what-input.min.js']
    }))
    .pipe(CUSTOMFILTER)
    .pipe(jshint(JSHINT_CONFIG))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(CUSTOMFILTER.restore)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
    .pipe(gulp.dest(ASSETS.scripts))
});


// Compile Sass, Autoprefix and minify
gulp.task('styles', function() {
  return gulp.src(SOURCE.styles)
    .pipe(plumber(function(error) {
      log(c.red(error.message));
      this.emit('end');
    }))
    .pipe(sass())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(ASSETS.styles))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Optimize images, move into assets directory
gulp.task('images', function() {
  return gulp.src(SOURCE.images)
    .pipe(imagemin())
    .pipe(gulp.dest(ASSETS.images))
});


// Browser-Sync watch files and inject changes
gulp.task('browsersync', function() {

  // Watch these files
  var files = [
    SOURCE.html,
  ];

  browserSync.init(files, {
    proxy: LOCAL_URL,
  });

  gulp.watch(SOURCE.styles, gulp.parallel('styles'));
  gulp.watch(SOURCE.scripts, gulp.parallel('scripts')).on('change', browserSync.reload);
  gulp.watch(SOURCE.images, gulp.parallel('images'));

});

// Run styles, scripts and foundation-js
//gulp.task('default', gulp.parallel('styles', 'scripts', 'images'));

/** Styles and scripts ONLY */
gulp.task('default', gulp.parallel('styles', 'scripts'));