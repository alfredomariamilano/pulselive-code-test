// Require all necessary packages
const gulp     	       = require('gulp');
const babel    	       = require('gulp-babel');
const cleanCSS 	       = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const sass 	   	       = require('gulp-sass');
const autoprefixer     = require('gulp-autoprefixer');
const livereload       = require('gulp-livereload');
const flatten          = require('gulp-flatten');
const concat           = require('gulp-concat');
const order            = require('gulp-order');
const wait             = require('gulp-wait');
const del              = require('del');
const nodemon          = require('gulp-nodemon');
const plumber          = require('gulp-plumber');

// Set src and public to variables for re-use
const src  = 'src';
const dist = 'public';

// Take a main style.scss file in src/scss and build file with all imported partials, take comments out, allow compatibility with IE8 and above, flatten the file structure (might not be necessary in this specific case), use autoprefixer to extend css to all major browser with specific prefixes, create file in public/css and launch livereload
gulp.task('sass', () => {
  return gulp.src(`${src}/scss/style.scss`)
  .pipe(sass(sass()).on('error', sass.logError))
  .pipe(stripCssComments())
  .pipe(cleanCSS({ compatibility: 'ie8'}))
  .pipe(flatten())
  .pipe(autoprefixer())
  .pipe(gulp.dest(`${dist}/css`))
  .pipe(livereload());
});

// Take all Javascript files in all src sub-directories, translate them to ES2015, flatten the file structure, order them by user created and vendors, create a file with that order and send it to public/js. Wait before livereloading, because of large vendor files.
gulp.task('scripts', () => {
  return gulp.src(`${src}/**/*.js`)
  .pipe(plumber())
  .pipe(babel({
    presets: ['es2015'],
    compact: true,
    ignore: [
      '_bower.js'
    ]
  }))
  .pipe(flatten())
  .pipe(order([
    'app.js',
    '**/*.js'
  ]))
  .pipe(concat('app.js'))
  .pipe(gulp.dest(`${dist}/js`))
  .pipe(wait(1500))
  .pipe(livereload());
});

// Run other smaller, similar tasks
gulp.task('copy', [
  'copy:fonts',
  'copy:images',
  'copy:views'
]);

// Copy fonts from src to dist
gulp.task('copy:fonts', () => {
  return gulp.src(`${src}/**/*.{eot,svg,ttf,woff,woff2}`)
  .pipe(gulp.dest(dist));
});
// Copy images from src to dist
gulp.task('copy:images', () => {
  return gulp.src(`${src}/**/*.{png,gif,jpg,ico,jpeg}`)
  .pipe(gulp.dest(dist));
});
// Copy html from src to dist
gulp.task('copy:views', () => {
  return gulp.src(`${src}/**/*.html`)
  .pipe(plumber())
  .pipe(gulp.dest(dist))
  .pipe(livereload());
});

// Delete public
gulp.task('clean:public', () => {
  return del(['public/*'], {dot: true});
});

// Reload changes in the index.html
gulp.task('html', () => {
  return gulp.src('./index.html')
  .pipe(livereload());
});

// Watch changes in all previous tasks
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./index.html', ['html']);
  gulp.watch(`${src}/**/*.html`, ['copy:views']);
  gulp.watch(`${src}/**/*.js`, ['scripts']);
  gulp.watch(`${src}/**/*.scss`, ['sass']);
});

// Run nodemon
gulp.task('nodemon', () => {
  return nodemon({
    script: 'index.js'
  }).on('readable', () => {
    this.stdout.on('data', chunk => {
      if (/^listening/.test(chunk)) {
        livereload.reload();
      }
      process.stdout.write(chunk);
    });
  });
});

// Run default task in order
gulp.task('default', [
  'clean:public',
  'sass',
  'copy',
  'scripts',
  'watch',
  'nodemon'
]);
