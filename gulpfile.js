/**
 * Quick gulpfile to handle building of the application.
 *
 * Chosen to use:
 * - browserify for javascript concatenation
 * - scss for styling
 * - mocha-phantomjs for test running
 * - uglify2 for js compression
 */
var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserify  = require('gulp-browserify');
var sass        = require('gulp-sass');
var rename      = require('gulp-rename');
var mocha       = require('gulp-mocha-phantomjs');
var uglify      = require('gulp-uglify');

/**
 * Job to build all javascript down to a single
 * file. The wordcloud component has been created
 * so that it can be included in any site with very
 * little boilerplate, but in the interest of making
 * this example nice and simple, I've shoved it in
 * with the rest of the scripts.
 */
gulp.task('scripts', function () {
    'use strict';
    return gulp.src('./src/js/main.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(uglify())
        .pipe(rename('brandwatch.wordcloud.bundled.js'))
        .pipe(gulp.dest('./public/js'));
});

/**
 * Simply compile and copy across any scss files
 * to the public directory.
 */
gulp.task('styles', function () {
    'use strict';
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

/**
 * Simple execution of tests so that you can
 * see super fast if you've done something
 * terrible and also awful and also wrong.
 *
 * Runs every time a js or scss file is saved
 * just for that extra reminder that you're
 * doing it wrong.
 */
gulp.task('tests', function () {
    'use strict';
    return gulp.src('./test/test.html')
        .pipe(mocha());
});

/**
 * Default task which is executed on the gulp
 * command. It does a one-off build of everything
 * and then watches any js or scss files for
 * changes, kicking off the build again.
 */
gulp.task('default', function() {
    'use strict';
    gulp.run('scripts');
    gulp.run('styles');
    gulp.run('tests');

    gulp.watch(['./src/js/**/*.js', './src/scss/**/*.scss'], function () {
        gulp.run('scripts');
        gulp.run('styles');
        gulp.run('tests');
    });
});
