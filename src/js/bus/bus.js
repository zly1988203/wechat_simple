var targetType = isAndroid() ? 'tap' : 'click';

$(function() {
    //header初始化
    $.headerInit();

    dataUtils.exChangeVal($('.exchange'),$('#startAddr'),$('#endAddr'));

    dataUtils.selectDate({el_trigger:$('#startTime'),el_popup:$('#select-date')});

    dataUtils.reSetWidth($('#startTime'));

    // ================================= 选择地址相关 ===================================

    adrsUtils.selectAddress({el_trigger:$('.search-station li'),el_popup:$('#search-address')});


    //点击地址返回数据

    $('#search-address .wrapper li:not(.remove-history)').on(targetType, function() {
        var data = $(this).find('h1').text();
        $('#search-address').setPopupData(data);
        $('#search-address .cancel').triggerHandler('click');
    });


    // ================================= 选择城市相关 ===================================

    adrsUtils.openCity({el_trigger: $('#setCityButton'),el_popup:$('#select-Citys') })

    AMap.plugin('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder({
        });

        if(lineParam["departCityName"] == '') {
            var shareObj = {
                url : window.location.href,
            }
            wxInitConfig(shareObj,getGpsCallback);
        }
        getGpsCallback
    })

});

var lineParam={};//保存起止点的经纬度信息
//gps定位
//后台搜索高德地址后回调
var searchMapAddCallback=function searchAddressCallback(data){
    $('#startAddr').val(data.address);
    $('#currentAddressDetail').html(data.address);
    $('#currentAddressDetail').attr('data-lng',lineParam['departLng']);
    $('#currentAddressDetail').attr('data-lat',lineParam['departLat']);
    $('#currentAddress').show();
}
var geocoder;//地图对象
//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    console.log(callbackData['longitude']);
    var gpsData=callbackData['longitude']+","+callbackData['latitude'];
    lineParam['departLng']=callbackData['longitude'];//经度
    lineParam['departLat']=callbackData['latitude'];//纬度
    var gpsParam = [callbackData['longitude'],callbackData['latitude']];
    geoCallBack(1,gpsParam);
    searchAddressByGps(gpsData,searchMapAddCallback);
    if(lineParam["arriveLng"]!='' && lineParam["arriveLat"]!=''){
        $('#searchBtn').attr("class","search-btn");
    }

}

/*行程点击切换*/
/*var index = -1;
$('.scheduling-list').find('li').each(function () {
    var isHidden = $(this).is(':hidden');
    if (!isHidden){
        index = $(this).index();   // 记录显示的下标
    }
    $('.rolling').find('li').each(function () {
        $(this).off(targetType).on(targetType,function () {
            var _index = $(this).index(); // 记录点击的下标
            $('.rolling').find('li').eq(index).removeClass('active');
            $('.rolling').find('li').eq(_index).addClass('active');
            $('.scheduling-list').find('li').eq(index).hide();
            $('.scheduling-list').find('li').eq(_index).show();
            index = _index;  // 更新显示下标
        })
    });
})*/


/*滑动切换*/
$(".scheduling").on('touchstart',function(e){

    /*记录当前显示第几个行程*/
    var index = -1;
    $('.scheduling-list').find('li').each(function(){
        var isHidden = $(this).is(':hidden');
        if (!isHidden){
            index = $(this).index();
        }
    })
    var size = $('.rolling li').length;
    var width = $(this).width();
    var startX = e.changedTouches[0].pageX;

    $(this).on('touchmove',function(e){
        var temp = e.changedTouches[0].pageX - startX;
        /*滑动超过1/4 DIV*/
        if (Math.abs(temp) >= (1/4)*temp){
            /*左划*/
            if (temp<0 ){
                $('.scheduling-list').find('li').eq(index).hide();
                if ((index-1)<0){
                    index = size-1;
                }
                else{
                    index = index-1;
                }
                $('.rolling .active').removeClass('active');
                $('.rolling').find('li').eq(index).addClass('active');
                $('.scheduling-list').find('li').eq(index).show();
                $('.scheduling').off('touchmove');
            }
            /*右划*/
            if (temp>0){
                $('.scheduling-list').find('li').eq(index).hide();
                if ((index+1)==size){
                    index = 0;
                }
                else{
                    index = index+1;
                }
                $('.rolling .active').removeClass('active');
                $('.rolling').find('li').eq(index).addClass('active');
                $('.scheduling-list').find('li').eq(index).show();
                $('.scheduling').off('touchmove');
            }
        }
    })
    return false;
}).on('touchend',function () {
    $('.scheduling').off('touchmove');
})



