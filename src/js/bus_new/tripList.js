$(function () {
    $('.checking').off('click').on('click',function () {
        var checkType = $(this).data('check-type');
        console.log('checkType:'+checkType);
        if(checkType == '1'){
            //动态电子票 动画完成后跳转到验票页面
            handleTicket($(this),2,function () {
                console.log('成功')
            })
        }else if(checkType == '2'){
            // 非动态电子票 直接跳转到验票页面

        }
    })
});

/** 长按解锁车票
*
* param：
*   el：元素
*   count：时长
*   callback：成功后回调函数
* */
function handleTicket(el, count, callback) {
    /*
    * 创建图层
    * */
    var _html = '<div class="deblocking">' +
        '<div class="main">' +
        '<div class="progress"><span class="bar"></span></div>' +
        '<div class="content">' +
        '<h4>长按图片' + count + '秒钟，解锁车票</h4>' +
        '<p>车票解锁后将不能退款，请慎重操作</p>' +
        '<div class="thumb longTap"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('body').append(_html);

    /*
    * 关闭弹出层
    * */
    $('.deblocking').off('click').on('click', function (e) {
        if($(e.target).hasClass('deblocking')) {
            $('.deblocking').hide(0, function () {
                $('.deblocking').remove();
            });
        }
    });

    /*
    * signal    最长时间
    * step      步长
    * timeAuto  计时器
    * */
    var _self = el;
    var signal = count * 10,
        step = 100 / signal;
    var timeAuto = null;

    //时间
    if(!_self.data('time')) {
        _self.data('time', 0);
    } else if(_self.data('time') == signal) {
        //已解锁
        $('.progress').show();
        progress(_self.data('time'));
        return false;
    }

    var time = _self.data('time');

    $('.deblocking .longTap').on('touchstart', function (e) {
        //如果已经解锁车票，则不触发
        if(!_self.data('lock')) {
            e.preventDefault();

            //初始化，并计时
            time = 0;

            timeAuto = setInterval(function () {
                //到达最长时长，则隐藏进度条
                if(time > signal) {
                    clearInterval(timeAuto);
                    success();
                }

                time++;
                progress(time);

                //持续时间超过100毫秒才展示
                if(time > 1) {
                    $('.progress').show();
                }
            }, 100);
        }
    }).on('touchend', function () {
        if(!_self.data('lock')) {
            clearInterval(timeAuto);

            //时长少于n秒，则回退到0秒
            if(time < signal) {
                time = 0;
                progress(time);
                $('.progress').hide();
            } else {
                success();
            }
        }
    });

    /*
    * 进度条
    * */
    function progress(t) {
        $('.progress .bar').width(t * step + '%');
    }

    /*
    * 完成
    * */
    function success() {
        time = signal;
        progress(time);
        _self.data('time', signal);
        _self.data('lock', true);

        if(callback instanceof Function) {
            callback();
        }
    }
}
