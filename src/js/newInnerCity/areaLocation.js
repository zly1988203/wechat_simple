var _map,_isInitsa = false, _mapScroll, marker,polygon;

//加载地图
var loadMaps = function(lng, lat) {
    if(_map) return;
    _mapScroll = new IScroll('#mapWrapper');
    _map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom:13,
        // center: [lng, lat]
    });

    addBeiJing();
    var path = [
        [116.169465,39.932670],
        [116.160260,39.924492],
        [116.186138,39.879817],
        [116.150625,39.710019],
        [116.183198,39.709920],
        [116.226950,39.777616],
        [116.421078,39.810771],
        [116.442621,39.799892],
        [116.463478,39.790066],
        [116.588276,39.809551],
        [116.536091,39.808859],
        [116.573856,39.839643],
        [116.706380,39.916740],
        [116.657285,39.934545],
    ];

    var path1 = [
        [116.573856,39.839643],
        [116.706380,39.916740],
        [116.657285,39.934545],
        [116.600293,39.937770],
        [116.540039,39.937968],
        [116.514805,39.982375],
        [116.499935,40.013710],
        [116.546520,40.030443],
        [116.687668,40.129961],
        [116.539697,40.080659],
        [116.503390,40.058474],
        [116.468800,40.052578]
    ];

    var path2 = [
        [116.169465,39.932670],
        [116.160260,39.924492],
        [116.186138,39.879817],
        [116.150625,39.710019],
        [116.183198,39.709920],
        [116.226950,39.777616],
        [116.421078,39.810771],
        [116.442621,39.799892],
        [116.463478,39.790066],
        [116.588276,39.809551],
        [116.687668,40.129961],
        [116.539697,40.080659],
        [116.503390,40.058474],
        [116.468800,40.052578]
    ];


    // var polygon = new AMap.Polygon({
    //     map: _map,
    //     fillOpacity:0.4,
    //     // path: path
    // });

    //添加标注
    marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(25, 36),
            imageSize: new AMap.Size(25, 36),
            image: '../../dist/images/newInnerCity/icon_marker.png'
        }),
        position: _map.getCenter()
    });
    // marker.setMap(_map);

    //移动地图，标注固定在中心点
    _map.on('mapmove', function() {
        marker.setPosition(_map.getCenter());
    });

    //回到原点
    $('#currLocation').on('click', function() {
        _map.panTo([lng, lat]);
    })

    //移动结束
    searchMaps();

    _map.on('moveend', function() {
        searchMaps();
        var marker2InPolygon  = polygon.contains(marker.getPosition());
        if(marker2InPolygon == false){
            $('#mapResult li').removeClass('active');
        }
        marker.setLabel({
            content:marker2InPolygon?'内部':'外部',
            offset:new AMap.Pixel(20,0)
        });
    });

}

//查询地图周边
var searchMaps = function() {

    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1
        });

        placeSearch.searchNearBy('', _map.getCenter(), 200, function(status, result) {
            if(status == 'error' || status == 'no_data') {
                $('#mapResult').html('');
                return;
            }
            var list = result.poiList.pois;
            var strHtml = '';
            for(var i = 0; i < list.length; i++) {
                strHtml += '<li data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '" '+ (i == 0 ? 'class="active"' : '') +'>' +
                    '<div class="sui-cell-map-result">' +
                    '<div class="left">' +
                    '<h1>' + list[i].name + '</h1>' +
                    '<p>' + list[i].address + '</p>' +
                    '</div>' +
                    '<div class="right">' +
                    '<button type="button">确定</button>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }
            $('#mapResult').html(strHtml);
            _mapScroll.refresh();

            $('#mapResult li').off('tap').on('tap', function() {
                $('#mapResult li').removeClass('active');
                $(this).addClass('active');
                var lat = $(this).data('lat');
                var lng = $(this).data('lng');
                marker.setPosition([lng, lat]);
            });

            //点击确定返回
            $('#mapResult button').off('click').on('click', function() {
                var li = $(this).closest('li');

                $('#search-address').setPopupData({
                    lat: li.data('lat'),
                    lng: li.data('lng'),
                    name: li.data('name'),
                    address: li.data('address')
                });
                $('#search-address .cancel').triggerHandler('click');
            });
        });
    });
}


function addBeiJing() {
    //加载行政区划插件
    AMap.service('AMap.DistrictSearch', function() {
        var opts = {
            subdistrict: 1,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        };
        //实例化DistrictSearch
        district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
        //行政区查询
        district.search('福田区', function(status, result) {
            var bounds = result.districtList[0].boundaries;
            var polygons = [];
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                     polygon = new AMap.Polygon({
                        map: _map,
                        strokeWeight: 1,
                        path: bounds[i],
                        fillOpacity: 0.7,
                        fillColor: '#CCF3FF',
                        strokeColor: '#CC66CC'
                    });
                    polygons.push(polygon);
                }
                _map.setFitView();//地图自适应
            }
        });
    });
}


AMap.service(["AMap.PlaceSearch"], function() {
    var placeSearchOptions = { //构造地点查询类
        pageSize: 10,
        pageIndex: 1,
        city: $("#areaCode").val(), //城市
    };

    //地理位置搜索
    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
});

var cpLock = true;
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
                placeSearch.search(text, function(status, result) {
                    var list = [];
                    if(text.length <= 0) status = 'no_data';
                    if(status == 'complete') {
                        list = result.poiList.pois;
                    }

                    var strHtml = '';
                    for(var i = 0; i < list.length; i++) {
                        var name = list[i].name.replace(text, '<span class="imp-blue">' + text + '</span>');
                        var address = list[i].address.replace(text, '<span class="imp-blue">' + text + '</span>');
                        strHtml += '<li data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '">'+
                            '<div class="sui-cell-map">'+
                            '<div class="address">' + name + '</div>'+
                            '<div class="city-area">' + address + '</div>'+
                            '</div>'+
                            '</li>';
                    }
                    $('#searchWrapper ul').html(strHtml);
                    //_myIScrollsa.refresh();
                    $('#searchWrapper li').off('tap').on('tap', function() {
                        _map.panTo([$(this).data('lng'), $(this).data('lat')]);
                        hideSearchAddressResult();
                    });
                });
            }
        },0)
    }
});

//显示搜索结果面板
var showSearchAddressPanel = function() {
    $('#searchWrapper').show();
    $('.map-panel').hide();
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
    $('#searchWrapper').hide();
    $('.map-panel').show();
    // if(dataParam){
    //     loadMaps(lineParam['arriveLng'],lineParam['arriveLat']);
    // }
    _mapScroll.refresh();
}

$(function () {
    //TODO 需要从后台来的数据
    var lat = '39.932670';
    var lng = '116.169465';
    loadMaps(parseFloat(lng),parseFloat(lat));
})

