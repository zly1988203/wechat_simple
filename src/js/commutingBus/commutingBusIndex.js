var clickEvent = isAndroid()?'tap':'click';
var lineParam={};//保存起止点的经纬度信息
var stationType = 1;
var providerId = '';
//定位是否成功
var isLocation = false;
//根据gps获取地理位置
function getGpsCallback(callbackData){
    if(callbackData['flag'] == false){
        isLocation = false;
        return;
    }
    var gpsData = callbackData['longitude']+","+callbackData['latitude'];
    $('#currentAddressDetail').attr('data-lng',callbackData['longitude']); //经度
    $('#currentAddressDetail').attr('data-lat',callbackData['latitude']); //纬度
    //测试定位
    request(commonApi.getGpsLocation,{gps: gpsData}).then(function(res){
        if(res.code == 0){
            var data  = res.data;
            $('#currentAddressDetail').data('city-name',data.cityName);
            $('#currentAddressDetail').data('area-name',data.areaName);
            $('#currentAddressDetail').data('area-id',data.areaId);
            $('#currentAddressDetail').data('address',data.address);
            $('#currentAddressDetail span').html(data.address);
            $('#currentAddress').show();
        }else {
            $('#currentAddress').hide();
        }
    });
}

function drawSchedulHtml(scheduleList){
    var html = "";
    for (var i=0;i<scheduleList.length;i++){
        var date = '';
        var schedule = scheduleList[i];
        var temp = getFormatTime(schedule.departTime);
        if (temp.timeDiff == 0){
            date = '今天'+'('+temp.week+')';
        }
        else if(temp.timeDiff == 1){
            date = '明天'+'('+temp.week+')';
        }
        else{
            date = temp.month+'-'+temp.day+'('+temp.week+')';
        }
        var time = temp.hour+':'+temp.minute;
        html += '<div class="swiper-slide">' +
            '   <div class="content">' +
            '    <div class="startAdrs">' +
            '        <div class="addr adrs">'+schedule.departTitle+'</div>' +
            '        <div class="addr area">'+schedule.departCity+'</div>' +
            '    </div>' +
            '    <div class="center-line">' +
            '        <div class="time">'+date+'</div>' +
            '        <div class="line"></div>' +
            '        <div class="time">'+time+'</div>' +
            '    </div>' +
            '    <div class="endAdrs">' +
            '        <div class="addr adrs">'+schedule.arriveTitle+'</div>' +
            '        <div class="addr area">'+schedule.arriveCity+'</div>' +
            '    </div>'+
            '   </div>' +
            '</div>';
    }
    $('#scheduling-panle .swiper-wrapper').html(html);
    swSchedulingList(scheduleList);
}

function swSchedulingList(scheduleList){
    /** 轮播图*/
    var mySwiper = new Swiper('#scheduling-panle .swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '#scheduling-panle .swiper-pagination',
        },
    });

    if(scheduleList.length == 1){
        $('.scheduling .swiper-pagination').hide();
    }else {
        $('.scheduling .swiper-pagination').show();
    }

    $('.scheduling .swiper-container').on('click mousedown', function(e) {
        // window.location = '/cityBus/myTripList';
    })
}

function drawOrderList(orderList){
    var html = '';
    for (var i=0;i<orderList.length;i++){

        var order = orderList[i];
        html += '<div class="content">' +
            '<div class="icon iconfont icon-history_icon location"  data-departStationId="'+order.departStationId+
            '" data-arriveStationId="'+order.arriveStationId+'" data-departTime="'+order.departTime+'"></div>' +
            '            <div class="startAdrs" data-depart="'+order.departTitle+'">' +
            '                <div class="addr adrs">'+order.departTitle+'</div>' +
            '                <div class="addr area">'+order.departCity+'</div>' +
            '            </div>' +
            '            <div class="center-line">' +
            '                <span class="icon iconfont icon-one_way_arrow_icon arrow"></span>' +
            '            </div>' +
            '            <div class="endAdrs" data-arrive="'+order.arriveTitle+'">' +
            '                <div class="addr adrs">'+order.arriveTitle+'</div>' +
            '                <div class="addr area">'+order.arriveCity+'</div>' +
            '            </div>' +
            '            <div class="btn-list">' +
            '                <div class="call-car" data-busId="'+order.busId+'">购票</div>' +
            '                <div class="back">返程</div>' +
            '            </div></div>';
        if ((i+1) != orderList.length){
            html +='<div class="line"></div>';
        }
    }
    $('.near-order').html(html);

    var orderClickEvent = function () {
        /*添加点击事件*/
        $('.call-car').on(clickEvent,function(){
            var parent = $(this).parent().siblings('.location');
            var departStationId = $(parent).data('departstationid');
            var arriveStationId = $(parent).data('arrivestationid');
            var departTime = $(parent).data('departtime');
            var stationInfo = {
                departStationId:departStationId,
                arriveStationId:arriveStationId,
                departTime:departTime
            }
            sessionStorage.setItem('stationInfo',JSON.stringify(stationInfo));
            window.location="/cityBus/lineListCityBus?searchType=4";
        });

        /*返程*/
        $('.back').on(clickEvent,function () {
            var parent = $(this).parent().siblings('.location');
            var departStationId = $(parent).data('arrivestationid');
            var arriveStationId = $(parent).data('departstationid');
            var departTime = $(parent).data('departtime');
            var stationInfo = {
                departStationId:departStationId,
                arriveStationId:arriveStationId,
                departTime:departTime
            }
            sessionStorage.setItem('stationInfo',JSON.stringify(stationInfo));
            window.location="/cityBus/lineListCityBus?searchType=4";

        })
    }

    orderClickEvent();
}

function getFormatTime(str){
    var time = new Date(parseInt(str));
    var td = new Date();
    td = new Date(td.getFullYear(),td.getMonth(),td.getDate());
    var od=new Date(time.getFullYear(),time.getMonth(),time.getDate());
    var xc=(od-td)/1000/60/60/24;

    var timeList = {
        year: time.getFullYear(),
        month: formatNumber(time.getMonth() + 1),
        day: formatNumber(time.getDate()),
        hour: formatNumber(time.getHours()),
        minute: formatNumber(time.getMinutes()),
        seconds: formatNumber(time.getSeconds()),
        week: getTheWeek(time),
        timeDiff: xc,
    }
    return timeList;
}

function formatNumber(str){
    if( (str + '').length == 1){
        if( str < 10 ){
            str = '0' + str;
        }
    }
    return str;
}

function getTheWeek(date){

    var week = '';
    if(date.getDay()==0) week="周日";
    else if(date.getDay()==1) week="周一";
    else if(date.getDay()==2) week="周二";
    else if(date.getDay()==3) week="周三";
    else if(date.getDay()==4) week="周四";
    else if(date.getDay()==5) week="周五";
    else if(date.getDay()==6) week="周六";

    return week;
}

function searchLine(){
    if (lineParam["departAreaId"] && lineParam["arriveAreaId"]){
        // 进入搜索线路
        sessionStorage.setItem('stationInfo',JSON.stringify(lineParam));
        window.location="/cityBus/lineListCityBus?searchType=2";
    }
}

//搜索页面的操作
// 选择地址
var _isInitsa = false, _myIScrollsa;
$('.select-city-btn').on(clickEvent, function() {
    var _this = $(this);
    $('#areaCityPanel .area-content').html('');
    $('#areaCityPanel').hide();
    if(_this.attr('id') == 'startAddr'){
        stationType = 1;
        $('#stationType').val('start')
    }else{
        stationType = 2;
        $('#stationType').val('end')
    }
    getHistoryStation(stationType);
    getOpenAreas(stationType);
    changeCityClickEvent();
    $('#search-address').popup('push', function() {
        setTimeout(function() {
            $('#search-address .wrapper').css('height', $(window).height() - 44);
            _myIScrollsa = new IScroll('#searchWrapper');
        }, 300);
    }, function(data) {
        _this.val(data.name);
        searchLine();
    });
})

/*----------------------------------begin--------------------------------------------*/
function changeCityClickEvent() {
    //当前城市选择
    $('.current-city').off(clickEvent).on(clickEvent,function(){
        $('#searchResult').html('');
        $('.search-input input').val('');
        var text = $('.current-city span').text();
        var areaCode =  $("#currAreaCode").val();
        if (stationType == 1){
            // $('title').html("你从哪出发-"+userInfo.providerName);
        }else if (stationType == 2){
            // $('title').html("你想到哪儿-"+userInfo.providerName);
        }
        $('#select-Citys').setPopupData(text);
        $('#select-Citys').closePopup(function() {
            if(_myIScrollsc) {
                _myIScrollsc.destroy();
                _myIScrollsc = null;
            }
        });
    });
}

//关闭地址查询
$('#search-address #closeBtn').on('click', function() {
    // $('title').html('定制班线-'+userInfo.providerName);
    $('#search-address').closePopup(function() {
        if(_myIScrollsa) {
            _isInitsa = false;
            _myIScrollsa.destroy();
            _myIScrollsa = null;
        }
    });
});

var cpLock = true;
var  _isInitsa = false;
$('#textSearchMap').focus(function() {
    showSearchAddressPanel();
}).off('input').on({
    //解决input事件在输入中文时多次触发事件问题
    compositionstart: function () {//中文输入开始
        cpLock = false;
    },
    compositionend: function () {//中文输入结束
        cpLock = true;
    },
    input: function () {//input框中的值发生变化
        setTimeout(function(){
            if(cpLock){
                //输入关键词搜索地图
                var text = $.trim($('#textSearchMap').val());
                AMap.service(["AMap.PlaceSearch"], function() {
                    var placeSearchOptions = { //构造地点查询类
                        pageSize: 8,
                        pageIndex: 1,
                        city:  $('#areaCode').val(),
                        extensions:'all',
                        citylimit:false,
                        type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
                        '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
                        '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
                    };

                    //地理位置搜索
                    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
                    placeSearch.search(text, function(status, result) {
                        var list = [];
                        if(text.length <= 0) status = 'no_data';
                        if(status == 'complete') {
                            list = result.poiList.pois;
                        }

                        var strHtml = '';
                        for(var i = 0; i < list.length; i++) {
                            var name = list[i].name.replace(text, '<span class="imp-blue">' + text + '</span>');
                            var address = list[i].pname+""+list[i].cityname+""+list[i].adname+""+list[i].address;
                            address = address.replace(text, '<span class="imp-blue">' + text + '</span>');
                            strHtml += '<li data-areaid="'+list[i].adcode+'" data-name="' + list[i].name + '" data-address="' + list[i].address + '" ' +
                                'data-cityname="'+list[i].cityname+'"  data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '">'+
                                '<span class="icon iconfont icon-historical_location_icon"></span>' +
                                '<div class="sui-cell-map">'+
                                '<div class="address">' + name + '</div>'+
                                '<div class="city-area">' + address + '</div>'+
                                '</div>'+
                                '</li>';
                        }
                        $('#searchWrapper ul').html(strHtml);
                        searchResultClickEvent();
                    });
                });
            }
        },0)
    }
});

function searchResultClickEvent() {
    $('#searchWrapper li').off('tap').on('tap', function() {
        var data = {
            name:$(this).data('cityname') +'·'+$(this).data('name'),
            stationName:$(this).data('name'),
            cityName:$(this).data('cityname'),
            address:$(this).data('address'),
            lat:$(this).data('lat'),
            lng:$(this).data('lng'),
            areaid:$(this).data('areaid'),
            cityId:''
        }

        if($('#stationType').val() == 'start'){
            lineParam['departAreaName'] = data.name;
            lineParam['departLng'] = data.lng;
            lineParam['departLat'] = data.lat;
            lineParam['departAreaId'] = data.areaId;
        }else {
            lineParam['arriveAreaName'] = data.name;
            lineParam['arriveLng'] = data.lng;
            lineParam['arriveLat'] = data.lat;
            lineParam['arriveAreaId'] = data.areaId;
        }
        saveSearchRecord(data,function (result) {
            if($('#stationType').val() == 'start'){
                lineParam.departAreaId = result.areaId;
                lineParam.departCityId = result.cityId;
            }else {
                lineParam.arriveAreaId = result.areaId;
                lineParam.arriveCityId = result.cityId;
            }

            hideSearchAddressResult();

            $('#search-address').setPopupData(data);
            $('#search-address').closePopup(function () {
                if(_myIScrollsa) {
                    _isInitsa = false;
                    _myIScrollsa.destroy();
                    _myIScrollsa = null;
                }
            });
        });

    });
}

/*用户历史搜索站点保存*/
function saveSearchRecord(data,callback){
    var param = {
        token:serverUrl.token,
        lat: data.lat,
        lng:  data.lng,
        address: data.stationName+'#'+data.address+'#'+data.areaCode,
        businessType:7,  // 定制班线：4
        stationType: 0, // 只保存出发地信息1 ，只保存目的地信息2，两个都保存传3
    }

    request(commuteApi.saveSearchStation,param).then(function(res){
        if(res.code==0){
            callback(res.data);
        }
    })
}

//显示搜索结果面板
var showSearchAddressPanel = function() {
    $('#mapResult').show();
    $('#adrsResult').hide();
    $('#cancelBtn').show();
    $('#closeBtn').hide();

    if(_isInitsa) return;
    _isInitsa = true;

    //自定义滚动条
    var stY = 0, etY = 0;
    $('#searchWrapper').on('touchstart', function() {
        etY = $(this).scrollTop();
        stY = event.touches[0].pageY;
    });
    $('#searchWrapper').on('touchmove', function(event) {
        var scrollY = stY - event.touches[0].pageY;
        $(this).scrollTop(scrollY + etY);
    });
}

//隐藏搜索结果面板
var hideSearchAddressResult = function() {
    $('#mapResult').hide();
    $('#adrsResult').show();
    $('#cancelBtn').hide();
    $('#closeBtn').show();
    $('#textSearchMap').val('');
}

$('#cancelBtn').on(clickEvent, function() {
    hideSearchAddressResult();
});

/*用户历史搜索站点查询*/
function getHistoryStation(stationType){
    var param = {
        businessType:7,
        token:serverUtil.token,
        stationType:stationType
    }
    //查询行程
    request(commuteApi.getHistoryStation,param).then(function(res){
        if(res.code == 0){
            var stationList = res.data;
            if(stationList.length == 0){
                $('.historySearch').hide(); // 隐藏行程
                return;
            }
            $('.historySearch').show(); // 隐藏行程
            drawHistoryStation(stationList);
        }
    });

}
/**
 * 获取并填充历史记录
 */
function drawHistoryStation(stationList){
    var strHtml = '';
    $('#historyStation').html('');

        for(var i=0;i<stationList.length;i++){
            var addressContent = stationList[i];
            var address = addressContent.address.split('#');
            strHtml += '<div class="address" data-areaId="'+addressContent.areaId+
                '" data-lng="'+addressContent.longitude+
                '" data-city="'+address[2]+
                '" data-area="'+address[3]+
                '" data-lat="'+addressContent.latitude+'"' +
                ' data-city-id="'+addressContent.cityId+'"> ' +
                '    <span class="icon iconfont icon-historical_location_icon"></span>' +
                '    <div class="address-name">'+address[0]+'</div>' +
                '    <div class="address-detail">'+address[1]+'</div>' +
                '</div>'
        }
        $('#historyStation').html(strHtml);
        historyStationClickEvent();
        $('#historySearch').show();
}

function historyStationClickEvent() {
    //点击历史记录返回首页
    $('#historySearch .station-group .address').off(clickEvent).on(clickEvent, function () {
        var data = {};
        data['city'] = $(this).data('city');
        data['areaName'] = $(this).data('area');
        data['name'] = $(this).data('city') + ' · ' + $(this).find('.address-name').text();
        data['address'] = $(this).find('.address-detail').text();
        data['lng'] = $(this).data('lng');
        data['lat'] = $(this).data('lat');
        data['areaId'] = $(this).data('areaid');
        data['cityId'] = $(this).data('city-id');

        if ($('#stationType').val() == 'start'){
            lineParam['departAreaName'] = data['areaName'];
            lineParam['departCityName'] = data['city'];
            lineParam['departAreaId'] = data.areaId;
            lineParam['departLng'] = data.lng;
            lineParam['departLat'] = data.lat;
        }else{
            lineParam['arriveAreaName'] = data['areaName'];
            lineParam['arriveCityName'] = data['city'];
            lineParam['arriveAreaId'] = data.areaId;
            lineParam['arriveLng'] = data.lng;
            lineParam['arriveLat'] = data.lat;
        }

        // $('title').html('定制班线-'+userInfo.providerName);
        $('#search-address').setPopupData(data);
        $('#search-address').closePopup(function () {
            if(_myIScrollsa) {
                _isInitsa = false;
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
        });
        // $('#search-address #closeBtn').triggerHandler('click');
    });
}

function getOpenAreas(stationType) {
    var param = {
        token:serverUtil.token,
        departAreaId:1,
        departCityName:'',
        arriveAreaId:2,
        arriveCityName:'',
        lineType:2,
        stationType:stationType,
        providerId:'',
        seachType:''
    }
    //查询行程
    request(commuteApi.getOpenAreas,param).then(function(res){
        if(res.code == 0){
            var areaList = [];
            if(stationType == 1){
                 areaList = undefined != res.data.startCityList?res.data.startCityList:[];
            }else {
                 areaList = undefined != res.data.endCityList?res.data.endCityList:[];
            }
            if(areaList.length > 0){
                drawOpenAreas(areaList,stationType);
                $('#areaCityPanel').show();
                if(_myIScrollsa)_myIScrollsa.refresh();
            }
        }
    });

}

//推荐地区选择
function chooseCityOrArea(){

    $('#areaCityPanel .station-group .station-item').off(clickEvent).on(clickEvent,function(){
        var _this = $(this);
        var cityName = _this.parent().prev('.subtitle').text();
        var areaName = _this.text();
        var areaId = _this.attr('data-area');

        if($('#stationType').val() == 'start'){
            lineParam['departAreaName'] = areaName;
            lineParam['departCityName'] = cityName;
            lineParam['departAreaId'] = areaId;
            lineParam['departLng'] = '';
            lineParam['departLat'] = '';
        }else {
            lineParam['arriveAreaName'] = areaName;
            lineParam['arriveCityName'] = cityName;
            lineParam['arriveAreaId'] = areaId;
            lineParam['arriveLng'] = '';
            lineParam['arriveLat'] = '';
        }
        var data = {
        };
        data['name'] = cityName + ' · ' + areaName;
        data['areaId'] = areaId;
        $('#search-address').setPopupData(data);
        $('#search-address').closePopup(function () {
            if(_myIScrollsa) {
                _isInitsa = false;
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
        });
    });
}

function drawOpenAreas(areaList,stationType) {
    for(var i = 0; i < areaList.length; i++){
        var cityAndAreaHtml = '';
        var cityItem = areaList[i];
        cityAndAreaHtml += '<h5 class="subtitle">'+ cityItem.name +'</h5>';
        cityAndAreaHtml += '<div class="station-group">' +
            '<div class="station-item" data-area="' + cityItem.areaId + '" data-station-type="'+stationType+'">' +
            '<span >全部地区</span>' +
            '</div>';

        for (var j = 0; j < cityItem.childrenAreaList.length; j++){
            var area = cityItem.childrenAreaList[j];
            if(!area.name){
                continue;
            }
            cityAndAreaHtml += '<div class="station-item" data-area="' + area.areaId + '" data-station-type="'+stationType+'"><span >' + area.name + '</span></div>';
        }
        cityAndAreaHtml += '</div>';

        $('#areaCityPanel .area-content').append(cityAndAreaHtml);
        chooseCityOrArea();
    }
}


/*=------------------打开切换城市-------------------------------*/

// 打开选择城市
var _myIScrollsc;
var bindScrollsc = function(el) {
    if(_myIScrollsc) {
        _myIScrollsc.destroy();
        _myIScrollsc = null;
    }
    setTimeout(function() {
        $('#select-Citys .wrapper').css('height', $(window).height());
        _myIScrollsc = new IScroll(el + ' .wrapper');

        retrieveWord(function (scroEl) {
            _myIScrollsc.scrollToElement(scroEl.attr('href'));
        });

        // 这句不能少，否则超出屏幕不能滚动。
        if(_myIScrollsc) _myIScrollsc.refresh();
    }, 300);
}

/* 字母快速检索 */
function retrieveWord(callback) {
    var $city = $('.nav-city'),
        $city_li = $city.find('li');
    var city_h = 0;

    $city_li.each(function () {
        city_h += $(this).height();
    });

    $city.css('height', city_h);

    $('.nav-city a').on(clickEvent, function (e) {
        e.preventDefault();

        /*弹窗*/
        var text = $(this).text();
        $('.pop-special').text(text).fadeIn().css('opacity','0.6');
        setTimeout(function () {
            $('.pop-special').fadeOut();
        },1200);

        if(callback instanceof Function) {
            callback($(this));
        }
        // 这句不能少，否则超出屏幕不能滚动。
        if(_myIScrollsc) _myIScrollsc.refresh();
    });
}


/*
*   切换选择城市
* */
$('#setCityButton').on(clickEvent, function() {
    var _this = $(this);
    $('#select-Citys').popup('push', function() {
        initOpenCity();
    }, function(data) {
        _this.text(data);
    });
});

function initOpenCity() {
    var param = {
        token:serverUtil.token,
        departAreaId:lineParam.departAreaId,
        departCityName:lineParam.departCityName,
        arriveAreaId:lineParam.arriveAreaId,
        arriveCityName:lineParam.arriveCityName,
        lineType:2,
        stationType:stationType,
        providerId:'',
        seachType:0
    }
    //查询行程
    request(commuteApi.getOpenCitys,param).then(function(res){
        if(res.code == 0){
            var cityList = res.data;
            if(cityList.length > 0){
                drawOpenCityList(cityList);
                bindScrollsc('#select-Citys');
            }
        }
    });
}

function drawOpenCityList(cityList){
    var html="";
    for(i= 0;i<cityList.length;i++){
        var city = cityList[i];
        if($('#city'+city.firstLetter+'').length>0){
            if($('#'+city.name).length<=0){
                html = '<li id="'+city.name+'" data-area-code="'+city.areaCode+'" data-city-id="'+city.areaId+'">'+city.name+"</li>" ;
                $("#city"+city.firstLetter+'').append(html);
            }
        }else{
            html = '<div class="sui-list-title" id="#city'+city.firstLetter+'">'+city.firstLetter+'</div>'+
                '<ul id="city'+city.firstLetter+'" class="sui-list"><li id="'+city.name+'" ' +
                'data-area-code="'+city.areaCode+'" data-city-id="'+city.areaId+'">'+city.name+"</li></ui>" ;
            $("#cityWrapper .city-list").append(html);

            var cityHtml='<li><a href="#city'+city.firstLetter+'">'+city.firstLetter+'</a></li>';
            $('.nav-city').append(cityHtml);
        }

        cityLiClickEvent();
    }
    function cityLiClickEvent() {
        $('#cityWrapper li').off('tap').on('tap', function() {
            $('#searchResult').html('');
            $('.search-input input').val('');
            var areaCode = $(this).data('area-code');
            var cityId = $(this).data('city-id');
            var text = $(this).text();
            $("#areaCode").val(areaCode);
            $("#cityId").val(cityId);
            if (stationType == 1){
                // $('title').html("你从哪出发-"+userInfo.providerName);
            }else if (stationType == 2){
                // $('title').html("你想到哪儿-"+userInfo.providerName);
            }

            //重新恢复搜索框功能
            $('#search-address .search-bar .search-input').css('background','#FFFFFF');
            $('#search-address .search-bar .search-input input').css('background','#FFFFFF');
            $('#search-address .search-bar .search-input input').val('').removeAttr("disabled");
            // $('#currentAddress').hide();
            $('#select-Citys').setPopupData(text);
            $('#select-Citys').closePopup(function() {
                if(_myIScrollsc) {
                    _myIScrollsc.destroy();
                    _myIScrollsc = null;
                }
            });
        });
    }
}


/*搜索城市*/
var sLock = true;
$('#select-Citys .search-input input').off('input').on({
    compositionstart: function () {//中文输入开始
        sLock = false;
    },
    compositionend: function () {//中文输入结束
        sLock = true;
    },
    input:function(){
        setTimeout(function(){
            if (sLock){
                var word = '';
                var self = $('#select-Citys .search-input input').val();
                self = $.trim(self.toLowerCase());
                $('#cityWrapper .sui-list-title').show();
                $('#select-Citys li').show();
                if (self != '' && self != null){
                    $('#cityWrapper ul').each(function(){
                        var flag = false;
                        var index = $(this).index();
                        $(this).find('li').each(function () {
                            var strHtml = $(this).text();
                            if (strHtml.indexOf(self)!=-1){
                                $(this).show();
                                flag = true;
                            }
                            else{
                                $(this).hide();
                            }
                        })
                        if (!flag){
                            word = $(this).prev().text();
                            $(this).prev().hide();
                            flag = false;
                        }
                        $('.nav-city').find('li').each(function () {
                            var text = $(this).text();
                            if (text == word){
                                $(this).hide();
                            }
                        })
                    })
                }
            }
        },0);
    }
})


// 关闭选择城市
$('#select-Citys #closeCitys').on('click', function() {
    // if (stationType == 1){
    //     $('title').html("你从哪出发-"+userInfo.providerName);
    // }else if (stationType == 2){
    //     $('title').html("你想到哪儿-"+userInfo.providerName);
    // }
    $('#select-Citys').closePopup(function() {
        if(_myIScrollsc) {
            _myIScrollsc.destroy();
            _myIScrollsc = null;
        }
    });
});
/*-----------------------------------打开城市列表-------------------------------*/

/*-------------------------------end----------------------------*/

/*---------------------------------begin-------------------------------
    主页面的数据接口
*/
function getFutureOrderList() {
    var param = {
        businessType:7,
        token:serverUtil.token
    }
    //查询行程
    request(commuteApi.getFutureOrderList,param).then(function(res){
        if(res.code == 0){
            var scheduleList = res.data;
            if(scheduleList.length == 0){
                $('.scheduling').hide(); // 隐藏行程
                return;
            }
            $('.scheduling').show(); // 隐藏行程
            drawSchedulHtml(scheduleList);
        }
    });
}

function getLatelyOrderList() {
    var param = {
        businessType:7,
        token:serverUtil.token
    }
    //查询订单
    request(commuteApi.getLatelyOrderList,param).then(function(res){
        if(res.code==0){
            var oderList = res.data;
            if(oderList.length == 0){
                $('.near-order').hide(); // 隐藏最近订单
                return;
            }
            $('.near-order').show();
            drawOrderList(oderList);
        }
    });
}

function getAdList() {
    var param = {
        provider_id:'',
        position_code:'index-banner',
        operator_id:serverUtil.token
    }
    //查询行程
    request(commuteApi.getAdList,param).then(function(res){
        if(res.code == 0){
            var adList = res.list;
            if(adList.length == 0){
                $('#swpBanner').hide(); // 隐藏行程
                return;
            }
            $('#swpBanner').show(); // 隐藏行程
            drawAdList(adList);
        }
    });
}
function  drawAdList(adList) {
    adList.forEach(function (item,index) {
        var slideHtml = '<div class="swiper-slide" data-id="'+item.id+'" data-href='+item.target_url+'>' +
            '<a class="vert-href" href="javascript:void(0)" data-href='+item.target_url+'>' +
            '<img width="100%" height="100%" src='+item.img_url+'>' +
            '</a>' +
            '</div>';
        $('#swpBanner .swiper-wrapper').append(slideHtml);
    })
    swAdList(adList);
}
function swAdList(adList){
    /** 轮播图*/
    var mySwiper = new Swiper('#swpBanner .swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '#swpBanner .swiper-pagination',
        },
    });

    if(adList.length == 1){
        $('#swpBanner .swiper-pagination').hide();
    }else {
        $('#swpBanner .swiper-pagination').show();
    }

    $('#swpBanner .swiper-container .swiper-slide').on('click mousedown', function(e) {
        var _this =$(this);
        var param = {
            id:_this.data('id'),
            operator_id:""
        }
        var adUrl = _this.data('href');
        adClicked(param);
        window.location = adUrl;
    })
}
function adClicked(param) {
    //查询行程
    request(commuteApi.adClicked,param).then(function(res){
        if(res.code == 0){
        }
    });
}

function getHotLineList() {
    var param = {
    }
    //查询行程
    request(commuteApi.getHotLine,param).then(function(res){
        if(res.code == 0){
            var hotLineList = res.data;
            if(hotLineList.length == 0){
                $('#hotLine').hide(); // 隐藏行程
                return;
            }
            $('#hotLine').show(); // 隐藏行程
            drawHotLineList(hotLineList);
        }
        initFooter();
    });
}

function  drawHotLineList(hotLineList) {
    hotLineList.forEach(function (item,index) {
        var icon = '';
        if(item.haveSpeacial == 1){
            icon = '<span class="icon iconfont icon-Special_price_icon"></span>';
        }
        var lineHtml = '<div class="hotline" haveSpeacial="'+item.haveSpeacial+'" lineId="'+item.id+'" ' +
            '               lineName="'+item.lineName+'">' +icon+ item.lineName+''+
            '                    </div>';
        $('#hotLine .line-list').append(lineHtml);
    })

    var hotLineClickEvent = function () {
        $(".hotline").on(clickEvent,function() {
            // lineType 1.定制  2.通勤 3旅游'
            var lineId = $(this).attr("lineid");
            var lineName = $(this).attr('lineName');
            if (undefined != lineName && lineName != ''){
                window.location="/cityBus/lineListCityBus?lineId=" + lineId +"&searchType=1";
            }
        });
    }

    hotLineClickEvent();
}

function initFooter() {
    // var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // if(undefined != userInfo){
    //     $('footer .provider-name').text(userInfo.providerName);
    //     $('footer .provider-tips').text(isEmpty(userInfo.provider.introduce)?'安全便捷的线上出行平台':userInfo.provider.introduce);
    // }
    $('footer .provider-name').text('中交出行');
    $('footer .provider-tips').text('安全便捷的线上出行平台');
}
/*-------------------------------end----------------------------*/

/*验证当前城市是否开通该业务*/
function checkCityIsOpen(){
    var cityName = $('#setCityButton').text();
    initPlaceSearch();
    placeSearch.search(cityName, callback); // 获取当前城市名
    function callback(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var param = {
                providerId: providerId,
                lineType: 2,  // 1.定制  2.通勤 3旅游'
            }
            var location = result.poiList.pois[0].location;
            param.lng = location.lng;
            param.lat = location.lat;

            request(commuteApi.getIsOpenCity,param).then(function(res){
                if (res.code == 0 ){
                    if(res.data){
                        $('#currentAddress').show();
                        $('#search-address .search-bar .search-input').css('background','#FFFFFF');
                        $('#search-address .search-bar .search-input input').val('').removeAttr("disabled");
                    }else {
                        $('#currentAddress').hide();
                        $('#search-address .search-bar .search-input').css('background',' #F2F2F2');
                        $('#search-address .search-bar .search-input input').val('当前城市未开通线路').attr("disabled","disabled").css('background','#F2F2F2');
                    }
                }
            })
        }else{
            $('#currentAddress').hide();
            $('#search-address .search-bar .search-input').css('background',' #F2F2F2');
            $('#search-address .search-bar .search-input input').val('当前城市未开通线路').attr("disabled","disabled").css('background','#F2F2F2');
        }
    }
}

function initPlaceSearch() {
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearchOptions = { //构造地点查询类
            pageSize: 10,
            pageIndex: 1,
            city: $("#areaCode").val(), //城市
            extensions: 'all',
            type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
            '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
            '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
        };

        //地理位置搜索
        placeSearch = new AMap.PlaceSearch(placeSearchOptions);
    })
}

//后台搜索高德地址后回调
function searchMapAddCallback(data){

    var cityCode = data.addressComponent.citycode;
    $('#setCityButton').html(data.cityName);
    $('.current-city span').html(data.cityName);
    $("#areaCode").val(cityCode);
    $("#currAreaCode").val(cityCode);

    initPlaceSearch();

    $('#currentAddressDetail').attr('data-city',data.cityName);
    $('#currentAddressDetail').attr('data-area',data.areaName);
    $('#currentAddressDetail').attr('data-cityId',data.cityId);
    $('#currentAddressDetail').attr('data-areaId',data.areaId);
    $('#currentAddressDetail').html(data.address);
    $('.startAddr').val(data.city + ' · ' +data.address);
    $('.gather').show();
    $('#currentAddress').show();
}

$(function () {
    // getBusinessTypes("commute");
    // 自动定位
    AMap.plugin('AMap.Geocoder',function(){
        // if(lineParam["departCityName"] == '') {
        //     wxInitConfig(shareObj,getGpsCallback);
        // }
    })

    getFutureOrderList();
    getLatelyOrderList();
    getAdList();
    getHotLineList();
    var param = {
        gps:''
    }
    request(commonApi.getGpsLocation,param).then(function(res){
        if(res.code == 0){
            var data  = res.data;
            $('#currentAddressDetail').data('city-name',data.cityName);
            $('#currentAddressDetail').data('area-name',data.areaName);
            $('#currentAddressDetail').data('area-id',data.areaId);
            $('#currentAddressDetail').data('address',data.address);
            $('#currentAddressDetail span').html(data.address);
            $('#currentAddress').show();
        }else {
            $('#currentAddress').hide();
        }

        checkCityIsOpen();
        //当前位置选择
        $('#currentAddressDetail').off(clickEvent).on(clickEvent,function(){
            var _this = $(this);
            var data = {};
            data['name'] = _this.data('city-name') + ' · ' + _this.data('address');
            data['lng'] = _this.data('lng');
            data['lat'] = _this.data('lat');
            data['areaId'] = _this.data('area-id');

            if ($('#stationType').val() == 'start'){
                lineParam['departAreaName'] = _this.data('area-name');
                lineParam['departCityName'] = _this.data('city-name');
                lineParam['departAreaId'] = _this.data('area-id');
                lineParam['departLng'] = '';
                lineParam['departLat'] = '';
            }else {
                lineParam['arriveAreaName'] = _this.data('area-name');
                lineParam['arriveCityName'] = _this.data('city-name');
                lineParam['arriveAreaId'] = _this.data('area-id');
                lineParam['arriveLng'] = '';
                lineParam['arriveLat'] = '';
            }

            $('#search-address').setPopupData(data);
            $('#search-address').closePopup(function () {
                if(_myIScrollsa) {
                    _isInitsa = false;
                    _myIScrollsa.destroy();
                    _myIScrollsa = null;
                }
            });
        });

    });
})