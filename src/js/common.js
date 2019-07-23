$(function(){
    $("[data-href]").on("click",function(){location.href=$(this).data("href")});
	
	$.extend($.ajaxSettings, {
		error: function(jqXHR, textStatus, errorThrown){
			switch (jqXHR.status){
				case(401):
//					$.alert("登录失效, 请重新登录");
					var fromUrl = window.location.href;
					var i =fromUrl.indexOf(CURRENT_SERVER_SUFFIX);
					fromUrl = fromUrl.substring(i+CURRENT_SERVER_SUFFIX.length,fromUrl.length);
					var exp = new Date();
	                exp.setTime(exp.getTime() + 60 * 1000 * 10);
					$.cookie('fromUrl',fromUrl,{expires: exp, path: '/' });
					toCommonLogin();
					break;
				case(500):
//					location.href = '/passenger/error.html';
					break;
				case(408):
					$.toastError("网络异常");
					break;
				default:
					$.hideLoading();
					//$.toastError("服务出错啦，再试试");
					break;
			}
		},
		success: function(data){
			//alert("操作成功");
		}
			
	});

    function initUserInfo () {
        //api url
        var urlStr = SERVER_URL_PREFIX+"/Account/queryAccount";
        //current page param
        var dataObj = {
        };
        //merge page param and common param,generate request param
        dataObj = genReqData(urlStr, dataObj);

        $.post(urlStr, dataObj, function(result){
            if(result && result.code == 0){

                var mobile = result.data.mobile;
                var nickName = result.data.nickName;

                if(!isEmpty(result.data.avatar)){
                    $('#avatar').css("background-image","url("+result.data.avatarUrl+")");
                }
                if(isEmpty(nickName)){
                    $('#sideMenu .mobile').html(mobile);
                }else{
                    $('#sideMenu .mobile').html(nickName);
                }

				if(undefined != result.data.distribUserType  && result.data.distribUserType == 1){
                    $('title').html(result.data.providerName);
					$("#myBounty").show();
                    $("#getBounty").show();
				}

				var userInfo = result.data;
                localStorage.setItem("userInfo",JSON.stringify(userInfo));
            }else{
            	console.log(result);
            	if(result){
                    var userInfo = result.data;
                    localStorage.setItem("userInfo",JSON.stringify(userInfo));
				}
                if(loginType==1){
                    $('#sideMenu .mobile').html("<a href='/selectionLogin'>登录</a>");
                }else{
                    $('#sideMenu .mobile').html("<a href='/regOrLogin'>登录</a>");
                }
            }
        }, 'json');
    }

    initUserInfo();

});

//员工礼品
function showEmp(){
    //api url
    var urlStr = SERVER_URL_PREFIX+"/Account/userType";
    //current page param
    var dataObj = {
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);
    var token=$.cookie('token');
    dataObj['token']=token;
    $.post(urlStr, dataObj, function(result){
        if(result && result.code == 0){
            if(result.data.isEmp == '1'){
                var url = "https://osp."+adDomain+"/wechat/employee_credit/index?providerId="+providerId+"&token="+$.cookie("token");
                $('#toEmp').data('url',url);
                $('#toEmp').show();
            }
            if(result.data.checkGift == '1'){
                var url = "https://osp."+adDomain+"/wechat/activity/cdkeyVerify?providerId="+providerId+"&token="+$.cookie("token");
                $('#toCheckGift').data('url',url);
                $('#toCheckGift').show();
            }
        }
    });
}

function queryUserCouponsNum() {

    var succ_event = function (result) {
        if(result.code == 0){
            var data = result.data;
            if(data.count > 0){
                $('#sideMenu .coupon-number').html(data.count+'张')
                $('#sideMenu .coupon-number').show();
            }else {
                $('#sideMenu .coupon-number').hide();
            }
        }else {
            $('#sideMenu .coupon-number').hide();
        }

    }

    //api url
    var urlStr = SERVER_URL_PREFIX+"/Coupon/queryUserCouponsNum";
    //current page param
    var dataObj = {
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);
    var token=$.cookie('token');
    dataObj['token']=token;
    $.ajaxService({
		url:urlStr,
		data:dataObj,
        success:succ_event
	})
}

$('#menuArmrest').on('click', function() {
    //小红点
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(undefined != userInfo && undefined != userInfo.identifyId){
        showEmp();
        queryUserCouponsNum();
	}
});

/**
 * 判断微信浏览器
 */
function isWechatBrowser() {
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') != -1;
	if (isWeixin) {
	    return true;
	}else{
	    return false;
	}
}

/**
 * 统一跳转登录页
 * @param timestamp
 * @returns
 */
function toCommonLogin() {
	var herf = window.location.href;
	if (herf.indexOf('/selectionLogin')===-1 && herf.indexOf('/regOrLogin')===-1) {
		if (isWechatBrowser()) {
			location.href = '/wechat/autoLogin';
		}
		else {
			if(loginType==1){
				location.href = '/selectionLogin';
			}else{
				location.href = '/regOrLogin';
			}
		}
	}
}

function getLocalTime(timestamp) {     
	var d = new Date(timestamp);
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hour + ':' + min;
}

function getLocalTime2(timestamp) {     
	var d = new Date(timestamp);
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	return d.getFullYear() + ',' + (d.getMonth() + 1) + ',' + d.getDate() + ', ' + hour + ':' + min;
}	

function getLocalTime3(timestamp) {     
	var d = new Date(timestamp);
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ';
}

function getLocalTime4(timestamp) {     
	var d = new Date(timestamp);
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hour + ':' + min;
}


Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}    

function getTicketListOrderDate(timestamp) {     
	var d = new Date(timestamp);
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	return hour + ':' + min+' '+(d.getMonth() + 1) + '月' + d.getDate() + '日 ';
}


function getLocalTime5(timestamp) {     
	var d = new Date(timestamp);
	var month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth()+1);
	var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	return d.getFullYear() + '-' + month + '-' + date;
}


//判断空字符串
function isEmpty(obj){
	if (obj === null || obj === undefined || obj === '') { 
		return true; 
	} 
	return false;
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
	
	suffix+= APP_KEY;
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
			clientType : CLIENT_TYPE,
			appId : APP_ID,
			token : $.cookie('token'),
			appVersion: APP_VERSION,
			timestamp: new Date().getTime(),
			deviceId: DEVICE_ID,
			wechatLogin : WECHATLOGIN
		};
	
	dataObj = $.extend(dataObj, data);
	var signStr = getSignStr(urlStr, dataObj);
	dataObj.sign = signStr;
	return dataObj;
}

//查询未完成的行程或订单，并提示。
//tripFlag为true时，调用高德回调方法发起行程，需要传入ptStart和ptEnd
function hasUnFinishOrderOrTrip(tripFlag, ptStart, ptEnd) {
  $.showLoading('查询行程状态 ');
  var urlDetail = SERVER_URL_PREFIX + '/Order/queryUnFinishOrderOrTrip';
  var dataDetail = {};
  dataDetail = genReqData(urlDetail, dataDetail);
  $.ajax({
     type: 'POST',
     url: urlDetail,
     data: dataDetail,
     dataType:  'json',
     success: function(data){
    	 $.hideLoading();
    	if(data.code == 60001){
    		$.alert(data.message);
    		return;
    	} 
    	 
        if (data.data.orderStatus == 0) { //无未完成行程或订单，可发起行程
        	if (tripFlag)
        		drivePlugin.search(ptStart, ptEnd, driveRouteResult);  
        } else {
            var goToResult = data.data.goToResult;
            if (goToResult) {
                if (goToResult.isRedirectAlert) { //重定向弹框
                    $.dialog({
                      text: goToResult.title,
                      title: '提示',
                      buttons: [{
                        text: goToResult.cancel,
                        onClick: function() {
                           $.hideLoading();                  
                       }
                    }, {
                      text: goToResult.confirm,
                      onClick: function() {
                        window.location.href = CURRENT_SERVER + goToResult.url;
                    }
                    }]
                 });
                } else { //提示框
                    $.alert(goToResult.title);
                }
                
            } else { //跳转匹配失败
              $.toastError("行程出错啦");
            }
        }
    }
 });
}

function listenTrip (tripNo, currentUrl) {
	var urlDetail = SERVER_URL_PREFIX + '/Trip/listenTrip';
	var dataDetail = {
		tripNo: tripNo,
		currentUrl : currentUrl
	};
	dataDetail = genReqData(urlDetail, dataDetail);
		
	 $.ajax({
         type: 'POST',
         url: urlDetail,
         data: dataDetail,
         dataType:  "json",
         success: function(data){
        	 if(data.code ==0){
                 var goToResult = data.data.goToResult;
             	if( currentUrl=="toOrderWait"){
             		var status = data.data.status;
             		if(status == 9){
             			window.location=CURRENT_SERVER+'/index';  
             		}else{
             			if(status == 4 || status == 3){
             				$("#orderFlag").val(1);   //向页面发送订单已被接的标志
             			}
             		}
            	}
             	
                 $("#callOutTime").val(data.data.callOutTime);
                 var temp = (data.data.reatTime - data.data.createTime)/1000;
                 $("#min").val(parseInt(temp/60));
                 $("#secs").val(parseInt(temp - (parseInt(temp/60)*60)));
                 if (goToResult && alertFlag) {
                     if (goToResult.isRedirectAlert) {
                    	 window.location.href = CURRENT_SERVER + goToResult.url;
                     } else { //提示框
                    	 window.clearInterval(tripInterval);
                    	 $.dialog({
                             text: goToResult.title,
                             title: '提示',
                             buttons: [{
                               text: '确定',
                               onClick: function() {
                            	   if (goToResult.url)
                            		   window.location.href = CURRENT_SERVER + goToResult.url;               
                              }
                           }]
                        });
                     }
                 } else { //跳转匹配失败
                   // $.toastError("行程出错啦");
                 }
             }
         }
   });
}

//限制微信的返回按钮，回退到指定的url地址，防止回退到不对的历史页面
function backtoUrl(url) {
	pushHistory();  
    var bool=false;  
    setTimeout(function(){  
          bool=true;  
    }, 500);
    window.addEventListener("popstate", function(e) {  
      if(bool)  
        {  
    	  	location.href = url;
        }  
        pushHistory();  
          
    }, false);  

}

function pushHistory() {  
	var state = {  
		title: "title",  
		url: "#"  
	};  
window.history.pushState(state, "title", "#");  
}

function toHref(value,data){
	if(data.orderStatus == 7){
		window.location.href=CURRENT_SERVER+'/index';
		return;
	}
	switch(value)
	{
	case 1:
	case 2:
	case 3:
		window.location.href=CURRENT_SERVER+'/order/toOrderWait?tripNo='+data.tripNo+"&tipsMessage=&createTime="+data.createTime;
	  break;
	case 4:
		window.location.href = CURRENT_SERVER+'/order/toWaitDriver?orderNo=' +data.orderNo;
	  break;
	case 5:
		window.location.href= CURRENT_SERVER+"/order/toDriverArrived?orderNo=" +data.orderNo;
	  break;
	case 6:
		window.location.href = CURRENT_SERVER+"/order/toStartTrip?orderNo=" +data.orderNo;
	  break;
	case 7:
		window.location.href = CURRENT_SERVER+"/order/toStartTrip?orderNo=" +data.orderNo;
	  break;
	case 8:
		window.location.href = CURRENT_SERVER + "/order/toPay/" + data.orderNo;
	  break;
	}
}

function listenOrder (orderNo , currentUrl) {
	var urlDetail = SERVER_URL_PREFIX + '/Order/listenOrder';
	var dataDetail = {
		orderNo: orderNo,
		currentUrl : currentUrl
	};
	dataDetail = genReqData(urlDetail, dataDetail);
		
	 $.ajax({
         type: 'POST',
         url: urlDetail,
         data: dataDetail,
         dataType:  "json",
         success: function(data){
        	 if(data.code ==0){
                 var goToResult = data.data.goToResult;
                 if (goToResult) {
                     if (goToResult.isRedirectAlert) {
                    	 window.location.href = CURRENT_SERVER + goToResult.url;
                     } else { //提示框
                    	 window.clearInterval(tripInterval);
                    	 $.dialog({
                             text: goToResult.title,
                             title: '提示',
                             buttons: [{
                               text: '确定',
                               onClick: function() {
                            	   if (goToResult.url)
                            		   window.location.href = CURRENT_SERVER + goToResult.url;               
                              }
                           }]
                        });
                     }
                 } else { //跳转匹配失败
                   // $.toastError("行程出错啦");
                 }
             }
         }
   });
}


function callDriver(orderNo){
	$.confirm('确定拨打司机电话吗?。', '提示',['取消', '确定'], function() {
        var urlDetail = SERVER_URL_PREFIX + '/Call/callDriver';
       	var dataDetail = {
       		orderNo: orderNo
       	};
       	dataDetail = genReqData(urlDetail, dataDetail);
       	
       	 $.ajax({
       	 	type: 'POST',
       	    url: urlDetail,
       	    data: dataDetail,
       	    dataType:  'json',
       	    success: function(data){
       	    	if(data && data.code == 0){
       	        	window.location.href = 'tel:'+data.data.callee;                   	            		
       	            }
       	        }
       	    }); 
	});
}

function contact(orderNo,busiType,serverUrl){
	var urlDetail = SERVER_URL_PREFIX + '/Contact/rescue';
	if (serverUrl!=undefined&&serverUrl!='') {
        urlDetail = serverUrl + '/Contact/rescue';
    }
	var type = undefined != busiType ? busiType : 'online';
	var dataDetail = {
		orderNo: orderNo
	};
	dataDetail = genReqData(urlDetail, dataDetail);
		 $.ajax({
	        type: 'POST',
	        url: urlDetail,
	        data: dataDetail,
	        dataType:  'json',
	        success: function(data){
                if(data.code == 0){
                    $.toastSuccess('紧急求助短信<br>发送成功');
                }else{
                    //没有设置紧急联系人
                    $.confirm(data.message, '温馨提示', ['取消', '去设置'], function() {
                        window.location.href = '/passenger/contacts.html?type='+type+'&orderNo='+ dataDetail.orderNo
                        //跳转到紧急联系人页面
                    }, function() {

                    })
                }
	        }
	});
}

function callComm(orderNo){
	 $.confirm('确定拨打客服电话吗?。', '提示',['取消', '确定'], function() {
			var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
    		var dataDetail = {
    			orderNo: orderNo
    		};
    		dataDetail = genReqData(urlDetail, dataDetail);
    		
    		$.ajax({
    	            type: 'POST',
    	            url: urlDetail,
    	            data: dataDetail,
    	            dataType:  'json',
    	            success: function(data){
    	            	if(data && data.code == 0){
    	            		window.location.href = 'tel:'+data.data.customerTel;                   	            		
    	            }
    	      	}
    	    });
	});
}

function cancelBtn(){
	var urlCancel = SERVER_URL_PREFIX + '/Order/cancelOrder';
	var dataCancel = {
		orderNo: '${orderNo}'
	};
	dataCancel = genReqData(urlCancel, dataCancel);
		
	$.confirm('司机正火速赶来，再等会司机吧！为避免影响你的信誉，若为司机的责任，请让司机取消。', '无责取消',['暂不取消', '确定取消'], function() {
		$.ajax({
            type: 'POST',
            url: urlCancel,
            data: dataCancel,
            dataType:  "json",
            success: function(data){
         	   if(data.code ==0){
         		   window.clearInterval(tripInterval);
         		   if(data.paySwitch==1){
                   	 $.toastSuccess("需要支付违约金："+amount);
         	  	   }else{
         		  	 $.toastSuccess("不需要支付违约金");
         	   	   } 
         		  window.location=CURRENT_SERVER+'/order/toOrderCancel?orderNo=${orderNo}'; 
         	   }
            },
        }); 
	});
}

/**
 * 根据经纬度搜索地址 
 * @param gps
 * @returns
 */
function searchAddressByGps(gps,callback){
	var urlDetail = SERVER_URL_PREFIX + '/searchAddressByGps';
	var dataDetail = {
		gps: gps
	};
	dataDetail = genReqData(urlDetail, dataDetail);
	
	$.ajax({
            type: 'GET',
            url: urlDetail,
            data: dataDetail,
            dataType:  'json',
            success: function(data){
            	if(data.code==0){
            		callback(data.data);
            	}
            }
    });
}

/**
 * 以下四个是浮点数计算
 * 
 * */
/*********************start*************************/
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
/*********************end*************************/

/*
 *功能： 模拟form表单的提交
 *参数： URL 跳转地址 PARAMTERS 参数
 *返回值：
 *创建时间：20160713
 *创建人： 
 */
 function postPage(URL, PARAMTERS) {
     //创建form表单
     var temp_form = document.createElement("form");
     temp_form.action = URL;
     //如需打开新窗口，form的target属性要设置为'_blank'
     temp_form.target = "_self";
     temp_form.method = "post";
     temp_form.style.display = "none";
     
     //添加参数
     for (var item in PARAMTERS) {
         var opt = document.createElement("textarea");
         opt.name = PARAMTERS[item].name;
         opt.value = PARAMTERS[item].value;
         temp_form.appendChild(opt);
     }
     document.body.appendChild(temp_form);
     //提交数据
     temp_form.submit();
 }
 /**
  * 最多保留两位小数
  * @param value
  */
 function saveTwoDigit(value){
	 if(value== undefined || value==null){
		 return 0;
	 }
	 return Math.round(parseFloat(value)*100)/100;
 }
 
 function callDriver(orderNo){
     var urlDetail = SERVER_URL_PREFIX + '/Call/callDriver';
    	var dataDetail = {
    		orderNo: orderNo
    	};
    	dataDetail = genReqData(urlDetail, dataDetail);
    	
    	 $.ajax({
    	 	type: 'POST',
    	    url: urlDetail,
    	    data: dataDetail,
    	    dataType:  'json',
    	    success: function(data){
    	    	if(data && data.code == 0){
    	    		if(data.data.isOpenSafeCall == '1' && $.cookie('firstCall')==null){
    	    			$.confirm('拨打司机手机号时，系统将会采用隐号功能，隐藏你们的真实手机号，请放心拨打。','提示',['取消','确定'],function(){
			   				$.cookie('firstCall','firstCall');
			   				window.location.href = 'tel:'+data.data.callee;
			    		});
    	    		}else{
    	        		window.location.href = 'tel:'+data.data.callee; 
    	        	}                  	            		
    	        }else{
    	        	if(data.code == 50001){
    	        		callCustomerService(orderNo);
					}
    	        }
    	   }
    	}); 
}

function callDriverByServer(serverUrl,orderNo){
    var urlDetail = serverUrl + '/Call/callDriver';
    var dataDetail = {
        orderNo: orderNo
    };
    dataDetail = genReqData(urlDetail, dataDetail);

    $.ajax({
        type: 'POST',
        url: urlDetail,
        data: dataDetail,
        dataType:  'json',
        success: function(data){
            if(data && data.code == 0){
                if(data.data.isOpenSafeCall == '1' && $.cookie('firstCall')==null){
                    $.confirm('拨打司机手机号时，系统将会采用隐号功能，隐藏你们的真实手机号，请放心拨打。','提示',['取消','确定'],function(){
                        $.cookie('firstCall','firstCall');
                        window.location.href = 'tel:'+data.data.callee;
                    });
                }else{
                    window.location.href = 'tel:'+data.data.callee;
                }
            }else{
                if(data.code == 50001){
                    callCustomerService(orderNo);
                }
            }
        }
    });
}

function callCustomerService(orderNo){
	$.confirm('订单已结束多时，如需联系司机 ，可联系客服帮忙', '提示',['取消', '联系客服'], function() {
		var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
   		var dataDetail = {
   			orderNo: orderNo
   		};
   		dataDetail = genReqData(urlDetail, dataDetail);
   		
   		$.ajax({
   	            type: 'POST',
   	            url: urlDetail,
   	            data: dataDetail,
   	            dataType:  'json',
   	            success: function(data){
   	            	if(data && data.code == 0){
   	            		window.location.href = 'tel:'+data.data.customerTel;                   	            		
   	            }
   	      	}
   	    });
	 });
}
//时间戳格式化 (yyyy-MM-dd hh:mm:ss)
function formatTime(str){
    if(isNumber(str)){
        var time = new Date(parseInt(str));
        str = time.getFullYear() + '-' + formatNum(time.getMonth()+1) + '-' + formatNum(time.getDate())
            + ' ' + formatNum(time.getHours()) + ':' + formatNum(time.getMinutes()) + ':' + formatNum(time.getSeconds());
        return str;
    }else{
        return '';
    }
}

//数字格式化：数字为个位数时，前面添加0
function formatNum(str){
    if( (str + '').length == 1){
        if( str < 10 ){
            str = '0' + str;
        }
    }
    return str;
}

//判断是否是非负整数
function isNumber(str){
    var r = /^[1-9]\d*|0$/;
    return r.test(str);
}
//重写toFixed方法
Number.prototype.toFixed=function (d) {
    var s=this+"";
    if(!d)d=0;
    if(s.indexOf(".")==-1)s+=".";
    s+=new Array(d+1).join("0");
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
        var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g);
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
        }if(b)s=s.substr(1);
        return (pm+s).replace(/\.$/,"");
    }
    return this+"";
};

/*
     * 参数说明：
     * s：要格式化的数字
     * n：保留几位小数
     * */
function formatMoney(s, n) {
 
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
