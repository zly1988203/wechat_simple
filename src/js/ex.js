var providerDomin = document.domain.split('.')[0];
dplus.track("浏览选择站点页",{
    "车企":providerDomin,
    "业务":"定制班线",
    "页面名称":"选择站点页",
    "页面URL":window.location.href
});
var qrcId = "${qrcId!''}";
var day = "${lineDetail.departDate!''}";
var busId = '${lineDetail.busId!''}';
//站点之间的票价
var childLineList = '${lineDetail.childLineList!''}';
var childList = eval('(' + childLineList + ')');

$(function() {
    localStorage.removeItem('selectedCoupon');
    sessionStorage.removeItem('localIdCardInfo');
    init();

    /*展开收起切换*/
    $('.detail-toggle').on('click', function () {
        animateSwitchDetail();
    });

    /*选中站点*/
    $('.detail-station-list li').on('click', function () {
        dplus.track("选择站点页-切换站点",{
            "车企":providerDomin,
            "业务":"定制班线",
            "页面名称":"选择站点页",
        });
        var $el = $(this);
        //剔除已停售站点
        if($el.hasClass('sell-out')) {
            return false;
        }

        $el.addClass('active').siblings().removeClass('active');
        //滚动
        scrollMiddle($el)
    });

    setMap();
    mapFn();

    //初始化
    function init(){
        //获取站点详情高度
        var main_content =  $('.detail-main-content');
        main_content.data('height',main_content.height());
        main_content.height(main_content.data('height'));
    }

    //线路详情展开收起动画
    function animateSwitchDetail(){
        var el = $('.detail-main-content');
        if(el.data('toggle')){
            dplus.track("选择站点页-展开站点",{
                "车企":providerDomin,
                "业务":"定制班线",
                "页面名称":"选择站点页",
            });

            el.height(el.data('height'));
            el.data('toggle',false);
            $('.detail-toggle').removeClass('turn');

            //设置地图边界
            var line_detail_h = $('.detail-head-content').height()+ el.data('height')+ $('.detail-bottom').height();;
            var h = $(window).height() - line_detail_h;
            $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});

        }else{
            dplus.track("选择站点页-收起站点",{
                "车企":providerDomin,
                "业务":"定制班线",
                "页面名称":"选择站点页",
            });

            el.height(0);
            el.data('toggle',true);
            $('.detail-toggle').addClass('turn');

            //设置地图边界
            var line_detail_h = $('.detail-head-content').height()+ $('.detail-bottom').height();;
            var h = $(window).height() - line_detail_h;
            $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});
        }

        //滚动设置
        bindScroll();
    }
    bindScroll();
    //点击购票按钮
    $('.detail-station-btn').off('click').on('click',function(){
        dplus.track("选择站点页-购买车票",{
            "车企":providerDomin,
            "业务":"定制班线",
            "页面名称":"选择站点页",
        });
        //获取上下车店 stationId
        var stationStartId = $('.detail-station-start li.active').data('stationid');
        var stationEndingId = $('.detail-station-ending li.active').data('stationid');
        if(!stationStartId){
            $.alert("请选择上车站点");
            return;
        }
        if(!stationEndingId){
            $.alert("请选择下车站点");
            return;
        }
        var departDate = '${lineDetail.departDateStr!''}';
        var scheduleId= '${lineDetail.scheduleId!''}';
        //查询是否有未支付订单
        $.post("/busline/queryNotPayOrders",{token:$.cookie('token'),busId:busId,type:4},function(result){
            if(result.code == 0){
                //window.location='/busline/toAddOrder?busId='+busId+'&token='+$.cookie('token');
                window.location='/bus/toBusOnlinePay?busId='+busId+'&token='+$.cookie('token') +"&qrcId=" + qrcId;
            }else if(result.code == 50086){
                var orderNo = result.data;
                $.confirm('您当前有未支付订单，不能重复下单', '提示',['我知道了', '进入订单'], function() {
                    var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/orderDetial';
                    var dataObj = {
                    };
                    dataObj = genReqData(urlStr, dataObj);
                    window.location.href="/bus/toBusOrderDetail?token="+dataObj.token+"&orderNo="+orderNo+"&sign="+dataObj.sign;
                });
            }else if(result.code == -1){
                $.alert(result.message||'未知错误',function(){
                    window.location = "/busIndex?token="+$.cookie('token');
                    return false;
                });
            }else{
                $.alert(result.message||'未知错误');
            }
        },'json');
    })

    $('.travelLineInfo').off('click').on('click',function(){
        var lineId = ${lineDetail.lineId!''};
        var fromUrl = window.location.href;
        localStorage.setItem("travelLineDetail",fromUrl);
        window.location.href = "/travel/travelLineInfo?lineId=" + lineId + "&fromUrl=lineDetail";
    });
});

//设置地图的外边距
function setMap() {
    var h = $(window).height() - $('.line-detail').height();
    $('.ola-maps').css({height: h + 'px', 'margin-top': $('.line-detail').height()});
}

// 绑定滚动条
var _myIScroll;
var bindScroll = function() {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll('.detail-main', {
            click: iScrollClick(),
            scrollX: false,
            scrollY: true,
            mouseWheel: true
        });

        //第一次滚动的位移
        scrollMiddle($('.detail-station-start li.active'));
    }, 300);
};

/*
* 滚动到中间
* */
function scrollMiddle(el) {
    /*
     * param
     *
     *   el：当前上车点
     *   _moveTop：移动距离
     *   el_halfHeight：当前上车点元素高度的一半
     *   _redundant：多余高度
     *   _startScrollTop：当前上车点位置
     *   _mainHeight：盒子高度
     *   _halfMainHeight：盒子高度的一半
     *   _contentHeight：内容总高度
     *   _MAX：最大移动距离
     *
     * */
    var _moveTop = 0;
    var el_halfHeight = parseInt(el.height() / 2);
    var _redundant = el_halfHeight;
    var _startScrollTop = el.position().top,
        _mainHeight = parseInt($('.detail-main').height()),
        _halfMainHeight = _mainHeight / 2,
        _contentHeight = parseInt($('.detail-main .content').height()),
        _MAX = _contentHeight - _mainHeight;

    //如果 当前上车点的位置小于盒子高度的一半 => 不移动
    if(_startScrollTop < _halfMainHeight) {
        _moveTop = 0;
    } else {
        //如果 当前上车点的位置大于盒子高度的一半 => 移动距离为 当前上车点的位置 - 盒子高度的一半 + 多余的高度
        _moveTop = -(_startScrollTop - _halfMainHeight + _redundant);
    }

    //如果移动距离超过最大移动距离
    if(Math.abs(_moveTop) > _MAX) {
        _moveTop = -_MAX;
    }

    //滚动
    _myIScroll.scrollTo(0, _moveTop);
}

//兼容安卓
function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
        var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
        return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
}

// 切换列表
function switchDetail(el) {
    if(el.data('toggle')) {
        $('.detail-tips').show();
        $('.detail-main').show();
        el.addClass('turn');
        el.data('toggle', false);
    } else {
        $('.detail-tips').hide();
        $('.detail-main').hide();
        el.removeClass('turn');
        el.data('toggle', true);
    }

    //滚动设置
    bindScroll();
    setMap();
}

// 地图功能
function mapFn() {
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var startPoint = new BMap.Point(${lineDetail.departLng},${lineDetail.departLat});   //起点
    var endPoint = new BMap.Point(${lineDetail.arriveLng},${lineDetail.arriveLat});    //终点
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    // 初始化
    var pathwayPonit = [];
    $('.detail-station-list li').each(function (index) {
        var $el = $(this);
        pathwayPonit[index] = {lng: $el.data('lng'), lat: $el.data('lat')};
    });

    // 经途点
    var drivings = addPolyLine(pathwayPonit);

    // 画线
    function addPolyLine(points) {
        var pathwayPonitArr = [];
        for(var item in points) {
            pathwayPonitArr.push(new BMap.Point(points[item].lng, points[item].lat));
        }

        var drivingStart = pathwayPonitArr.shift(),
            drivingEnd = pathwayPonitArr.pop();
        var driving = new BMap.DrivingRoute(map, {
            renderOptions:{map: map, autoViewport: true}
        });
        driving.search(drivingStart, drivingEnd, {
            waypoints: pathwayPonitArr
        });  //waypoints表示途经点

        // 设置添加标注后的回调函数: 删除地图自带的图标
        driving.setMarkersSetCallback(function (pois) {
            for(var item in pois) {
                if(pois[item].marker) {
                    //屏蔽起终图标
                    map.removeOverlay(pois[item].marker);
                }

                if(pois[item].Hm) {
                    //屏蔽经字图标
                    map.removeOverlay(pois[item].Hm);
                }
            }

            //屏蔽起终图标
            $('[src="https://api0.map.bdimg.com/images/dest_markers.png"]').remove();
            //屏蔽经字图标
            $('[src="https://api0.map.bdimg.com/images/way-points.png"]').remove();
            $('[src="https://api.map.baidu.com/images/way-points.png"]').remove();
        });

        //设置中心点为上车点
        driving.setPolylinesSetCallback(function () {
            var $up = $('.detail-station-start li.active');
            var upPoint = '';

            //如果有上车点
            if($up.length > 0) {
                upPoint = new BMap.Point($up.data('lng'), $up.data('lat'));
            } else {
                //则使用默认起点
                upPoint = startPoint;
            }

            map.centerAndZoom(upPoint, 18);
        });

        // 上下车点标注
        $('.detail-station-start li').each(function () {
            var $el = $(this);
            addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-4.png", {w: 13, h: 13}, 4);
        });
        $('.detail-station-ending li').each(function () {
            var $el = $(this);
            addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-2.png", {w: 13, h: 13}, 4);
        });

        return driving;
    }

    // 起始和终点-图标和大小
    var startIcon = "/res/images/bus/map-start.png",
        startSize = {w: 25, h: 36};
    var endIcon = "/res/images/bus/map-end.png",
        endtSize = {w: 25, h: 36};
    // 上下车点-图标和大小
    var aboardIcon = "/res/images/bus/map-up.png",
        aboardSize = {w: 25, h: 24};
    var debusIcon = "/res/images/bus/map-down.png",
        debusSize = {w: 25, h: 24};

    // 设置起点和目的地
    //var startMarker = addMarker({lng: 113.878651,lat: 22.572961}, startIcon, startSize, 5);
    //var endMarker = addMarker({lng: 113.94454,lat: 22.527815}, endIcon, endtSize, 5);

    // 设置线路上下车点
    var defaultAboardIcon = "/res/images/bus/map-3.png",
        defaultAboardSize = {w: 14, h: 14};
    var defaultDebusIcon = "/res/images/bus/map-1.png",
        defaultDebusSize = {w: 14, h: 14};
    var $defaultAboard = $('.detail-station-start li:first-child');
    addMarker({lng: $defaultAboard.data('lng'),lat: $defaultAboard.data('lat')}, defaultAboardIcon, defaultAboardSize, 4);
    var $defaultDebus = $('.detail-station-ending li:last-child');
    addMarker({lng: $defaultDebus.data('lng'),lat: $defaultDebus.data('lat')}, defaultDebusIcon, defaultDebusSize, 4);

    // 设置上车点和下车点
    var $aboard = $('.detail-station-start li.active');
    if($aboard.length != 0) {
        var aboardMarker = addMarker({lng: $aboard.data('lng'),lat: $aboard.data('lat')}, aboardIcon, aboardSize, 6);

        //文字提示
        var aboardlabel = labelAction($aboard.data('name'));
        aboardMarker.setLabel(aboardlabel);
    }

    var $debus = $('.detail-station-ending li.active');
    if($debus.length != 0) {
        var debusMarker = addMarker({lng: $debus.data('lng'),lat: $debus.data('lat')}, debusIcon, debusSize, 6);

        //文字提示
        var debuslabel = labelAction($debus.data('name'));
        debusMarker.setLabel(debuslabel);
    }

    // 点标注
    function addMarker(point, icon, size, zindex) {
        var markerPoint = new BMap.Point(point.lng, point.lat);
        var markerIcon = new BMap.Icon(icon, new BMap.Size(size.w, size.h), {
            imageSize: new BMap.Size(size.w, size.h)
        });
        var marker = new BMap.Marker(markerPoint,{icon:markerIcon});
        map.addOverlay(marker);

        zindex && marker.setZIndex(zindex);

        return marker;
    }

    //定位上车点
    $('.detail-station-start li').on('click', function () {
        var $el = $(this);

        //剔除已停售站点
        if($el.hasClass('sell-out')) {
            return false;
        }
        pantoMark($el, aboardIcon, aboardSize, 6);

        var stationName = $el.data('name');
        var stationTime = $el.data('time');
        $('.detail-station-info .station-item:first-child h4').text(stationName);

        var startUseTime = $el.data('min')||0;
        var endUseTime = $('.detail-station-ending li.active').data('min')||0;
        if(endUseTime >= startUseTime){
            var time = endUseTime - startUseTime;
            var text = '约'+time+'分钟'
            $('.detail-station-info .detail-station-distance:last-child').text(text);
        }

        $('.detail-date').text(day + ' ' + stationTime);

        changePrice();
    });

    //定位下车点
    $('.detail-station-ending li').on('click', function () {
        var $el = $(this);

        //剔除已停售站点
        if($el.hasClass('sell-out')) {
            return false;
        }
        pantoMark($el, debusIcon, debusSize, 6);

        var stationName = $el.data('name');
        $('.detail-station-info .station-item:last-child h4').text(stationName);

        var startUseTime = $('.detail-station-start li.active').data('min')||0;
        var endUseTime = $el.data('min')||0;
        if(endUseTime >= startUseTime){
            var time = endUseTime - startUseTime;
            var text = '约'+time+'分钟'
            $('.detail-station-info .detail-station-distance:last-child').text(text);
        }

        changePrice();
    });

    var specialState = ${lineDetail.specialState!0};
    function changePrice(){
        //获取上下车店 stationId
        var stationStartId = $('.detail-station-start li.active').data('stationid');
        var stationEndingId = $('.detail-station-ending li.active').data('stationid');
        if(childList.length>0){
            for(var i=0;i<childList.length;i++){
                var childLine = childList[i];
                if(childLine.departStationId == stationStartId & childLine.arriveStationId == stationEndingId){
                    $('#price').html(saveTwoDigit(childLine.sellPrice)+'元');
                    if(specialState == 1){
                        var showPrice = childLine.specialPrice;
                        if(showPrice<0){
                            $('#specialPrice').html(0);
                        }else{
                            $('#specialPrice').html(saveTwoDigit(childLine.specialPrice));
                        }
                    }
                    busId = childLine.idStr;
                }
            }
        }
    }

    // 定位站点
    function pantoMark(el, icon, size, zindex) {
        //参数定义
        if(!size) {
            //覆盖物的size
            size = {};
        }

        if(!zindex) {
            //覆盖物的zindex
            zindex = 1;
        }

        var lng = el.data('lng'),
            lat = el.data('lat');
        map.panTo(new BMap.Point(lng, lat));

        //延迟放大
        setTimeout(function () {
            map.setZoom(18);
        }, 500);

        //修改中心点 以至于让地图发生变化
        setTimeout(function() {
            map.setCenter(new BMap.Point(lng, lat))
        }, 1);

        //文字提示
        var label = labelAction(el.data('name'));

        if(el.data('form') == 'on') {
            map.removeOverlay(aboardMarker);
            aboardMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
            aboardMarker.setLabel(label);
        } else if(el.data('form') == 'off') {
            map.removeOverlay(debusMarker);
            debusMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
            debusMarker.setLabel(label);
        }
    }

    // 文字提示
    function labelAction(dataName) {
        var label = new BMap.Label(dataName);

        // 设置样式
        label.setStyle({
            backgroundColor: '#6392fe',
            borderRadius: '3px',
            fontSize: '12px',
            color: '#fff',
            padding: '0 4px',
            textAlign: 'center',
            height:'20px',
            lineHeight: '20px',
            border: '0 none'
        });

        // 设置偏移
        var l = ((dataName.length - 1) * 12) / 2 - 4;
        label.setOffset(new BMap.Size(-l, -23));

        return label;
    }

    return map;
}