var click_event = isAndroid() ? 'tap' : 'click';
// 获取地址栏参数
var getUrlRequest = getRequest();
// 获取车企信息
//用于测试,记得删除
uInfo = {
    providerName: "中交出行"
}
localStorage.setItem("userInfo", JSON.stringify(uInfo));
//测试结束
var userInfo = JSON.parse(localStorage.getItem("userInfo"));
$(function () {
    // init();
    //根据首页传参searchType判断搜索类型
    if ("searchType" in getUrlRequest) {
        getSearchLine(parseInt(getUrlRequest.searchType));
    } else {
        getSearchLine(4);//扫码进入
    }
});
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
//时间戳格式化 str：时间戳 timeType：格式化时间类型
function formatTime(str, timeType) {
    if (isNumber(str)) {
        var time = new Date(parseInt(str));
        if (timeType == 1) {
            // hh:mm
            str = formatNum(time.getHours()) + ':' + formatNum(time.getMinutes());
        } else {
            // yyyy-MM-dd hh:mm:ss
            str = time.getFullYear() + '-' + formatNum(time.getMonth() + 1) + '-' + formatNum(time.getDate())
                + ' ' + formatNum(time.getHours()) + ':' + formatNum(time.getMinutes()) + ':' + formatNum(time.getSeconds());
        }
        return str;
    } else {
        return '';
    }
}
//数字格式化：数字为个位数时，前面添加0
function formatNum(str) {
    if ((str + '').length == 1) {
        if (str < 10) {
            str = '0' + str;
        }
    }
    return str;
}
//判断是否是非负整数
function isNumber(str) {
    var r = /^[1-9]\d*|0$/;
    return r.test(str);
}
// 返回
$('#goBack').on(click_event, function () {
    window.history.go(-1);
})

/* 请求查询结果列表
    *searchType 1-行政地区搜索或城市搜索  2-站点查询 4-热门线路
*/
function getSearchLine(searchType) {
    var lineApi = "",
        pram = {},
        distrib = null,
        stationInfo = JSON.parse(sessionStorage.getItem('stationInfo'));
    if (searchType == 1) {
        lineApi = commuteApi.getLineList;
        pram = {
            departDate: formatTime(stationInfo.departTime),
            departAreaId: stationInfo.departAreaId,
            departAreaName: stationInfo.departAreaName,
            arriveAreaId: stationInfo.arriveAreaId,
            arriveAreaName: stationInfo.arriveAreaName,
            departLat: stationInfo.departLat,
            departLng: stationInfo.departLng,
            arriveLat: stationInfo.arriveLat,
            arriveLng: stationInfo.arriveLng
        };
    } else if (searchType == 2) {
        lineApi = commuteApi.searchBusByStationId;
        pram = {
            token: serverUtil.token,
            departDate: formatTime(stationInfo.departTime),
            departStationId: stationInfo.departStationId,
            arriveStationId: stationInfo.arriveStationId,
            lineType: 2
        };
    } else if (searchType == 4) {
        lineApi = commuteApi.getHotLineList;
        if ("distrib" in getUrlRequest) {
            distrib = 1;
        }
        pram = {
            distrib: distrib,
            lineId: getUrlRequest.lineId
        };
    }
    $.showLoading("加载中...");
    request(lineApi, pram).then(function (res) {
        $.hideLoading();
        if (res.code == 0) {
            if (searchType == 1) {
                $('title').html(res.data.departName + " - " + userInfo.providerName);
            } else if (searchType == 2) {
                $('title').html(res.data.arriveName + " - " + userInfo.providerName);
            } else if (searchType == 4) {
                $('title').html(res.data.lineName + " - " + userInfo.providerName);
            }
            var resultList = res.data.baseBusList;
            if (resultList.length <= 0) {
                $(".result-line-list").hide();
                $(".no-line-box").show();
            } else {
                var resultListHtml = "";
                $(".result-line-list").show();
                $(".no-line-box").hide();
                for (var i = 0; i < resultList.length; i++) {
                    resultListHtml += searchLineResult(resultList[i]);
                }
                $("#resultList").html(resultListHtml);
            }
        } else {
            $.alert(res.message);
        }
    });
}

// 加载数据到页面
function searchLineResult(item) {
    var goOnStationListFirst = "";
    var goOnStationList = "";
    var goOffStationListLast = "";
    var goOffStationList = "";
    var servicesGroup = "";
    var lineInfoBox = "";
    var stationDistanceOn = "";
    var stationDistanceOff = "";
    // 遍历上车点
    for (var i = 0; i < item.goOnStationList.length; i++) {
        if (item.goOnStationList[i].stationDistance >= 1000) {
            stationDistanceOn = (item.goOnStationList[i].stationDistance / 1000).toFixed(2) + "km";
        } else {
            stationDistanceOn = item.goOnStationList[i].stationDistance + "m";
        }
        if (i == 0) {
            goOnStationListFirst += `<div class="station-item get-on gray">
                                        <div class="item-name">${item.goOnStationList[i].stationName}</div>
                                        <div class="item-type">起点</div>
                                        ${item.goOnStationList[i].stationDistance ? `<div class="item-distance"><i></i>${stationDistanceOn}</div>` : ''}
                                    </div>`;
        } else {
            goOnStationList += `<div class="station-gray">
                                <div class="station-item get-on gray">
                                    <div class="item-name">${item.goOnStationList[i].stationName}</div>
                                    <div class="item-type">途径</div>
                                    ${item.goOnStationList[i].stationDistance ? `<div class="item-distance"><i></i>${stationDistanceOn}</div>` : ''}
                                </div>
                            </div>`;
        }
    }
    // 遍历下车点
    for (var i = 0; i < item.goOffStationList.length; i++) {
        if (item.goOffStationList[i].stationDistance >= 1000) {
            stationDistanceOff = (item.goOffStationList[i].stationDistance / 1000).toFixed(2) + "km";
        } else {
            stationDistanceOff = item.goOffStationList[i].stationDistance + "m";
        }
        if (i == item.goOffStationList.length - 1) {
            goOffStationListLast += `<div class="station-item get-off">
                                        <div class="item-name">${item.goOffStationList[i].stationName}</div>
                                        <div class="item-type">终点</div>
                                        ${item.goOffStationList[i].stationDistance ? `<div class="item-distance"><i></i>${stationDistanceOff}</div>` : ''}
                                    </div>`;
        } else {
            goOffStationList += `<div class="station-gray">
                                <div class="station-item get-off gray">
                                    <div class="item-name">${item.goOffStationList[i].stationName}</div>
                                    <div class="item-type">途径</div>
                                    ${item.goOffStationList[i].stationDistance ? `<div class="item-distance"><i></i>${stationDistanceOff}</div>` : ''}
                                </div>
                            </div>`;
        }
    }
    // 遍历标签
    for (var i = 0; i < item.tagList.length; i++) {
        servicesGroup += '<span>' + item.tagList[i] + '</span>';
    }
    // 遍历时间价格
    for (var i = 0; i < item.sameStationBusList.length; i++) {
        var departTime = formatTime(item.sameStationBusList[i].departTime, 1);
        lineInfoBox += `<div class="lineInfo flex ac jcs lineInfoClick" ${i > 2 ? `style="display:none;"` : ''} data-busid=${item.id}>
                            <div class="flex ac jcs">
                                <div class="ShiftsTime">${departTime}</div>
                                <span class="spanShifts">${item.sameStationBusList[i].scheduleCode}</span>
                            </div>
                            <div class="price flex ">
                            ${item.sameStationBusList[i].specialState == 0 ? `<div class="bargainPrice"><span class="f24">￥</span><span class="f32">${item.sameStationBusList[i].sellPrice}</span></div>` : `<p class="f24">￥${item.sameStationBusList[i].sellPrice}</p><div class="bargainPrice"><span class="f24">￥</span><span class="f32">${item.sameStationBusList[i].specialPrice}</span></div>`}
                                <span class="f20"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
                            </div>
                        </div>`;
    }

    var stationList = goOnStationListFirst + goOnStationList + goOffStationList + goOffStationListLast;
    return `<li class="line-item">
                <div class="line-top">
                    ${item.totalStationDistance ? `<p>总步行${item.totalStationDistance}m</p>` : ''}
                </div>
                <div class="line-middle" data-toggle="false">
                    <div class="station-list"><i class="before"></i>${stationList}</div>
                </div>
                <div class="line-bottom">
                    <div class="services-group">${servicesGroup}</div>
                </div>
                <div class="lineInfoBox">
                    ${lineInfoBox}
                    ${item.sameStationBusList.length > 3 ? `<div class="moreLineInfo">更多</div>` : ''}
                </div>
            </li>`;
}
// 班线详情
$(document).on("click", ".lineInfoClick", function () {
    var busId = $(this).data('busid');
    window.location = "/examples/commutingBus/shiftsDetail.html?busId=" + busId;
});
// 更多
$(document).on("click", ".moreLineInfo", function () {
    $(this).css("display", "none");
    $(this).parent().find(".lineInfo ").css("display", "flex");
});
