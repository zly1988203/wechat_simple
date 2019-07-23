$(function () {
    function loadHistoryRcord(){
        var parma = {
            url:'',
        }
        // ajax({
        //
        // })

        var orderList = [
            {
                id:'15428545',
                startAdrs:'创业投资大厦八楼',
                startArea:'深圳市南山区',
                endAdrs:'东莞东站金贝大厦',
                endArea:'东莞市东城区'
            }
        ]
        orderList.forEach(function (item,index) {
            var $content = $('<div class="content" data-id="'+item.id+'">');
            var $location = $('<div class="location"></div>');
            var $startAdrs = '<div class="startAdrs">' +
                '            <div class="adrs">'+item.startAdrs+'</div>' +
                '            <div class="area">'+item.startArea+'</div>' +
                '        </div>';
            var $line = '<div class="center-line">' +
                '            <div class="arrow"></div>' +
                '        </div>';
            var $endAdrs = '<div class="endAdrs">' +
                '            <div class="adrs">'+item.endAdrs+'</div>' +
                '            <div class="area">'+item.endArea+'</div>' +
                '        </div>';
            var $btnList = '<div class="btn-list">' +
                '            <div  class="call-car">叫车</div>' +
                '            <div class="call-back">返程</div>' +
                '        </div>';
            $content.append($location).append($startAdrs).append($line).append($endAdrs).append($btnList);
            $('.his-order').append($content);
        })

        btnClick_event();

    }

    function btnClick_event() {
        var e_tap = isAndroid()?'tap':'click';
        $('.call-car').on(e_tap,function () {

        })
        $('.call-back').on(e_tap,function () {

        })
    }

    loadHistoryRcord();



})

var _myIScrollsa;
$('#present .select-city-btn').on('click', function() {
    var _this = $(this);

    $('#search-address').popup('push', function() {

        if(_this.val().length <= 0) {

        }else{

        }

        setTimeout(function() {
            $('#search-address .wrapper').css('height', $(window).height() - 44);
            _myIScrollsa = new IScroll('#searchWrapper');
        }, 300);


    }, function(data) {
        _this.val(data.name);
        var num = $('#present_peopleNumber').data('value');
        if(_this.attr('id') == 'startAddr'){

        }else if(_this.attr('id')== 'endAddr'){

        }
        _this.data('lng',data.lng);
        _this.data('lat',data.lat);

    });
}).backtrack({
    cancel: '#search-address .cancel',
    event: 'click'
});

//关闭地址查询
$('#search-address .cancel').on('click', function() {
    $('#search-address').closePopup(function() {
        if(_myIScrollsa) {
            _myIScrollsa.destroy();
            _myIScrollsa = null;
        }
    });
});



var cpLock = true;
var _map, _isInitsa = false

AMap.service(["AMap.PlaceSearch"], function() {
    var placeSearchOptions = { //构造地点查询类
        pageSize: 10,
        pageIndex: 1,
        city: $("#areaCode").val(), //城市
    };

    //地理位置搜索
    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
});

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
    $('.gather').hide();
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
    $('#sarchCancelbtn').hide();
    $('#closePanelBtn').show();
    $('#searchWrapper').hide();
    $('.map-panel').show();
}