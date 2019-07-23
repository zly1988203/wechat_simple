// 获取地址栏参数
var getUrlRequest = getRequest();
// 获取url的参数
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//判断空
function isEmpty(obj) {
    if (obj === null || obj === undefined || obj === '') {
        return true;
    }
    return false;
}

var imgUrl = '';
var click_event = isAndroid() ? 'tap' : 'click';
var childLineList = [];
var lineArr = [];
var userInfo = JSON.parse(localStorage.getItem("userInfo"));

var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 12,
});

var startMarker = new AMap.Marker({
    map: map,
    icon: new AMap.Icon({
        size: new AMap.Size(21, 32),  //图标大小
        imageSize: new AMap.Size(21, 32),
        image: '/dist/images/busCity/icon_up.png',
        imageOffset: new AMap.Pixel(0, 0)//偏移量 0-left;60-top
    }),
    position: map.getCenter()
});

var endMarker = new AMap.Marker({
    map: map,
    icon: new AMap.Icon({
        size: new AMap.Size(21, 32),  //图标大小
        imageSize: new AMap.Size(21, 32),
        image: '/dist/images/busCity/icon_down.png',
        imageOffset: new AMap.Pixel(0, 0)//偏移量 0-left;60-top
    }),
    position: map.getCenter()
});


function addMark() {
    lineArr.forEach(function (item, index) {
        var isStation = item.isStation;
        var name = item.stationName;
        var time = item.time;
        var imgUrl = item.imgUrl;
        var lng = item.lng;
        var lat = item.lat;
        var lnglat = [lng, lat];

        var dataImg = '';
        if (!isEmpty(imgUrl)) {
            dataImg = ' data-img-url="' + imgUrl + '"';
        }
        var marker = new AMap.Marker({
            map: map,
            position: lnglat,
            offset: new AMap.Pixel(-8, -3),
            content: '<div class="mark-box"><div class="circle-mark" data-isstation="' + isStation + '" data-name="' + name + '" data-time="' + time + '"' + dataImg +
                ' data-lng="' + lng + '" data-lat="' + lat + '"></div></div>',
        });

        marker.on('click', function (e) {
            var $el = $(e.target.getContentDom());
            var _this = $el.find('.circle-mark');
            var isStation = $(_this).data('isstation');
            var name = $(_this).data('name');
            var time = $(_this).data('time');
            var imgUrl = $(_this).data('img-url');
            var lng = $(_this).data('lng');
            var lat = $(_this).data('lat');
            var point = {
                imgUrl: imgUrl,
                lng: lng,
                lat: lat,
                name: name,
                time: time,
                isStation: isStation
            }
            openInfoWindow(point);
        })
    })
}

function openInfoWindow(point) {
    var isStation = point.isStation;
    var title = point.name;
    var dataTime = point.time;
    imgUrl = point.imgUrl;
    var imgHtml = '';
    var dataContent = '';
    if (!isEmpty(point.imgUrl)) {
        imgHtml = '<div class="window-foot">' +
            '  <div class="icon-view-img"></div>' +
            '  <div id="showImg" class="foot-txt">查看图片</div>' +
            '  <div class="icon-see"></div>' +
            '</div>'
    }
    if (isStation == 0) {
        dataContent = dataTime + '出发';
    } else if (isStation == 1) {
        dataContent = '预计' + dataTime + '到达';
    } else {
        dataContent = '预计' + dataTime + '到达';
    }
    var lnglat = [point.lng, point.lat]
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,
        // //基点指向marker的头部位置
        offset: new AMap.Pixel(0, -5),
        position: lnglat,
        content: ' <div class="simple-content-body">' +
            '        <div class="simple-window-panel">' +
            '            <div class="simple-window-title">' + title + '</div>' +
            '            <div class="simple-window-body">' +
            '                <div class="info-content">' + dataContent + '</div>' +
            '            </div>' +
            imgHtml +
            '        </div>' +
            '        <div class="ifwn-combo-sharp"></div>' +
            '    </div>',
    });

    infoWindow.open(map, lnglat);
}

document.body.addEventListener('touchend', function (e) {
    // 事件与图片点击事件保持一致，防止图片和关闭按钮在相同位置上时两个事件都触发，导致图片闪现
    if (e.target.id === 'showImg') {
        $('.img-content img').attr('src', imgUrl);
        e.stopPropagation();//阻止事件穿透
        $('#stationImage').show();
    }
}, true);

$('.close-img').on('touchend', function (e) {
    // 事件与图片点击事件保持一致，防止图片和关闭按钮在相同位置上时两个事件都触发，导致图片闪现
    $('#stationImage').hide();
    e.stopPropagation();//阻止事件穿透
})

//线路详情展开收起动画
function animateSwitchDetail() {
    var el = $('.detail-main-content');
    if (el.data('toggle')) {
        //展开
        $('.edit-station').hide();
        $('.save-station').show();
        el.height(el.data('height'));
        // el.find('.detail-station-list').height(el.data('height'));
        el.data('toggle', false);
        $('.detail-toggle').addClass('turn');

        //设置地图边界
        var line_detail_h = $('.detail-head-content').height() + el.data('height') + $('.detail-bottom').height();
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({ height: h + 'px', 'margin-top': line_detail_h });

        // 设置虚线高度
        var realHeight = $('.detail-station-list').data('real-height');
        var liHeight = $('.detail-main-content').data('line-height');
        // console.log('liHeight: ' + liHeight);
        $('.detail-station-list .before').css({
            'height': realHeight - liHeight + 'px',
            'top': liHeight / 2 + 'px',
            'bottom': liHeight / 2 + 'px',
        });
    } else {
        //收起
        $('.edit-station').show();
        $('.save-station').hide();
        el.height(80);
        // el.find('.detail-station-list').height(80);
        el.data('toggle', true);
        $('.detail-toggle').removeClass('turn');


        //设置地图边界
        var line_detail_h = $('.detail-head-content').height() + $('.detail-bottom').height();
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({ height: h + 'px', 'margin-top': line_detail_h });

        //清除样式
        $('.detail-station-list .before').removeAttr('style');
    }

    //滚动设置
    // bindScroll();
}

//展示 选中/全部 线路
function showSelectedStation() {
    var el = $('.detail-main-content');
    if (el.data('toggle')) {
        $('.detail-station-list .detail-station-start li').hide();
        $('.detail-station-list .detail-station-start li.active').show();
        $('.detail-station-list .detail-station-ending li').hide();
        $('.detail-station-list .detail-station-ending li.active').show();
    } else {
        $('.detail-station-list .detail-station-start li').show();
        $('.detail-station-list .detail-station-ending li').show();
    }
}

//设置地图的外边距
function setMap() {
    var h = $(window).height() - $('.line-detail').height();
    $('.ola-maps').css({ height: h + 'px', 'margin-top': $('.line-detail').height() });
}

// 绑定滚动条
var _myIScroll;
var bindScroll = function () {
    if (_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function () {
        _myIScroll = new IScroll('.detail-main', {
            click: iScrollClick(),
            scrollX: false,
            scrollY: true,
            mouseWheel: false
        });

        //第一次滚动的位移
        // scrollMiddle($('.detail-station-start li.active'));
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
    if (_startScrollTop < _halfMainHeight) {
        _moveTop = 0;
    } else {
        //如果 当前上车点的位置大于盒子高度的一半 => 移动距离为 当前上车点的位置 - 盒子高度的一半 + 多余的高度
        _moveTop = -(_startScrollTop - _halfMainHeight + _redundant);
    }

    //如果移动距离超过最大移动距离
    if (Math.abs(_moveTop) > _MAX) {
        _moveTop = -_MAX;
    }

    //滚动
    // _myIScroll.scrollTo(0, _moveTop);
}

//兼容安卓
function iScrollClick() {
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
        var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
        return parseFloat(s[0] + s[3]) < 44 ? false : true
    }
}

function getQueryString(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ? decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}


var departStationlnglat = null;
var arriveStationlnglat = null;
function getStationList() {
    $.showLoading();
    var evt_success = function (res) {
        $.hideLoading();
        if (res.code == 0) {
            var data = res.data;
            $('.depart-date').html(data.departDateStr + "  " + data.arriveStationTime);
            $('.detail-carNo').html(data.carNo);
            $('.lineName').html(data.scheduleCode);
            var goOnStationList = data.goOnStationList;
            var goOffStationList = data.goOffStationList;
            childLineList = JSON.parse(data.childLineList);
            $("#specialState").val(data.specialState);
            departStationlnglat = new AMap.LngLat(data.departLng, data.departLat);
            arriveStationlnglat = new AMap.LngLat(data.arriveLng, data.arriveLat);
            var lineDetail = {
                departTime: data.departTime,
                specialState: data.specialState,
                departStationId: data.departStationId,
                arriveStationId: data.arriveStationId,
                goOnStationList: goOnStationList,
                goOffStationList: goOffStationList,
            }

            goOnStationList.forEach(function (item, index) {
                var station = {
                    stationId: item.stationId,
                    stationName: item.stationName,
                    lng: item.longitude,
                    lat: item.latitude,
                    // time:item.predictTime,
                    time: calTime(item.departTime),
                    imgUrl: item.stationPicUrl,
                    isStation: 0
                }
                lineArr.push(station);
            })
            goOffStationList.forEach(function (item, index) {
                var station = {
                    stationId: item.stationId,
                    stationName: item.stationName,
                    lng: item.longitude,
                    lat: item.latitude,
                    // time:item.predictTime,
                    time: calTime(item.departTime),
                    imgUrl: item.stationPicUrl,
                    isStation: 1
                }
                lineArr.push(station);
            })
            var endStation = lineArr[lineArr.length - 1];
            var startPoint = new AMap.LngLat(lineArr[0].lng, lineArr[0].lat);
            var endPoint = new AMap.LngLat(endStation.lng, endStation.lat);
            var tempArr = Object.assign([], lineArr);
            tempArr.splice(0, 1);
            tempArr.splice(tempArr.length - 1);

            var tempAMapArr = [];
            tempArr.forEach(function (item) {
                tempAMapArr.push(new AMap.LngLat(item.lng, item.lat));
            });
            var wayPoints = tempAMapArr;
            initShow(lineDetail);
            setMap();
            drivingStations(startPoint, endPoint, wayPoints);
        } else {
            $.alert(res.message);
        }
    };

    var evt_error = function (e) {
        $.hideLoading();
    }
    var url = commuteApi.queryLineDetailByOrder;
    var param = {
        orderNo: getUrlRequest.orderNo,
        departDate: getUrlRequest.departDate,
        token: serverUtil.token
    };
    $.ajaxService({
        url: url,
        data: param,
        success: evt_success,
        error: evt_error,
    })
}

function calTime(time, differ) {
    if (isEmpty(differ)) {
        differ = 0;
    }

    var today = new Date(time);
    var later = today.getTime() + differ * 60 * 1000; // 计算后的时间戳
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var oneDay = 1000 * 60 * 60 * 24; // 今天

    var tomorrow = new Date(today.getTime() + oneDay); // 明天
    var afterTomorrow = new Date(today.getTime() + oneDay * 2); // 后天

    var temp = '';
    if ((later - tomorrow) > 0) {
        temp = '次日';
    }
    if ((later - afterTomorrow) > 0) {
        temp = '隔日';
    }
    later = new Date(later);

    var hour = later.getHours() > 9 ? later.getHours() : '0' + later.getHours();
    var min = later.getMinutes() > 9 ? later.getMinutes() : '0' + later.getMinutes();

    var timeStr = temp + hour + ':' + min;
    return timeStr;
}

// 初始化显示
function initShow(lineDetail) {
    var startHtml = '';
    var goOnStationList = lineDetail.goOnStationList;
    if (goOnStationList.length >= 0) {
        var sellOutFlag = false;//售罄标记 true-售罄 false-有票
        var defaultFlag = false;//默认选中标记-后台传来的选中站点
        for (var i = 0; i < goOnStationList.length; i++) {
            var list = goOnStationList[i];
            var stationTag = "途径";
            if (i == 0) {
                stationTag = "始发";
            }
            startHtml = '<li';
            if (list.stationId == lineDetail.arriveStationId) {
                endtHtml += ' class="active"';
            }
            if (list.sellOutStatus == 1) {
                sellOutFlag = true;
                if (list.stationId == lineDetail.departStationId) {
                    defaultFlag = true;
                } else {
                    defaultFlag = false;
                }
            }
            else {
                sellOutFlag = false;
                if (list.stationId == lineDetail.departStationId) {
                    defaultFlag = true;
                } else {
                    defaultFlag = false;
                }
            }

            startHtml += ' data-stationid="' + list.stationId + '"' +
                ' data-lng="' + list.longitude + '"' +
                'data-sell-out="' + sellOutFlag + '"' +
                'data-default="' + defaultFlag + '"' +
                ' data-lat="' + list.latitude + '"' +
                ' data-name="' + list.stationName + '"' +
                ' data-min="' + list.useTime + '"' +
                ' data-img-url="' + list.stationPicUrl + '"' +
                ' data-time="' + list.predictTime + '"' + ' data-form="on">' +
                ' <div class="content">' +
                ' <div class="name"><h4>' + list.stationName + '</h4><div class="time">（约' + calTime(list.createTime) + '）</div>' +
                ' <div class="item-type">' + stationTag + '</div></div>';
            startHtml += '</div></li>';
            $('.detail-station-start').append(startHtml);
        }
        stationClickEvent();
        getActiveStation();
    }

    var endtHtml = '';
    var goOffStationList = lineDetail.goOffStationList;
    if (goOffStationList.length >= 0) {
        for (var i = 0; i < goOffStationList.length; i++) {
            var list = goOffStationList[i];
            var stationTag = "途径";
            if (i == goOffStationList.length - 1) {
                stationTag = "终点";
            }
            endtHtml = '<li';
            if (list.stationId == lineDetail.arriveStationId) {
                endtHtml += ' class="active"';
            }
            endtHtml += ' data-stationid="' + list.stationId + '"' +
                ' data-lng="' + list.longitude + '"' +
                ' data-lat="' + list.latitude + '"' +
                ' data-name="' + list.stationName + '"' +
                ' data-min="' + list.useTime + '"' +
                ' data-img-url="' + list.stationPicUrl + '"' +
                ' data-time="' + list.predictTime + '"' + ' data-form="off">' +
                ' <div class="content">' +
                ' <div class="name"><h4>' + list.stationName + '</h4><div class="time">（约' + calTime(list.createTime) + '）</div>' +
                ' <div class="item-type">' + stationTag + '</div></div>' +
                ' </div></li>';
            $('.detail-station-ending').append(endtHtml);
        }
        stationClickEvent();
    }

    $('.detail-station-list').data('real-height', $('.detail-station-list')[0].scrollHeight);

    //只有两个站点不显示切换站点
    if (goOnStationList.length == 1 && goOffStationList.length == 1) {
        $('.detail-bottom').hide();
        $('.detail-toggle').hide();
        $(".name").removeClass("hActive");
    } else {
        $('.detail-bottom').show();
        $('.detail-toggle').show();
        var hasTurn = $(".detail-toggle").hasClass("turn");
        if (hasTurn) {
            $(".name").addClass("hActive");
        } else {
            $(".name").removeClass("hActive");
        }
    }

    addMark();

    var initHeight = $('.detail-main-content').height();
    $('.detail-main-content').data('height', initHeight);
    var lineHeight = $('.detail-main-content ul li').height();
    $('.detail-main-content').data('line-height', lineHeight);
    // $('.detail-main-content').height(initHeight);

    initStationInfo();
}

/*展开收起切换*/
$('.detail-toggle').on('touchstart', function () {
    animateSwitchDetail();
    showSelectedStation();
    var hasTurn = $(".detail-toggle").hasClass("turn");
    if (hasTurn) {
        $(".name").addClass("hActive");
    } else {
        $(".name").removeClass("hActive");
    }
});

//上车站点默认选中站点：默认选中后台的，否则选中默认后的第一个未售罄
function getActiveStation() {
    var onStationList = $('.detail-station-start li');
    var defaultIndex, changeIndex;
    for (var i = 0; i < onStationList.length; i++) {
        var stationItem = $(onStationList[i]);
        var defaultFlag = stationItem.data('default');
        var sellOut = stationItem.data('sell-out');

        if (defaultFlag && !sellOut) {
            defaultIndex = i;//默认选中的站点
            // stationItem.addClass('active').siblings().removeClass('active');
            break;//终止整个循环
        } else if (defaultFlag && sellOut) {
            defaultIndex = i;
        } else if (!defaultFlag && sellOut) {

        } else if (!defaultFlag && !sellOut) {
            if (undefined != defaultIndex) {//排除掉第一个非默认选择非售罄的情况
                changeIndex = i;//默认站点停售后选择的站点
                break;//终止整个循环
            }
        }
    }

    var defaultStation = $(onStationList[defaultIndex]);
    if (defaultStation.data('sell-out')) {
        $(onStationList[changeIndex]).addClass('active').siblings().removeClass('active');
    } else {
        defaultStation.addClass('active').siblings().removeClass('active');
    }
}

function stationClickEvent() {
    /*选中站点*/
    $('.detail-station-list li').on('tap', function () {
        var $el = $(this);
        var lat = $el.data('lat');
        var lng = $el.data('lng');
        var name = $el.data('name');
        var time = $el.data('time');
        var imgUrl = $el.data('img-url');
        var type = $el.data('form');
        var isStation = null;
        var selloutFlag = $el.data('sell-out');
        if (selloutFlag) {
            return;//售罄或者停售不可点击
        } else {
            if (type == 'on') {
                startMarker.setPosition([lng, lat]);
                isStation = 0;
            } else {
                endMarker.setPosition([lng, lat]);
                isStation = 1;
            }
            //选中站点居中
            map.setCenter(new AMap.LngLat(lng, lat));

            var point = {
                imgUrl: imgUrl,
                lng: lng,
                lat: lat,
                name: name,
                time: time,
                isStation: isStation
            }
            openInfoWindow(point);
            //剔除已停售站点
            if ($el.hasClass('sell-out')) {
                return false;
            }

            $el.addClass('active').siblings().removeClass('active');
            //滚动
            scrollMiddle($el);
        }
    });
}

function initStationInfo() {
    var $el = $('.detail-station-start li.active');
    var lat = $el.data('lat');
    var lng = $el.data('lng');
    var name = $el.data('name');
    var time = $el.data('time');
    var imgUrl = $el.data('img-url');
    var type = $el.data('form');
    var isStation = null;
    if (type == 'on') {
        startMarker.setPosition([lng, lat]);
        isStation = 0;
    } else {
        endMarker.setPosition([lng, lat]);
        isStation = 1;
    }
    var point = {
        imgUrl: imgUrl,
        lng: lng,
        lat: lat,
        name: name,
        time: time,
        isStation: isStation
    }
    openInfoWindow(point);
    //剔除已停售站点
    if ($el.hasClass('sell-out')) {
        return false;
    }
    // //滚动
    // scrollMiddle($el);
}

function drivingStations(startPoint, endPoint, wayPoints) {
    $.showLoading('线路绘制中.....');
    var tempHeight1 = $('.line-detail').height();
    var tempHeight11 = $('.line-detail-container .detail-toggle').height();
    var tempHegith2 = $('.foot-panel').height();
    $('.sui-mask-transparent').css({ 'height': 'auto', 'top': (tempHeight1 + tempHeight11), 'bottom': tempHegith2 });
    var driving = new AMap.Driving({
        map: map,
        hideMarkers: true,
    });

    // 根据起终点经纬度规划驾车导航路线
    driving.search(startPoint, endPoint, { waypoints: wayPoints },
        function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
                startMarker.setPosition(departStationlnglat);
                endMarker.setPosition(arriveStationlnglat);
                map.setCenter(startPoint);
                map.setFitView();
                $.hideLoading();
            } else {
                console.log('获取驾车数据失败：' + result)
            }
        });
}

$(function () {
    sessionStorage.removeItem('passengerList');
    sessionStorage.removeItem('passengerNumber');
    getStationList();
    $('title').html("线路地图 - " + userInfo.providerName);
});