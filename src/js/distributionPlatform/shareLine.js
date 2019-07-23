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
        var _poster_bg = $('#poster_bg_lines');
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        if(_index == '1'){
            $(_poster_bg).attr('src','../../dist/images/distribution/poster-bg-1-1.png');//海报背景切换
            $('#lines_bg').attr('src','../../dist/images/distribution/lines-bg-1.png');//线路背景切换
        }else if(_index == '2'){
            $(_poster_bg).attr('src','../../dist/images/distribution/poster-bg-2-1.png');
            $('#lines_bg').attr('src','../../dist/images/distribution/lines-bg-2.png');
        }else if(_index == '3'){
            $(_poster_bg).attr('src','../../dist/images/distribution/poster-bg-3-1.png');
            $('#lines_bg').attr('src','../../dist/images/distribution/lines-bg-3.png');
        }else if(_index == '4'){
            $(_poster_bg).attr('src','../../dist/images/distribution/poster-bg-4-1.png');
            $('#lines_bg').attr('src','../../dist/images/distribution/lines-bg-4.png');
        }else if(_index == '5'){
            $(_poster_bg).attr('src','../../dist/images/distribution/poster-bg-5-1.png');
            $('#lines_bg').attr('src','../../dist/images/distribution/lines-bg-5.png');
        }

        //TODO 生成对应的海报


    });

    /*收益须知*/
    $('.notice .notice-btn').on('click',function () {
        $('#notice_popup').show();
    });
    /*关闭更多方式和收益须知*/
    $('.close-btn').on('click',function () {
        $('.popup-container').hide();
    });

    /* *****************div转换为图片开始********************/

    //    html2canvas(document.getElementById('sss')).then(function(canvas) {
    html2canvas(document.getElementById('poster')).then(function(canvas) {
        document.getElementById('canvas-box').appendChild(canvas);
    });
    /*div转为canvas 需要时间*/
    setTimeout(function () {
        //获取网页中的canvas对象
        var mycanvas1 = $('canvas')[0];//document.getElementsByTagName('canvas')[0];
        //将转换后的img标签插入到html中
        var img = convertCanvasToImage(mycanvas1);
        $('#img-box').append(img);//imgDiv表示你要插入的容器id
    },1000);

    /* *****************div转换为图片结束********************/
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