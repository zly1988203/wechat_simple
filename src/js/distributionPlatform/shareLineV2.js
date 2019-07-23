var dateScroll = null;
var clickEvent = isAndroid()?'tap':'click';
$(function () {
    /*更多方式*/
    $('.more').on(clickEvent,function () {
        $('#more_popup').show();
    });
    /*复制链接*/
    copyUrl();

    /*html2canvas(document.getElementById('poster')).then(function(canvas) {
        $('#canvas-box').append(canvas);
        createImage();
    });*/

    dateScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });

    // //默认选中第一个
    $('#wrapper ul li:first').trigger(clickEvent);
});

/*海报切换*/
$('.switch .item').off(clickEvent).on(clickEvent,function () {
    // $.showLoading();
    var _index = $(this).data('index');
    var _poster_bg = $('#poster_bg_lines');
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    if(_index == '1'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-1-1.png');//海报背景切换
    }else if(_index == '2'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-2-1.png');
    }else if(_index == '3'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-3-1.png');
    }else if(_index == '4'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-4-1.png');
    }else if(_index == '5'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-5-1.png');
    }else if(_index == '6'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-6-1.png');
    }else if(_index == '7'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-7-1.png');
    }else if(_index == '8'){
        $(_poster_bg).attr('src','../../dist/images/distribution/v2/poster-bg-8-1.png');
    }
    changePosterTheme(_index);
    /*$('#img-box').empty();
    $('#poster').css("display","block");
    $('#canvas-box').empty();
    //TODO 生成对应的海报
    html2canvas(document.getElementById('poster')).then(function(canvas) {
        $('#canvas-box').append(canvas);
        createImage();
    });*/
    dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
});

function changePosterTheme(index) {
    var selector = $('.poster-container');
    var className = 'poster-container poster-' + index;
    $(selector).attr('class',className);
}

/*收益须知*/
$('.notice .notice-btn').off(clickEvent).on(clickEvent,function () {
    $('#notice_popup').show();
});
/*关闭更多方式和收益须知*/
$('.close-btn').on(clickEvent,function () {
    $('.popup-container').hide();
});

//从canvas中提取图片image
function convertCanvasToImage(canvas) {
    //新Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
    // 指定格式PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}

/*复制链接*/
function copyUrl() {
    var clipboard = new ClipboardJS('.copy-btn', {
        target: function() {
            return document.querySelector('#hunterUrl');
        }
    });
    clipboard.on('success', function(e) {
        $.toastSuccess('复制成功')
        $('#hunterUrl').addClass('copy-s');
        console.log(e);
    });
    clipboard.on('error', function(e) {
        $.toastSuccess('复制失败，请刷新页面重新复制')
        $('#hunterUrl').removeClass('copy-s')
        console.log(e);
    });
}

function createImage() {
    //获取网页中的canvas对象
    var mycanvas1 = $('#canvas-box canvas')[0];
    //将转换后的img标签插入到html中
    var img = convertCanvasToImage(mycanvas1);
    $('#poster').css("display","none");
    $('#img-box').empty();
    $('#img-box').append(img);//imgDiv表示你要插入的容器id
    $.hideLoading();
}

$('.OR-box').on('click',function () {
   $('.OR-content').css({'transform': 'scale(1.44)','-ms-transform': 'scale(1.44)','-o-transform': 'scale(1.44)','-moz-transform': 'scale(1.44)','-webkit-transform': 'scale(1.44)'});
   $('.OR-content p').css({'transform': 'scale(0.69)','-ms-transform': 'scale(0.69)','-o-transform': 'scale(0.69)','-moz-transform': 'scale(0.69)','-webkit-transform': 'scale(0.69)'});
});