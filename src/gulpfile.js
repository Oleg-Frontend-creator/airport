'use strict';

const gulp = require("gulp");
const rename = require("gulp-rename");

//сборка всех css-файлов (наших стилей и библиотек) в один минифицированный css-файл
const cleanCss = require("gulp-clean-css");
const concatCss = require('gulp-concat-css');

gulp.task('concat-styles', function () {
    return gulp.src([
         "./css/advantages.css"
        ,"./css/style.css"
        , "./css/swiper-bundle.min.css"
        , "./css/animate.min.css"
        , "./css/owl.carousel.min.css"
        , "./css/jquery-ui.min.css"
        , "./css/bootstrap.min.css"
    ])
        .pipe(concatCss("dist/style.css"))
        .pipe(
            rename(function (file) {
                file.basename = file.basename + ".min";
            })
        )
        .pipe(cleanCss())
        .pipe(gulp.dest("./../"));
});

// сборка и минификация js-файлов
const concat = require('gulp-concat');
const minify = require('gulp-minify');
gulp.task('concat-scripts-index', function () {
    return gulp.src([
        "js/wow.min.js"
        , "js/jquery-3.7.1.min.js"
        , "js/jquery-ui.min.js"
        , "js/bootstrap.min.js"
        , "js/imask.js"
        , "js/bootstrap.bundle.min.js"
        , "js/mixitup.min.js"
        , "js/masonry.pkgd.min.js"
        , "js/owl.carousel.min.js"
        , "js/main.js"
    ])
        .pipe(concat('index.js'))
        .pipe(minify())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./../dist'));
});

gulp.task('concat-scripts-advantages', function () {
    return gulp.src([
        "js/wow.min.js"
        , "js/swiper-bundle.min.js"
        , "js/jquery-3.7.1.min.js"
        , "js/jquery-ui.min.js"
        , "js/bootstrap.min.js"
        , "js/imask.js"
        , "js/bootstrap.bundle.min.js"
        , "js/mixitup.min.js"
        , "js/masonry.pkgd.min.js"
        , "js/main.js"
    ])
        .pipe(concat('advantages.js'))
        .pipe(minify())
        .pipe(rename('advantages.min.js'))
        .pipe(gulp.dest('./../dist'));
});

gulp.task('move-files', function () {
    return gulp.src([
        'index.html',
        'advantages.html',
        'gulpfile.js',
        'package.json',
        'mail-callback.php',
        'mail-doc-get.php'
    ])
        .pipe(gulp.dest('./../dist/'));
});