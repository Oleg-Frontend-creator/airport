'use strict';

const gulp = require("gulp");
const {series, parallel} = gulp;
const rename = require("gulp-rename");
const cleanCss = require("gulp-clean-css");
const concat = require('gulp-concat');
const merge = require('merge-stream');
const sass = require('gulp-sass')(require('sass'));
const minify = require('gulp-minify');

/**
 * Универсальная функция сборки стилей
 * @param {string} scssPath — путь к основному SCSS файлу
 * @param {Array} cssLibs — массив путей к библиотекам (CSS файлы)
 * @param {string} outputName — имя выходного файла (без .min)
 */
function buildStyles(scssPath, cssLibs, outputName) {
    const scssStream = gulp
        .src(scssPath)
        .pipe(sass().on("error", sass.logError));

    const libsStream = gulp.src(cssLibs);

    return merge(scssStream, libsStream)
        .pipe(concat(`${outputName}.css`))
        .pipe(cleanCss())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./../dist"));
}

gulp.task("styles-advantages", function () {
    return buildStyles(
        "./css/advantages.scss",
        [
             "./css/animate.min.css"
            ,"./css/swiper-bundle.min.css"
            , "./css/jquery-ui.min.css"
            , "./css/bootstrap.min.css"
        ],
        "advantages"
    );
});

gulp.task("styles-index", function () {
    return buildStyles(
        "./css/index.scss",
        [
            "./css/animate.min.css"
            , "./css/owl.carousel.min.css"
            , "./css/jquery-ui.min.css"
            , "./css/bootstrap.min.css"
        ],
        "index"
    );
});

gulp.task("styles", gulp.parallel("styles-advantages", "styles-index"));

gulp.task('scripts-index', function () {
    return buildScripts([
        "js/jquery-3.7.1.min.js",
        "js/imask.js",
        "js/bootstrap.bundle.min.js",
        "js/masonry.pkgd.min.js",
        "js/owl.carousel.min.js",
        "js/wow.min.js",
        "js/main.js"
    ], 'index');
});

gulp.task('scripts-advantages', function () {
    return buildScripts([
        "js/swiper-bundle.min.js",
        "js/jquery-3.7.1.min.js",
        "js/imask.js",
        "js/bootstrap.bundle.min.js",
        "js/masonry.pkgd.min.js",
        "js/wow.min.js",
        "js/main.js"
    ], 'advantages');
});

/**
 * Универсальная функция сборки скриптов
 * @param {Array} jsFiles — массив путей к скриптам в нужном порядке
 * @param {string} outputName — базовое имя выходного файла (без .min.js)
 */
function buildScripts(jsFiles, outputName) {
    return gulp.src(jsFiles)
        .pipe(concat(`${outputName}.js`))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('./../dist'));
}

gulp.task("scripts", gulp.parallel("scripts-advantages", "scripts-index"));

gulp.task('move-files', function () {
    return gulp.src([
        'index.html',
        'advantages.html',
        'mail-callback.php',
        'mail-doc-get.php'
    ])
        .pipe(gulp.dest('./../dist/'));
});

const build = series(
    'styles',
    'scripts',
    'move-files'
);

exports.build = build;
exports.default = build;