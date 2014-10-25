var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserify  = require('gulp-browserify');
var sass        = require('gulp-sass');
var rename      = require('gulp-rename');

gulp.task('scripts', function () {
    'use strict';
    return gulp.src('./src/js/main.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(rename('brandwatch.wordcloud.bundled.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('styles', function () {
    'use strict';
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default', function() {
    'use strict';
    gulp.run('scripts');
    gulp.run('styles');

    gulp.watch(['./src/js/**/*.js', './src/scss/**/*.scss'], function () {
        gulp.run('scripts');
        gulp.run('styles');
    });
});
