var gulp = require('gulp'),                                 
    browserSync = require('browser-sync'),                  
    sass = require('gulp-sass'),                            
    sourcemap = require("gulp-sourcemaps"),                
    del = require('del'),                                   
    remane = require('gulp-rename'),                        
    replace = require('gulp-replace'),                     
    mediaQueries = require('gulp-group-css-media-queries'), 
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer");

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('clean', function (done) {
    del.sync('dist');
    done();
});

gulp.task('css', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(mediaQueries())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('video', function () {
    return gulp.src('app/video/*.**')
        .pipe(gulp.dest('dist/video'));
});

gulp.task('build-dist', function (done) {
    var buildImg = gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));

    var buildFonts = gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'));

    done();
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));  //  Запускаем задачи в режиме разработки командой gulp
gulp.task('build', gulp.series('clean', 'css', 'js', 'video', 'html', 'build-dist'));   //  Собираем проект для продакшена командой gulp build