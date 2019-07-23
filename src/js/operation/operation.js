var clickEvent = isAndroid()?'tap':'click';

$('.popup-close').on(clickEvent,function () {
    $(".popup-overlay").hide();
    $(".popup").hide();
});

$('#tel').on(clickEvent,function () {
    $.confirm('拨打电话:<br/>'+$('#tel').data('tel'),'',function () {
        window.location.href = 'tel://'+$('#tel').data('tel');
    });
});

$('.show-less ul').each(function (index) {
    if(index>4){
        $(this) .hide(); // 第(index+1)几个以后开始隐藏
    }
    $('.show-more').on(clickEvent,function () {
        $('.show-less ul').show();
        $('.show-more').hide();
    });
});

function getParam(param){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    var result = theRequest[param];
    return result;
}

function statisticaCount(trace){
    var urlList = '/wechat/marketing/userTrace';
    var dataList = {
        f:getParam(f), // 获取渠道来源
        trace:trace, // 用户行为
    }
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
        },
        error:function(e){
        }
    });
}

function statisticaCount(trace){
    var urlList = '/wechat/marketing/userTrace';
    var dataList = {
        f:getParam('f'), // 获取渠道来源
        trace:trace, // 用户行为
    }
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
        },
        error:function(e){
        }
    });
}
function thumbUpEvent(){
    $('.thumb_up').on(clickEvent,function(){
        var _this = $(this);
        thumbUp(_this);
        // initShareConfig();
    });
}
function thumbUp(_this){
    var urlList = '/wechat/marketing/like';
    var dataList={

    };
    var _hot =_this.prev();
    var hotValue = parseInt(_hot.text());
    dataList.providerId = getParam('providerId'); // 获取用户providerId
    var _provider = _this.parent().find(".provider").text();
    dataList.providerId1 = _this.parent().find(".provider-id").text(); // 获取点赞车企providerId
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            if (undefined !=data && data.code == 0){
                var content = data.data;
                if (undefined !=content){
                    _hot.text(hotValue+content.hot);
                    $(".popup").show();
                    $('.popup-provider').text(_provider);
                    $(".popup-overlay").show().css("opacity",".5");
                    _this.html('<img src="../../front/dist/images/operation/unclickable.png">');

                    shareObj.title = content.share.title; resultMap="BaseResultMap"
                    shareObj.reqURL = content.share.link;
                    shareObj.desc = content.share.desc;
                    shareObj.imgUrl = content.share.icon;

                    // 分享链接
                    wxJsSdk.share(shareObj.title,shareObj.reqURL,shareObj.desc,shareObj.imgUrl);
                    statisticaCount('分享');
                }
                statisticaCount('点赞'); // 统计
            }
            else{
                $.confirm(data.msg);
            }
        },
    });
}
function queryProvider(){
    var urlList = '/wechat/marketing/info';
    var dataList = {
        providerId:getParam('providerId'),
    }
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            if (undefined !=data && data.code == 0){
                var content = data.data;
                if (undefined !=content && content!=null){
                    drawingPage(content);
                }
            }
        },
    });
}

function drawingPage(content){
    var _html = '';
    var list = content.line;
    for (var i=0;i<list.length;i++){
        var temp = i+1;
        var data = list[i];
        if (i==0){
            temp = '<img src="../../front/dist/images/operation/NO_1.png">';
        }
        if (i==1){
            temp = '<img src="../../front/dist/images/operation/NO_2.png">';
        }
        if (i==2){
            temp = '<img src="../../front/dist/images/operation/NO_3.png">';
        }
        var exp = parseFloat(data.exp);
        _html += '<ul>'+
            '<li class="ranking">'+ temp +'</li>'+
            '<li class="provider"><img src="'+data.logo+'">'+data.provider_name+'</li>'+
            '<li class="provider-id" style="display: none">'+data.provider_id+'</li>'+
            '<li class="index">'+Math.round(exp)+'</li>'+
            '<li class="hot">'+data.hot+'</li>';
        // 是否点赞, 1 已点赞, 0 未点赞
        if (data.status==1){
            _html += '<li class="thumb_up"><img src="../../front/dist/images/operation/unclickable.png"></li>';
        }
        else{
            _html += '<li class="thumb_up"><img src="../../front/dist/images/operation/clickable.png"></li>';
        }
        _html += '</ul>';
    }

    $('.show-less').append(_html);
    $('.operation-introduction-tips span em').text(content.time);
    $('.show-less ul').each(function (index) {
        if(index>5){
            $(this) .hide(); // 第(index+1)几个以后开始隐藏
        }
        $('.show-more').on(clickEvent,function () {
            $('.show-less ul').show();
            $('.show-more').hide();
        });
    });
    thumbUpEvent();
}

var shareObj = {
    reqURL : window.location.href,
    title : '道路客运年度盛典，运营先锋大赛火热进行中',
    desc : '年度人气客运企业等你投票！',
    imgUrl:'',
    appId:'wx55a6247bbbcc41bc',
}

//设置分享到朋友圈信息
function initShareConfig(data) {
    var urlList = '/wechat/marketing/share';
    var dataList = {
        providerId:getParam('providerId'),
    };
    // dataList = genReqData(urlList, dataList);
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            if (data.code == 0) {
                var content = data.data;
                shareObj.title = content.title;
                shareObj.reqURL = content.link;
                shareObj.desc = content.desc;
                shareObj.imgUrl = content.icon;

                // 分享链接 getParam(f)获取渠道来源
                wxJsSdk.share(shareObj.title,shareObj.reqURL,shareObj.desc,shareObj.imgUrl);
                statisticaCount('分享');
            }
            else{
                alert("请求失败");
            }
        },
    });
}

$(function () {
    // $.toast('我是你爸爸');
    queryProvider();
    initShareConfig();
    statisticaCount('访问'); // 页面访问次数统计
    // $('.show-more').hide();
    // $('.show-less:last-child').css('padding-bottom','.4rem');
})