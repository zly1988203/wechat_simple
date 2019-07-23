$(function() {
    //header初始化
    $.headerInit();

    dataUtils.exChangeVal($('.exchange'),$('#startAddr'),$('#endAddr'));

    dataUtils.selectDate({el_trigger:$('#startTime'),el_popup:$('#select-date')});

    dataUtils.reSetWidth($('#startTime'));

    // ================================= 选择地址相关 ===================================

    adrsUtils.selectAddress({el_trigger:$('.search-station li'),el_popup:$('#search-address')});


    //点击地址返回数据
    var targetType = isAndroid() ? 'tap' : 'click';

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
