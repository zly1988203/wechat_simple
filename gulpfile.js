/*
 ** package(包管理)
 *
 *      gulp-plumber:  错误捕捉
 *       gulp-uglify:  js压缩
 *       gulp-rename： 文件名修改
 *         gulp-less： less编译
 *      gulp-postcss： css预处理器
 *      gulp-cssnano： css压缩
 *      autoprefixer： css自动前缀
 *  gulp.spritesmith:  雪碧图（图片合并）
 *     gulp-imagemin:  图片压缩
 *      browser-sync:  浏览器监控
 *
 **
 */
var path            = require('path');
var gulp            = require('gulp');
var plumber         = require('gulp-plumber'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    less            = require('gulp-less'),
    postcss         = require('gulp-postcss'),
    cssnano         = require('gulp-cssnano'),
    autoprefixer    = require('autoprefixer'),
    spritesmith     = require('gulp.spritesmith'),
    imagemin        = require('gulp-imagemin');

//默认配置
var globalOption        = require('./.browsersyncdef');
var res                 = globalOption.res;
var browsersyncConfig   = globalOption.browsersyncConfig;
var spriteConfig        = globalOption.spriteConfig;

//帮助
gulp.task('help', function() {
    console.log('	gulp js 				js优化');
    console.log('	gulp less 				less优化');
    console.log('	gulp sprite 				雪碧图');
    console.log('	gulp image 				图片优化');
    console.log('	gulp watch 				监控静态资源');
    console.log('	gulp browsersync 			监控文件变化，并自动注入浏览器，无需刷新');
    console.log('	gulp help 				gulp帮助');
});

//js优化
gulp.task('js', function (arg) {
    var arr = Object.assign({
        src: res.src.jssrc,
        dest: res.dest.jsdest
    }, arg);

    return action(arr.src, arr.dest, 'js');
});

//less转换为css
gulp.task('less', function(arg) {
    var arr = Object.assign({
        src: res.src.lesssrc,
        dest: res.dest.lessdest
    }, arg);

    return action(arr.src, arr.dest, 'less');
});

//合并多张图片，并保存为新的图，输出样式
gulp.task('sprite', function() {
    return action(spriteConfig.src, spriteConfig.dest, 'sprite');
});

//图片优化
gulp.task('image', function(arg) {
    var arr = Object.assign({
        src: res.src.imagesrc,
        dest: res.dest.imagedest
    }, arg);

    return action(arr.src, arr.dest, 'image');
});

/*
* 执行
* */
function action(src, dest, type) {
    if(!fileFilter(src)) {
        return gulp.src(src)
                    .pipe(plumber())
                    .pipe(function () {
                        var streams = null;

                        if (type == 'less') {
                            streams = less();
                            streams.pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
                                .pipe(cssnano({
                                    zindex: false,
                                    autoprefixer: false,
                                    discardComments: {discardComments: true},
                                    normalizeCharset: false
                                }));
                        } else if (type == 'image') {
                            streams = imagemin();
                        } else if (type == 'sprite') {
                            streams = spritesmith(spriteConfig.options);
                        } else if (type == 'js') {
                            streams = uglify();
                            streams
                                .pipe(rename({
                                suffix: '.min'
                            }));
                        }

                        return streams;
                    }())
                    .pipe(gulp.dest(dest));
    } else {
        return gulp;
    }
}

/*
* 过滤文件
* */
function fileFilter(src) {
    var fs = require('fs');
    var srcStat = fs.lstatSync(src);

    if(!srcStat.isDirectory() && !srcStat.isFile()) {
        throw new Error('not find file or directory');
    } else {
        var srcRelative = path.resolve(src).replace(/(\/|\\)/gi, "_");
    }

    var result = false;

    try {
        res.filter.forEach(function (item, index) {
            var stat = fs.lstatSync(item);

            if(stat.isDirectory() || stat.isFile()) {
                var iRelative = path.resolve(item).replace(/(\/|\\)/gi, "_");

                if(srcRelative == iRelative || srcRelative.match(new RegExp(iRelative, "gi")).length > 0) {
                    result = true;
                    throw new Error('StopIteration');
                }
            }
        });
    } catch (e) {}

    return result;
}

/*
 **	监测文件变动
 *
 *	package：  gulp-watch、gulp-clean
 *	    ext：  js、less、jpg|png|gif|jpeg|bmp
 *	     fn：  js、less、image
 *	  event：  change（修改文件）、add（添加文件）、unlink（删除文件）
 *	     cb：  browsersync
 *
 **
 */
gulp.task('watch', function(files, cb) {
    var watch = require('gulp-watch');
    var wFiles = [res.src.lesssrc, res.src.jssrc, res.src.imagesrc];

    if(files) {
        if(typeof(files) == 'string' || files instanceof Array) {
            wFiles = files;
        }
    }

    //图片格式
    var imgTypes = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];

    //监听文件
    var watcher = watch(wFiles, {
        persistent: true
    });

    //增加文件
    watcher.on('add', function(vinyl) {
        addChangeHanle(vinyl);
        console.log(vinyl + ' was add...');
    });

    //修改文件
    watcher.on('change', function(vinyl) {
        addChangeHanle(vinyl);
        console.log(vinyl + ' was change...');
    });

    //增加和修改
    function addChangeHanle(vinyl) {
        var grc = null;
        var pf = pathFormat(vinyl, { compile: true });
        grc = pf.grc;

        if(typeof(cb) == 'function') {
            if(pf.ext == 'html') {
                cb();
            } else {
                grc && grc.on('end', cb);
            }
        }
    }

    //删除文件
    watcher.on('unlink', function(vinyl) {
        var grc = null;
        var pf = pathFormat(vinyl);
        var filePath = pf.filePath;

        if(filePath != '') {
            var clean = require('gulp-clean');

            grc = gulp.src(filePath);
            grc.pipe(clean());
            console.log(vinyl + ' was unlink...');
            console.log(filePath + ' was unlink...');
        }

        if(typeof(cb) == 'function') {
            if(pf.ext == 'html') {
                cb();
            } else {
                grc && grc.on('end', cb);
            }
        }
    });

    // 格式路径
    function pathFormat(p, opt) {
        var options = Object.assign({
            compile: false
        }, opt);

        var vinyl = p;
        var pathParse = path.parse(vinyl);
        var ext = pathParse.ext.slice(1);
        var distPath = '', filePath = '';
        var grc = null;

        switch(ext) {
            case 'less':
                distPath = pathParse.dir.replace(res.src.lesssrc, res.dest.lessdest);
                filePath = path.join(distPath, pathParse.name + '.css');
                options.compile && (grc = gulp.tasks.less.fn({src: vinyl, dest: distPath}));
                break;
            case 'js':
                distPath = pathParse.dir.replace(res.src.jssrc, res.dest.jsdest);
                filePath = path.join(distPath, pathParse.name + '.min.js');
                options.compile && (grc = gulp.tasks.js.fn({src: vinyl, dest: distPath}));
                break;
            default:
                if(imgTypes.indexOf(ext) != -1) {
                    ext = 'image';
                    distPath = pathParse.dir.replace(res.src.imagesrc, res.dest.imagedest);
                    filePath = path.join(distPath, pathParse.base);
                    options.compile && (grc = gulp.tasks.image.fn({src: vinyl, dest: distPath}));
                }
        }

        var F = {
            vinyl: vinyl,
            pathParse: pathParse,
            distPath: distPath,
            filePath: filePath,
            ext: ext,
            grc: grc
        };

        return F;
    }
});

/*
 **	浏览器监控
 *	
 *	可以设置server（本地服务器）
 *	以指定路径(baseDir)下的页面(index)为静态服务器打开浏览器
 *	监控页面(index)，页面变化则自动刷新
 *	也可以通过proxy(代理)
 *
 **
 */
gulp.task('browsersync', function() {
    var browsersync = require('browser-sync');
    var bs = browsersync.create();
    bs.init(browsersyncConfig.init);

    gulp.tasks.watch.fn(browsersyncConfig.files, bs.reload);
});

//帮助
gulp.task('default', ['help']);

//test
gulp.task('test', function() {
    //TODO
});

gulp.task('start', ['browsersync']);