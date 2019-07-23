$(function () {
    /*更多方式*/
    $('.more').on('click',function () {
        $('#more_popup').show();
    });
    /*复制链接*/
    copyUrl();



    /*海报切换*/
    $('.switch .item').on('click',function () {
        var _index = $(this).data('index');
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $.showLoading('海报生成中...');

        //  模拟请求后台返回海报
        setTimeout(function () {
            if(_index == '1'){
                $('.remark').css('color','#4A90E2');
                loadImage('../../dist/images/distribution/v2.0/poster-bg-1-1.png',call);
            }else if(_index == '2'){
                $('.remark').css('color','#4A90E2');
                loadImage('../../dist/images/distribution/v2.0/poster-bg-2-1.png',call);
            }else if(_index == '3'){
                $('.remark').css('color','#F8A100');
                loadImage('../../dist/images/distribution/v2.0/poster-bg-3-1.png',call);
            }else if(_index == '4'){
                $('.remark').css('color','#666666');
                loadImage('../../dist/images/distribution/v2.0/poster-bg-4-1.png',call);
            }else if(_index == '5'){
                $('.remark').css('color','#333333');
                loadImage('../../dist/images/distribution/v2.0/poster-bg-5-1.png',call);
            }
            $.hideLoading();
        },1500)
    });

    /*收益须知*/
    $('.notice .notice-btn').on('click',function () {
        $('#notice_popup').show();
    });
    /*关闭更多方式和收益须知*/
    $('.close-btn').on('click',function () {
        $('.popup-container').hide();
    });

});

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

/**
 * 加载海报
 * @param url:海报的url，callback:图片加载完成时的回调函数
 */
function loadImage(url,callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载
    img.onload = function(){
        img.onload = null;
        callback(img);
    };
    img.src = url;
}
function call(img){
    $(img).appendTo('#poster');
}