'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cache');


gulp.task('sass', function(){
  return gulp.src('./scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 version', '> 5%', 'ie 8', 'ie 9'],
      cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('./build/'))
    .pipe(notify({message: 'Sass done'}));
});

gulp.task('compress', function(){
  gulp.src([
    'node_modules/moment/moment.js',
    'js/axios.js',
    'js/setupCalcs.js',
    'js/index.js',
    'js/getRecentFeeds.js',
    'js/estimateDueTime.js'
  ])
  .pipe(concat('production.js'))
  .on('error', notify.onError("Error: <%= error.message %>"))
  .pipe(gulp.dest('./build/'))
  .pipe(uglify())
  .on('error', notify.onError("Error: <%= error.message %>"))
  .pipe(rename({
      extname: ".min.js"
   }))
   .pipe(gulp.dest('./build/'))
   .pipe(notify({message: 'JS done'}));
});




gulp.task('watch', function(){

  gulp.watch('scss/**/*.scss', ['sass']);

  gulp.watch('js/**/*.js', ['compress']);

  livereload.listen();
  // Other watchers
  gulp.watch(['build/**']).on('change', livereload.changed);
  gulp.watch('**/*.html').on('change', livereload.reload);
});

gulp.task('default',['compress', 'sass']);
