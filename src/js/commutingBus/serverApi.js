//服务器地址信息
var serverUtil = {
    testUrl: 'http://10.1.21.250:8084',
    devUrl: 'https://www.easy-mock.com/mock/5cda5548e6f3ff49f1a13913/TSP_passenger_api',
    releaseUrl: '',
    token: 'YzQxN0VMTnFwZHh3UFlwRFoxdG1mZDFNc3dTdTRsdWhscE9XR0RVUS9WYUpmWE09',
    timestamp: new Date().getTime(),
    appId: '100005',
    APP_KEY: 'TAjN^AHp^7smQ2bhMoL&1DRK*mAKTA1no9zsepR4ATSxMwchksl3Uv1f5#o&hRx5',
    clientType: '4',
    appVersion: '1.1',
    deviceId: '1',
    wechatLogin: '1', //用于区分微信乘客端和APP端
    loginType: '2',
    adDomain: 'osp2.zhongjiaochuxing.com'
}

var serverUrl = serverUtil.devUrl;

//公用接口
var commonApi = {
    regOrLogin: serverUrl + '/Account/regOrLogin', //登录
    getGpsLocation: serverUrl + '/searchAddressByGps', //定位
    getPrepayInfo: serverUrl + 'pay/mockGetPrepayInfo',
}

//通勤接口
var commuteApi = {
    //首页
    getFutureOrderList: serverUrl + '/commute/optimized/getFutureOrderList',//
    getLatelyOrderList: serverUrl + '/commute/optimized/getLatelyOrderList',//
    getHotLine: serverUrl + '/commute/getHotLine',
    getHistoryStation: serverUrl + '/commute/optimized/getHistoryStation',
    saveSearchStation: serverUrl + '/busline/optimized/saveSearchStation',
    getIsOpenCity: serverUrl + '/commute/optimized/getIsOpenCity',
    getAdList: serverUrl + '/pub/ad/getAdList',
    adClicked: serverUrl + '/pub/ad/clicked',
    getOpenAreas: serverUrl + '/busline/optimized/getOpenAreas',
    getOpenCitys: serverUrl + '/busline/optimized/getOpenCitys',
    //验票
    queryDetailByOrderNo: serverUrl + '/commute/optimized/queryDetailByOrderNo',
    //下单页面
    toAddOrder: serverUrl + '/commute/toAddOrder',
    addOrder: serverUrl +'/commute/addOrder',
    queryConponByBusiness: serverUrl +'/Coupon/queryBusValidConponByBusiness',
    //日期选择页面
    calendarList: serverUrl +'/commute/optimized/calendarList',
    queryNotPayOrders: serverUrl +'/commute/queryNotPayOrders',

// 通勤班次搜索结果页
    getHotLineList: serverUrl + '/commuteLine/getHotLineList', //热门线路查询
    getLineList: serverUrl + '/commuteLine/getLineList', //用户输入搜索查询
    searchBusByStationId: serverUrl + '/commut/searchBusByStationId', //站点查询
    queryLineDetail: serverUrl + '/commute/queryLineDetail', //班次详情
    queryLineDetailByOrder: serverUrl + '/commute/optimized/queryLineDetailByOrder', //班线列获取订单详情
    


    //退款接口
    refundBatch: serverUrl + 'commute/commuteOrder/refundBatch',
}
//获取页面token
if (localStorage.getItem("token") != null) {
    serverUtil.token = localStorage.getItem("token");
} else {
    console.log('token不存在');
}
//请求

// dataDetail = genReqData(urlDetail, dataDetail);
window.Promise || document.write('<script src="//lib.baomitu.com/es6-promise/4.1.1/es6-promise.auto.min.js"><\/script>');
var request = function request(url, data = {}, sign = false, method = "POST") {
    return new Promise(function (resolve, reject) {
        data = $.extend({requestUrl:"http://keke.provider.szzjcx.com:8083"},data);
        if(sign){
            data = genReqData(url, data);
        }
        $.ajaxService({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                if (res.code == 0) {
                    resolve(res);
                } else if (res.code == 20003) {
                    // resolve(res);
                    setTimeout("javascript:location.href='/examples/bus/login.html'", 1000);
                } else {
                    resolve(res);
                    // $.alert(res.message);
                }
            },
            fail: function (err) {
                reject(err)
            }
        });
    })
}


//拼接url和参数，然后进行md5加密
function getSignStr(url, data){
	if (url === null || data === null) { 
		return ''; 
	}
	
	url = url.substring((url.indexOf('//', 0) + 2), url.length);
	
	var suffix = '?';
	var keyArray = new Array();
	for(var key in data){ 
		keyArray.push(key);
	}
	
	if (data['token'] == undefined) {
		data['token'] = '';
	}
	
	keyArray.sort(); //按字母排序
	
	for(var keyName in keyArray){
		//nickname utf8mb4 问题,验签通不过,这里做签名的地方不对它做处理
		var key = keyArray[keyName];
		if (key==='nickName' || key==='sign') {
			continue;
		}
		suffix+= keyArray[keyName] +"="+data[keyArray[keyName]]+"&";  
	}
	
	suffix+= serverUtil.APP_KEY;
	//alert(url+suffix);
	//var base = new Base64();
	//var result = base.encode(url+suffix);
	//alert(result)
    if (url.indexOf("/hail")>=0) {
        url=url.replace("/hail","");
    }
	return $.md5(url+suffix);
}

//merge param
function genReqData(urlStr, data){
	var dataObj = {
			clientType : serverUtil.clientType,
			appId : serverUtil.appId,
			token : serverUtil.token,
			appVersion: serverUtil.appVersion,
			timestamp: new Date().getTime(),
			deviceId: serverUtil.deviceId,
            wechatLogin : serverUtil.wechatLogin
		};
	
	dataObj = $.extend(dataObj, data);
	var signStr = getSignStr(urlStr, dataObj);
	dataObj.sign = signStr;
	return dataObj;
}