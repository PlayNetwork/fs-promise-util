import babel from 'gulp-babel';
import coveralls from 'gulp-coveralls';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import istanbul from 'gulp-istanbul';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('clean', () => {
	return del([
		'dist'
	]);
});

gulp.task('build', ['clean'], () => {
	return gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-reports', () => {
		return del('reports', { force : true });
	});


gulp.task('coveralls', ['test-coverage'], function () {
	return gulp
		.src('reports/lcov.info')
		.pipe(coveralls());
});

gulp.task('test-coverage', ['build'], function () {
	return gulp
		.src(['./dist/**/*.js'])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			gulp
				.src(['./test/**/*.js'])
				.pipe(mocha({ reporter : 'spec' })
						.on('error', function (err) {
							if (err.showStack) {
								gulpUtil.log(err);
							}

							/* eslint no-invalid-this:0 */
							this.emit('end');
						}))
				.pipe(istanbul.writeReports('./reports'));
		});
});


gulp.task('lint', () => {
	return gulp
		.src(['gulpfile.babel.js', 'src/**/*.js', 'test/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});
