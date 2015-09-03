//Modules 호출
var gulp = require('gulp'),
		csslint = require('gulp-csslint'),
		concatcss = require('gulp-concat-css'),
		uglifycss = require('gulp-uglifycss'),
		jshint = require('gulp-jshint'),
		stylish = require('jshint-stylish'),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		gulpif = require('gulp-if'),
		del = require('del'),
		config = require('./config.json');



/*
** 폴더 / 파일 제거 
** del(['dist/*','!dist/dont-delete.js']) 명령어를 수행한면 해당 디렉터리에서 ...js를 제외하고 삭제된다. 
*/
gulp.task('clean', function() {
	del(['dist/*']);
});


/*
** css
** npm 설치 모듈 : gulp-csslint, gulp-concat-css, gulp-uglifycss
** 문법 검사 > 병합 > 압축  
** css 찹축하지 않은 팡리과 압축한 파일로 출력 설정하기 
*/
gulp.task('styles', function() {
	gulp.src(config.path.css.src)
		// css 문법 검사
		.pipe(gulpif(config.lint, csslint({'import' : false}))) 
		.pipe(gulpif(config.lint, csslint.reporter()))
		//파일 병합 
		.pipe(gulpif(config.concat, concatcss(config.path.css.filename)))
		//압축하지 않은 파일 출력 
		.pipe(gulpif(config.rename, gulp.dest(config.path.css.dest)))
		//압축 
		.pipe(gulpif(config.uglify, uglifycss())) 
		//압축한 파일 이름 바꿔 출력
		.pipe(gulpif(config.rename, rename({suffix: '.min'})))
		.pipe(gulp.dest(config.path.css.dest)); 
});

/*
** Javascript
** 문법검사 > 병합 > 압축 
*/
gulp.task('scripts',['js:hint','js:concat','js:uglify']);

// JS 문법 검사 
gulp.task('js:hint',function(){
	gulp.src(config.path.js.src)
		.pipe(gulpif(config.lint, jshint()) )
		.pipe(gulpif(config.lint, jshint.reporter(stylish)) );
});

// JS 병합 
gulp.task('js:concat',function(){
	gulp.src(config.path.js.src)
		.pipe(gulpif(config.concat, concat(config.path.js.filename)) )
		.pipe(gulpif(config.rename, gulp.dest(config.path.js.dest)) );
});

// JS 압축  
gulp.task('js:uglify',function(){
	gulp.src(config.path.js.dest + config.path.js.src)
		.pipe(uglify({
		}))
		.pipe(gulpif(config.rename, rename( { sufix: '.min' } )) )
		//gulp-rename 모듈로 압축 비압축 파일 출력하기 evernote 참조
		.pipe(gulp.dest(config.path.js.dest));
});
/*
** 이전과 달리 rename() 내부에 변경할 파일 이름을 직접 입력하는 것이 아니라, 옵션 형태로 접미사값을 .min으로 설정. 파일 이름을 어떻게 변경하든 사용자가 매번 변경할 파일 이름 값을 수정하지 않게 하려고 변경할 파일 이름을 직접 입력하는 대신 옵션으로 설정한 것. 
** 
*/

//Gulp.task()를 사용해 기본(Default) 테스크 정의
gulp.task('default',['clean','styles','scripts']);
/*
**디렉터리를 정리한 후 조합한 업무를 기본 업무로 정의할 수 있다.
*/
//지속적으로 관찰(Watch) 업무 정의
gulp.task('watch',['clean'], function() {
	gulp.watch(config.path.css.src, ['styles']);
	gulp.watch(config.path.js.src, ['scripts']);
});