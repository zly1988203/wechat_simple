var preOrderInfo={price:0,specialPrice:0,businessType:7,specialFlag:""};function getPreOrderInfo(){var e={token:serverUtil.token,busIds:"",sign:serverUtil.sign};request(commuteApi.toAddOrder,e).then(function(e){if(0==e.code){var r=e.data;i(r)}});var i=function(e){$(".head .time").html(e.departTime),$(".head .line-name").html(e.schduleCode),$("#payDays").html("共 "+e.days+" 天"),$("#normalPrice").html(e.price+"元"),$("#specialPrice").html(e.specialPrice+"元"),preOrderInfo.price=e.price,preOrderInfo.specialFlag=0<parseFloat(e.specialPrice)?1:0,$("#payPrice").html(e.payPrice);var r=parseInt(e.days)-parseInt(e.specialNum);0<r&&$(".normal-number").html("原价 ¥"+e.price+"x"+r),0<e.specialNum&&($(".special-number").html("特价 ¥"+e.specialPrice+"x"+e.specialNum),$(".special-number").show()),$(".rule-content").html(e.payRule)}}$(".coupon-toggle").off("click").on("click",function(){window.location="/coupon/select?businessType="+preOrderInfo.businessType+"&specialFlag="+preOrderInfo.specialFlag+"&price="+preOrderInfo.price}),$(".back-btn").on("click",function(){window.history.go(-1)}),$(".pay-btn").on("click",function(){var e=$("#mobile").val(),r={token:serverUtil.token,qrcId:"",busIds:"",couponId:"",specialPrice:"",ospTraceId:"",sign:serverUtil.sign,orderContactMobile:e};request(commuteApi.addOrder,r).then(function(e){if(0==e.code)e.data})}),$(function(){getPreOrderInfo()});