var clickEvent = isAndroid()?'tap':'click';
$(function () {
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });
    //评价星级
    $('.star').each(function (index) {
        var $el = $(this);

        for(var i = 0; i < 5; i++) {
            $el.append('<span></span>');
        }

        if($el.data('size') == "max") {
            $el.addClass('max');
        }

        //绑定事件
        $el.children('span').on('click', function () {
            var $child = $(this);

            $child.nextAll('span').removeClass('active');
            $child.prevAll('span').addClass('active');
            $child.addClass('active');

            //存储
            $child.siblings('input').val($el.children('span.active').length);
        });

        //第一次点击综合评价
        if(index == 0) {
            $el.children('span').one('click.action', function () {
                $(this).parents('.item').nextAll().show();
                $('.custom').show();
                $('.btn-group').show();
            });
        }

        //开启标签
        $el.children('span').one('click.tag', function () {
            $(this).parent().next('.tag').show();
        });
    });


    //展开收起行程信息
    $('.journey-container').css({
        'height':$('.journey-container').height()
    });
    $('.journey-container').data('height',$('.journey-container').height());
    $('.switch-box').on(clickEvent,function () {
        var showFlag = $(this).data('show');
        var heightJour = $('.journey-container').data('height');
        if(showFlag){
            $('.journey-container').css({
                'height':0,
            });
            $(this).data('show',false);
            $(this).find('i').css({
                'transform':'rotate(0deg)',
                '-ms-transform':'rotate(0deg)',
                '-moz-transform':'rotate(0deg)',
                '-webkit-transform':'rotate(0deg)',
                '-o-transform':'rotate(0deg)',
            })
        }else{
            $('.journey-container').css({
                'height':heightJour,
            });
            $(this).data('show',true);
            $(this).find('i').css({
                'transform':'rotate(180deg)',
                '-ms-transform':'rotate(180deg)',
                '-moz-transform':'rotate(180deg)',
                '-webkit-transform':'rotate(180deg)',
                '-o-transform':'rotate(180deg)',
            })
        }
    });

    // 展开的更多点击事件
    $('.more-service-container ul li').on(clickEvent,function () {
        $(this).addClass('active').siblings().removeClass('active');
        var className = $(this).attr('class');
        if(className.indexOf('share-btn') != -1){
            // /分享
        }
    });
});
//评价tag的选中/取消
$('.tag span').on('click', function () {
    var $el = $(this),
        $input = $el.siblings('input');
    var _value = $el.data('value'),
        _VAL = $input.val();

    //选中 或 取消
    if(!$el.data('lock')) {
        $el.data('lock', true);
        $el.addClass('active');

        //add
        if($.trim(_VAL) == "") {
            $input.val(_value);
        } else if($input.val().indexOf(_value) < 0) {
            $input.val(_VAL + "," + _value);
        }
    } else {
        $el.data('lock', false);
        $el.removeClass('active');

        //remove
        var _index = $input.val().indexOf(_value);
        if(_index >= 0) {
            var reg = "";
            if(_index == 0) {
                reg = new RegExp(_value + ",?", "gi");
            } else {
                reg = new RegExp(",?" + _value, "gi");
            }

            _VAL = _VAL.replace(reg, "");
            $input.val(_VAL);
        }
    }
});

$('.close').on(clickEvent,function () {
    $('.bottom-container').hide();
});

//更多收起展开
$('#moreBtn').on(clickEvent,function () {
    $('.more-service-container').show();
    $('.btn-group').hide();
});
$('.close-more-service').on(clickEvent,function () {
    $('.more-service-container').hide();
    $('.btn-group').show();
});

//价格详情
$('.bottom-container .detail').on(clickEvent,function () {
    $('.price-detail-container').popup('push');
});
//价格详情关闭
$('#closeButton').on(clickEvent,function () {
    $('.price-detail-container').closePopup();
});

//分享行程
$('#share').on('click', function () {
    //隐藏更多操作
    $('#more').removeClass('open').data('state', 'close');
    $('.more-modal').hide();
    $('.share-box').show();
});
$('.share-box').on('click', function () {
    $(this).hide();
});
$('.share-tips').on('click', function () {
    return false;// 阻止事件冒泡
})

