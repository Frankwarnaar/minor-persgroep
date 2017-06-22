const babelify	  = require('babelify');
const browserSync = require('browser-sync');
const browserify  = require('browserify');
const buffer      = require('vinyl-buffer');
const clean       = require('gulp-clean');
const gulp        = require('gulp');
const gulpif      = require('gulp-if');
const gutil       = require('gulp-util');
const nodemon     = require('gulp-nodemon');
const plumber     = require('gulp-plumber');
const sass        = require('gulp-sass');
const sequence    = require('run-sequence');
const source      = require('vinyl-source-stream');
const sourcemaps  = require('gulp-sourcemaps');
const watchify    = require('watchify');
const responsive  = require('gulp-responsive');
const webp        = require('gulp-webp');
const cleancss    = require('gulp-clean-css');
const uglify      = require('gulp-uglify');

/* ============================================================
Configuration
============================================================ */

const config = {
	assetsPath: 'src/client',
	distPath: 'dist',
	debug: true,
	nodemon: {
		port: 4000,
		appPath: 'src/server/app.js',
		watch: 'src/server/'
	},
	browserSync: {
		port: 4001
	}
};

gulp.task('disable-debug', () => {
	config.debug = false;
});

/* ============================================================
	Main tasks
   ============================================================ */

gulp.task('default', () => {
	sequence(['watch', 'server'], ['browser-sync']);
});

gulp.task('build', () => {
	sequence(['clean', 'disable-debug'], ['styles', 'watchify', 'images']);
});

gulp.task('clean', () => {
	return gulp.src(config.distPath, {read: false})
		.pipe(clean());
});

/* ============================================================
	Server
   ============================================================ */

gulp.task('server', cb => {
	return nodemon({
		script: config.nodemon.appPath,
		watch: config.nodemon.watch
	}).once('start', cb);
});

/* ============================================================
	Watch
   ============================================================ */

gulp.task('watch', ['watch:html', 'watchify', 'watch:styles']);

gulp.task('watch:styles', ['styles'], () => {
	return gulp.watch([`${config.assetsPath}/styles/*`, `${config.assetsPath}/styles/**`, `${config.assetsPath}/styles/**/**`], ['styles']);
});

gulp.task('watch:html', () => {
	return gulp.watch(['src/server/views/*', 'src/server/views/**/*']).on('change', browserSync.reload);
});
/* ============================================================
	Error handler
   ============================================================ */

const handleError = err => {
	gutil.log(err);
	browserSync.notify('An error occured!');
};

/* ============================================================
	Less
   ============================================================ */

gulp.task('styles', () => {
	return gulp.src(config.assetsPath + '/styles/style.scss')
		.pipe(sass())
		.pipe(gulpif(config.debug, sourcemaps.init()))
		.pipe(plumber({
			errorHandler: handleError
		}))
		.pipe(gulpif(!config.debug, cleancss()))
		.pipe(gulpif(config.debug, sourcemaps.write('./')))
		.pipe(gulp.dest(config.distPath + '/css'))
		.pipe(browserSync.stream());
});

/* ============================================================
	Javascript
   ============================================================ */

gulp.task('watchify', () =>  {
	const props = {
		entries: [config.assetsPath + '/js/app.js'],
		debug: config.debug,
		cache: {},
		packageCache: {}
	};

	const bundler = config.debug ? watchify(browserify(props)) : browserify(props);
	bundler.transform(babelify, {presets: ['es2015-without-strict']});

	function rebundle() {
		const stream = bundler.bundle();
		return stream.on('error', handleError)
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: config.debug
			}))
			.pipe(gulpif(!config.debug, uglify()))
			.pipe(gulpif(config.debug, sourcemaps.write('./')))
			.pipe(gulp.dest(config.distPath + '/js/'))
			.pipe(browserSync.stream());
	}

	bundler.on('update', () => {
		rebundle();
		gutil.log('Rebundle...');
	});

	return rebundle();
});

/* ============================================================
	Browser-sync
   ============================================================ */

gulp.task('browser-sync', () => {
	browserSync.init({
		proxy: `http://localhost:${config.nodemon.port}`,
		port: config.browserSync.port,
		files: `${config.distPath}/**/*.{js, css}`
	});
});

/*  ============================================================
	Image compression
	============================================================ */
gulp.task('images', ['images:svg', 'images:responsive']);

gulp.task('images:svg', () => {
	gulp.src(`${config.assetsPath}/img/**/*.svg`)
		.pipe(gulp.dest(`${config.distPath}/img`));
});

gulp.task('images:responsive', () => {
	gulp.src(config.assetsPath + '/img/**/*.{png, jpg, jpeg}')
	.pipe(responsive({
		'logos/*': {
			height: 87
		},
		'app-icons/*': [
			{
				width: 256
			}, {
				width: 128,
				rename: {
					suffix: '-sm'
				}
			}
		]
	}, {
		quality: 70,
		progressive: true,
		compressionLevel: 6,
		withMetadata: false
	}))
	.pipe(gulp.dest(`${config.distPath}/img`))
	.on('end', () => {
		gulp.run('images:webp');
	});
});

gulp.task('images:webp', () => {
	gulp.src([`${config.distPath}/img/**/*`])
		.pipe(webp())
		.pipe(gulp.dest(`${config.distPath}/img`));
});