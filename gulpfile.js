const { src, dest, watch, series, parallel } = require("gulp")
const autoprefixer = require("autoprefixer"),
  concat = require("gulp-concat"),
  cssnano = require("cssnano"),
  postcss = require("gulp-postcss"),
  purge = require("gulp-css-purge"),
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  sass = require("gulp-sass")(require('sass')),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify")
var browserSync = require("browser-sync").create()
var path = require("path")

const APPNAME = process.cwd().split(path.sep).pop()

const FILES = {
  scssWatch: [
    "./stylesheets/*.scss",
    "./stylesheets/**/*.scss",
    //'!' + 'stylesheets/a/inline.scss', // to exclude any specific files
  ],
  cssPath: [
    // './css/main.css',
    // './css/normalize.css',
    "./node_modules/sanitize.css/sanitize.css",
    "./node_modules/sanitize.css/forms.css",
    // './node_modules/sanitize.css/typography.css',
    // './node_modules/sanitize.css/page.css',
    `./css/${APPNAME}.css`,
  ],
  jsPath: [
    "./js/plugins.js",
    "./node_modules/@elioway/adon/js/adon/adonHideOnScrollDown.js",
    "./node_modules/@elioway/adon/js/adon/adonHighLink.js",
    "./node_modules/@elioway/adon/js/adon/adonNavScrollTo.js",
  ],
  alsoWatch: ["./index.html", "./js/main.js"],
}

function scssTask() {
  return src("./stylesheets/judge.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(rename(`${APPNAME}.css`))
    .pipe(purge({ trim: false }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("css"))
}

function cssTask() {
  return src(FILES.cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat(`${APPNAME}.min.css`))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
}

function adonTask() {
  return src(FILES.jsPath)
    .pipe(concat("adons.js"))
    .pipe(dest("js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream())
}

function jsTask() {
  return src("./js/main.js")
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream())
}

function cacheBustTask() {
  let cbString = new Date().getTime()
  return src(["index.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."))
}

const build = parallel(series(scssTask, cssTask), adonTask, jsTask)

function watchTask() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  })
  watch(FILES.scssWatch.concat(FILES.alsoWatch).concat(FILES.jsPath), build).on(
    "change",
    browserSync.reload
  )
}

exports.build = series(build, cacheBustTask)

exports.default = series(build, watchTask)
