/* eslint-disable no-undef */
'use strict';

const SASS_OUTPUT_STYLE = 'compressed';  // 'expanded' or 'compressed'

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });


gulp.task('sass', () => gulp.src(['src/**/*.scss'])
	.pipe($.plumber({
		errorHandler: function (err) {
			console.log(err.messageFormatted);
			this.emit('end');
		}
	}))
	.pipe($.sourcemaps.init())
	.pipe($.dartSass({ outputStyle: SASS_OUTPUT_STYLE }))
	.pipe($.autoprefixer({ remove: false }))
	.pipe($.rename({ extname: '.min.css' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./dist'))
	.pipe(gulp.dest('./docs/css'))
);

gulp.task('watch', () => {
	gulp.watch('src/**/*.scss', gulp.series('sass'));
});

gulp.task('build', gulp.parallel('sass'));

gulp.task('default', gulp.series('build', 'watch'));


// -----------------------------------------------------------------------------


gulp.task('docs-sass', gulp.series('sass', () => gulp.src(['docs/style.scss'])
	.pipe($.plumber({
		errorHandler: function (err) {
			console.log(err.messageFormatted);
			this.emit('end');
		}
	}))
	.pipe($.sourcemaps.init())
	.pipe($.dartSass({ outputStyle: 'compressed' }))
	.pipe($.autoprefixer({ remove: false }))
	.pipe($.rename({ extname: '.min.css' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./docs/css')))
);

// gulp.task('docs-js', gulp.series('js-with-option', () => gulp.src(['dist/js/stile-full.min.js', 'dist/js/stile-full.min.js.map'])
// 	.pipe($.plumber())
// 	.pipe(gulp.dest('./docs')))
// );

gulp.task('docs-watch', () => {
	// gulp.watch('src/js/**/*.js',     gulp.series('docs-js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('docs-sass'));
	gulp.watch('docs/*.scss',        gulp.series('docs-sass'));
});

gulp.task('docs-build', gulp.parallel('docs-sass'));

gulp.task('docs-default', gulp.series('docs-build', 'docs-watch'));

gulp.task('docs', gulp.parallel('default', 'docs-default'));
