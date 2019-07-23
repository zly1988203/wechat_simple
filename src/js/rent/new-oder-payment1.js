$(function () {
    var orderInfo = {
        status:$('#status').val(),
        orderNo:$('#orderNo').val(),
        tripNo:$('#tripNo').val(),
        settleMode:$('#settleMode').val(),
        userId:$('#userId').val(),
    }

    if (orderInfo.status == 4 || orderInfo.status == 5){
        $("#cancel").hide();
        $(".range").css("margin-top",".17rem");
    }
    else if(orderInfo.status == 3){
        $("#refund").hide();
        $(".payment-info").hide();
        $(".range").css("margin-top",".6rem");
    }

    var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看'
    if(orderInfo.status == 3){
        dialogText = '你的订单已被客服取消，请通过我的订单查看'
    }
    var interval;
    //订单状态扭转判断
    function orderJudgeCallBack(data){
        console.log('订单状态扭转毁掉'+data)
        if(parseInt(data.code)==0){
            if(parseInt(data.data.status)==4||parseInt(data.data.status)==3||parseInt(data.data.status)==5||parseInt(data.data.status)==6
                ||parseInt(data.data.status)==7){
                window.location='/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
            }else if(parseInt(data.data.status)==9){
                clearInterval(interval);
                $.dialog({
                    text: dialogText,
                    buttons: [{
                        text: '我知道了',
                        onClick: function() {
                            window.location='/innerCity/order/toOrderDetail?orderNo='+orderInfo.orderNo;
                        }
                    }]
                });
            }

        }
    }

    $(function(){
        backtoUrl('/interCityIndex');
        interval = setInterval("innerCityUrlJudge(orderInfo.tripNo,orderJudgeCallBack)", 1000);
    });

    //返回首页
    $('#back').on('click',function(){
        //清空缓存
        window.sessionStorage.removeItem('callCarInfo');
        window.location = '/interCityIndex';
    });

    //取消并退款
    $('#refund').on('click',function(){
        location.href="/innerCity/order/toOrderCancelReturnPage?orderNo="+orderInfo.orderNo
    });

    $('#cancel').on('click',function(){
        $.confirm('确定取消订单吗？', '温馨提示',['暂不取消', '确定取消'],function() {
            $.ajax({
                url:'/innerCity/order/cancelOrder',
                data:{'orderNo':orderInfo.orderNo},
                dataType:'json',
                success:function(data){
                    if(parseInt(data.code)==0){
                        //清空缓存
                        window.sessionStorage.removeItem('callCarInfo');
                        window.location='/interCityIndex';
                    }else if(parseInt(data.code)==8889){
                        $.dialog({
                            text: '你的订单已被客服取消，请重新发起行程',
                            buttons: [{
                                text: '我知道了',
                                onClick: function() {
                                    //清空缓存
                                    window.sessionStorage.removeItem('callCarInfo');
                                    window.location='/interCityIndex';
                                }
                            }]
                        });
                    }else{
                        $.alert("取消异常");
                    }
                }
            })
        })
    })


    //联系客服
    $('#contact').on('click', function() {
        var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
        var dataDetail = {
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

    // 初始化地图
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });
});