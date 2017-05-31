//引入gulp
var gulp = require('gulp');
var jshint = require('gulp-jshint'); //js检测
var uglify = require('gulp-uglify'); //js混淆压缩
var csso = require('gulp-csso');//css压缩
var autoprefixer = require('gulp-autoprefixer'); //自动添加私有变量前缀

const logError = (stream) => {
  stream.on('error', function(error) {
    console.error(error)
  })
  this.emit('end')
  return stream
}

//代码检测
gulp.task('lintJs',function(){
	return gulp.src('src/js/*.js')
		pipe(jshint({
			"undef": false,
      		"unused": false
		}))
		.pipe(jshint.reporter('default')); //错误高亮提示
})

/* 发布js到指定目录*/
var lintJsSrc = 'src/js/*.js';//js源代码目录
var jsDest = 'public/js/';//输出目录

//压缩js
gulp.task('miniJs', function(){
  gulp.src(lintJsSrc)
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

//不压缩js直接输出
gulp.task('distJs',function(){
  gulp.src(lintJsSrc)
    .pipe(gulp.dest(jsDest)); 
})

/*发布css到指定目录*/
var cssSrc = 'src/css/*.css'; //css的源目录
var cssDest = 'public/css/';
//压缩CSS
gulp.task('miniCss', function(){
  gulp.src(cssSrc)
    //.pipe(sass()) //需要启用sass的时候在去掉注释
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: true    
    }))
    .pipe(csso())
    .pipe(gulp.dest(cssDest));
});
//不压缩css，直接输出
gulp.task('distCss', function(){
  gulp.src(cssSrc)
    .pipe(gulp.dest(cssDest));
});



//基本开发所需
gulp.task('devOne', ['lintJs','distJs','distCss']);

//开发构建
gulp.task('dev',['devOne'],function(){
    gulp.watch("src/**",['devOne']);
});

//正式构建
gulp.task('build', ['lintJs','miniJs','miniCss']);

//默认情况下为正式构建
gulp.task('default', ['build']);