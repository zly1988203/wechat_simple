$(function () {

    total_price();
    // 计算费用
    function total_price(){
        var total = 83.3;
        var activity = 10;
        var coupon = 10;
        var activity_state = 1;
        var coupon_state = 1;
        var result = total-activity-coupon;

        $(".detail-info").html("<div class=\"detail\">\n" +
            "                    <dl class=\"list total-price\">\n" +
            "                        <dt>一口价</dt>\n" +
            "                        <dd>"+total+"元</dd>\n" +
            "                    </dl>\n" +
            "                    <dl class=\"list activity-price\">\n" +
            "                        <dt >活动优惠</dt>\n" +
            "                        <dd >-"+activity+"元</dd>\n" +
            "                    </dl>\n" +
            "                    <dl class=\"list coupon-price\">\n" +
            "                        <dt>优惠券</dt>\n" +
            "                        <dd>-"+coupon+"元<div class=\"coupon-price-pic\"></div></dd>\n" +
            "                    </dl>\n" +
            "                </div>" +
            "");
        $(".price-container span").html(result+"元");

        is_coupon(activity_state,coupon_state);
    }

    // 判断有无优惠券
    function is_coupon(activity_state,coupon_state){
        // 没有活动优惠
        if (activity_state===0){
            $(".activity-price").hide();
        }
        else{
            $(".activity-price").fadeIn("fast");
        }
        if (coupon_state === 0){
            $(".coupon-price dd").html("无可用优惠券");
            $(".coupon-price").removeClass("coupon-price").addClass("no-coupon");
        }
    }

    //取消订单弹出隐藏层
    $(".cancel-1,.cancel-2").click(function () {
        // $.confirm('','')
        var scrollHeight = $(document).height();//文档高度
        $(".cancel-popup").height = scrollHeight+"px";

        $(".cancel-popup").fadeIn("fast");
        $(".black_overlay").fadeIn("fast");
    });

    //关闭弹出层
    $(".no-cancel").click(function () {
        $(".cancel-popup").hide();
        $(".black_overlay").hide();
    });

    // 点击确认弹窗
    $(".is-cancel").click(function () {
        $(".payment-info").hide();
        $(".cancel-popup").hide();
        $(".black_overlay").hide();
        $(".range").css("margin-top",".6rem");
    });

    // 点击稍后支付
    $(".wait-pay").click(function () {
        $(".payment-top").hide();
        $(".range").fadeIn("fast");
        $(".white_overlay").fadeIn("fast");
        $(".ola-maps").fadeIn("fast");
        $(".payment-info").hide();
        $(".cancel-popup").hide();
        $(".black_overlay").hide();
        $(".range").css("margin-top",".6rem");
    });

    // 返回
    $(".return").click(function () {
        history.go(-1);
    });
    /*$("").click(function () {
        // $.confirm('','')
        var scrollHeight = $(document).height();//文档高度
        $(".cancel-popup").height = scrollHeight+"px";

        $(".cancel-popup").fadeIn("fast");
        $(".black_overlay").fadeIn("fast");
    });*/

    // 点击微信支付
    $(".primary").click(function () {
        $(".detail-info").hide();
        $(".payment-info .title").html("订单支付成功");
        var text1 = $(".price-container span").text();
        $(".price-container span").html("实付"+text1);
        $(".wait-pay").hide();
        $(".payment-top").hide();
        var text2 = $(".price-container span").text();
        $(".border-dashed").hide();


        // 如果没有状态改变
        if (text1==text2){
            $(".primary").html("支付中...");
            $(".primary").css("pointer-events","none");

            // 15s后状态切换
            setTimeout(function () {
                $(".primary").css("pointer-events","");
                $(".primary").html("微信支付");
            }, 5000);
        }

        $(".range").fadeIn("fast");
        $(".white_overlay").fadeIn("fast");
        $(".ola-maps").fadeIn("fast");
        $(".primary").hide();
        $(".cancel-2").fadeIn("fast");
        $(".cancel-1").hide();
        $(".contact-btn").fadeIn("fast");

    });

    // 初始化地图
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

    $(function() {
        //初始秒数
        var t = 840;
        countDown(t);
        //倒计时
        function countDown(t) {
            var r = format(t);
            full(r);

            var auto = setInterval(function() {
                if(r.second > 0) {
                    r.second--;
                } else {
                    if(r.minute > 0) {
                        r.second = 60;
                        r.minute--;
                    } else {
                        if(r.hours > 0) {
                            r.second = 60;
                            r.minute = 59;
                            r.hours--;
                        } else {
                            r.second = 0;
                            clearInterval(auto);
                        }
                    }
                }

                full(r);
            }, 1000);
        }

        //填入
        function full(r) {
            var $t = $('#time');
            var html = r.second + '秒';

            if(r.minute >= 0) {
                html = r.minute + '分' + html;
            }
            if(r.hours >= 0) {
                html = r.hours + '时' + html;
            }

            $t.html(html);
        }

        //格式化时间
        function format(n) {
            var s = parseInt(n);
            var m = 0;
            var h = 0;

            if(s > 60) {
                m = parseInt(s / 60);
                s = parseInt(s % 60);

                if(m > 60) {
                    h = parseInt(m / 60);
                    m = parseInt(m % 60);
                }
            }

            var result = {};
            result.second = s;
            if(m > 0) {
                result.minute = m;
            }
            if(h > 0) {
                result.hours = h;
            }
            return result;
        }
    });
});
/*$(function () {
    var orderInfo = {
        payMode:$("#payMode").val(),
        tipsMessage:$("#tipsMessage").val(),
        statusDesc:$("#statusDesc").val(),
        specialPrice:$("#specialPrice").val(),
        couponPrice:$("#couponPrice").val(),
        type:$("#type").val(),
        orderNo:$("#orderNo").val()
    }
    // 下单提示是否显示
    if (orderInfo.payMode == 0){
        $(".payment-top").show();
    }

    // 是否愿意等
    if (orderInfo.tipsMessage != ""){
        $(".tips").show();
    }

    // 特价优惠
    if (orderInfo.statusDesc !='0' && orderInfo.specialPrice>0){
        $(".activity-price").show();
        if (orderInformation.statusDesc == '1'){
            $(".activity-price dd").show();
        }
    }

    // 优惠券
    if (orderInfo.couponPrice > 0){
        $(".coupon-price dd").show();
    }

    // 稍后支付
    var payMode = orderInfo.payMode;
    //支付方式样式选择 0-刚下单时，1或其他-稍后支付
    if(payMode == 1 && type!=''){
        $(".wait-pay").show();
    }

    var getPrepayInfoCallback=function(data){
        if (typeof WeixinJSBridge == "undefined") {
            $(document).on('WeixinJSBridgeReady', function() {
                onBridgeReady(data);
            });
        } else {
            onBridgeReady(data);
        }
    }
    function onBridgeReady(data) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId" : data.appId, //公众号名称，由商户传入
            "timeStamp" : data.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr" : data.nonceStr, //随机串
            "package" : "prepay_id=" + data.prepayId,
            "signType" : data.signType, //微信签名方式：
            "paySign" : data.paySign //微信签名
        }, function(res) {
            //支付解锁
            $('#orderPay').data('clickable','true');
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location='/innerCity/order/toPaySuccess?orderNo=${orderInformation.orderNo}';
            }
        });
    }

    function getPrepayInfo(dataParam,callback){
        $.ajax({
            type: "GET",
            url: "/innerCity/order/getOrderPrepayInfo",//添加订单
            data:dataParam,
            dataType: "json",
            success: function(result){

                if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                    callback(result.data);
                }else if(result!=undefined&&result.code!=undefined&&parseInt(result.code)!=0){
                    $('#orderPay').data('clickable','true');
                    if(parseInt(result.code)==8888){
                        window.location='/innerCity/order/toPaySuccess?orderNo=${orderInformation.orderNo}';
                    }else if(parseInt(result.code)==8889){
                        $('#orderPay').data('clickable','true');
                        $.dialog({
                            text: '你的订单已被客服取消，请重新发起行程',
                            buttons: [{
                                text: '我知道了',
                                onClick: function() {
                                    window.location='/interCityIndex'
                                }
                            }]
                        });
                    }else{
                        $(".primary").html("支付中...");
                        $('#orderPay').data('clickable','false');
                        // $(".primary").css("pointer-events","none");

                        // 15s后状态切换
                        setTimeout(function () {
                            // $(".primary").css("pointer-events","");
                            $(".primary").html("微信支付");
                        }, 15000);

                        $('#orderPay').data('clickable','true');
                        $.alert(result.message || '系统当前无法支付');
                    }
                }
            }
        });
    }

    /!**
     *取消订单
     *!/
    function cancelOrder(){
        $.confirm('支付成功后，将会优先为你安排车辆，确定取消订单吗？', '温馨提示',['暂不取消', '确定取消'],function() {
            $.ajax({
                url:'/innerCity/order/cancelOrder',
                data:{'orderNo':'${orderInformation.orderNo}'},
                dataType:'json',
                success:function(data){
                    if(parseInt(data.code)==0){
                        window.location='/interCityIndex';
                    }else if(parseInt(data.code)==8889){
                        $.dialog({
                            text: '你的订单已被客服取消，请重新发起行程',
                            buttons: [{
                                text: '我知道了',
                                onClick: function() {
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
    }

    var interval;
    //订单状态扭转判断
    function orderJudgeCallBack(data){
        console.log('订单状态扭转毁掉'+data)
        if(parseInt(data.code)==0){
            if(parseInt(data.data.status)==8){
                window.location='/innerCity/order/toPaySuccess?orderNo=${orderInformation.orderNo}';
            }else if(parseInt(data.data.status)==9){
                clearInterval(interval);
                $.dialog({
                    text: '你的订单已被客服取消，请重新发起行程',
                    buttons: [{
                        text: '我知道了',
                        onClick: function() {
                            window.location='/innerCity/order/toOrderDetail?orderNo=${orderInformation.orderNo}';
                        }
                    }]
                });
            }

        }
    }
    // 表头下单提示
    $(function() {
        interval = setInterval("innerCityUrlJudge('${orderInformation.tripNo}',orderJudgeCallBack)", 1000);

        $(".cancel").click(function(){//取消订单
            cancelOrder();
        });
        // 点击微信支付
        $("#orderPay").click(function(){//获取预支付信息
            var clickable = $('#orderPay').data('clickable');
            if (!clickable) {
                return;
            }
            $('#orderPay').data('clickable','false');
            var orderNo=orderInfo.orderNo;
            var dataParam={};
            dataParam['orderNo']=orderNo;
            getPrepayInfo(dataParam,getPrepayInfoCallback);
        })

        // 点击稍后支付
        $('#laterPay').click(function () {
            window.location='/innerCity/order/toOrderDetail?orderNo=${orderInformation.orderNo}';
        });
        //初始秒数
        if(payMode==0){
            var t = '${remainTime!0}';
            countDown(t);
        }
        //倒计时
        function countDown(t) {
            var r = format(t);
            full(r);

            var auto = setInterval(function() {

                if((r.hours == 0 || r.hours == null) && (r.minute == 0 || r.minute == null) && r.second == 0){
                    $.ajax({
                        url:'/innerCity/order/cancelOrder',
                        data:{'orderNo':'${orderInformation.orderNo}','type':'auto'},
                        dataType:'json',
                        success:function(data){
                            if(parseInt(data.code) == 0){
                                $.alert('超时未支付,订单已关闭', function() {
                                    window.location='/interCityIndex'
                                });
                            }else if(parseInt(data.code)==8889){
                                $.dialog({
                                    text: '你的订单已被客服取消，请重新发起行程',
                                    buttons: [{
                                        text: '我知道了',
                                        onClick: function() {
                                            window.location='/interCityIndex';
                                        }
                                    }]
                                });
                            }else{
                                $.alert("取消异常");
                            }
                        }
                    })
                }
                if(r.second > 0) {
                    r.second--;
                } else {
                    if(r.minute > 0) {
                        r.minute--;
                        r.second = 59;
                    } else {
                        if(r.hours > 0) {
                            r.hours--;
                            r.minute = 59;
                            r.second = 59;
                        } else {
                            r.second = 0;
                            clearInterval(auto);
                        }
                    }
                }
                full(r);
            }, 1000);
        }

        //填入
        function full(r) {

            var $t = $('#time');
            var html = '';
            if(r.second ==60){
                r.second=59;
            }
            if(r.second >= 10) {
                html = r.second + '秒' + html;
            } else if(r.second >= 0 && r.minute > 0) {
                html = '0' + r.second + '秒' + html;
            }

            if(r.minute >= 10) {
                html = r.minute + '分 ' + html;
            } else if(r.minute > 0) {
                html = '0' + r.minute + '分' + html;
            }
            if(r.hours >= 10) {
                html = r.hours + '时 ' + html;
            } else if(r.hours > 0){
                html = '0' + r.hours + '时' + html;
            }
            $t.html(html);
        }

        //格式化时间
        function format(n) {
            var s = parseInt(n);
            var	m = 0;
            var	h = 0;

            if(s > 60) {
                m = parseInt(s / 60);
                s = parseInt(s % 60);

                if(m > 60) {
                    h = parseInt(m / 60);
                    m = parseInt(m % 60)
                }
            }

            var result = {}
            result.second = s;
            if(m > 0) {
                result.minute = m;
            }
            if(h > 0) {
                result.hours = h;
            }

            return result;
        }

        //返回键控制

        // 返回
        $(".return").click(function () {
            history.go(-1);
        });
    });

    // 初始化地图
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

});*/