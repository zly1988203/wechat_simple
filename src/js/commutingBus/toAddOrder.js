var preOrderInfo = {
    price:0,
    specialPrice:0,
    businessType:7,//通勤业务代码
    specialFlag:''
}

function getPreOrderInfo() {
    var param = {
        token:serverUtil.token,
        busIds:'',
        sign:serverUtil.sign
    }
    request(commuteApi.toAddOrder,param).then(function (res) {
        if(res.code == 0 ){
            var data = res.data;
            drawInfo(data);
        }
    })
    
    var drawInfo = function (data) {
        $('.head .time').html(data.departTime);
        $('.head .line-name').html(data.schduleCode);
        $('#payDays').html('共 '+data.days+' 天');
        $('#normalPrice').html(data.price+'元');
        $('#specialPrice').html(data.specialPrice+'元');
        $('#departTitle').html(data.departTitle);
        $('#arriveTitle').html(data.arriveTitle);
        preOrderInfo.price = data.price;
        preOrderInfo.specialPrice = data.specialPrice;
        preOrderInfo.specialFlag = parseFloat(data.specialPrice) > 0?1:0;
        $('#payPrice').html(data.payPrice);
        $('.rule-content').html(data.tipRule);
        $('#mobile').val(data.contactMobile);
        //调用查询优惠券信息接口
        var param = {
            businessType:'commute',
            busId :preOrderInfo.busId,
            price : preOrderInfo.price,
            specialFlag : parseFloat(preOrderInfo.specialPrice) > 0?1:0
        }

        //优惠券逻辑需调试
        // queryHasCoupons(param,function (data) {
        //     calculateCouponPrice(data);
        //     calculateTotalPrice();
        // });
        loadCoupons();
    }
}

function loadCoupons() {
    //调用查询优惠券信息接口
    var param = {
        businessType:preOrderInfo.businessType,
        busId :preOrderInfo.busId,
        price : preOrderInfo.price,
        specialFlag : parseFloat(preOrderInfo.specialPrice) > 0?1:0
    }
    request(commuteApi.queryConponByBusiness,param).then(function (res) {
        if(res.code == 0 ){
            var data = res.data;
            var couponsList = data.list;
            if(couponsList.length > 0){
                var coupon;
                $.each(couponsList,function(key,item){
                    if(key == 0){
                        if(item.isValid == 1){
                             coupon = {
                                userId:0,
                                isValid:1,
                                recordId:couponsList[0].recordId,
                                amount:couponsList[0].amount,
                                isDiscount:couponsList[0].isDiscount,
                                discountMaxLimitAmount:couponsList[0].discountMaxLimitAmount
                            }
                            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                            coupon.userId=userInfo.id;
                            localStorage.setItem("selectedCoupon",JSON.stringify(coupon));
                        }else{

                             coupon = {
                                userId:0,
                                isValid:0,
                                recordId:'null',
                                amount:0
                            }
                        }
                    }
                });
            }else{
                 coupon = {
                    userId:0,
                    isValid:0,
                    recordId:'null',
                    amount:''
                }
            }
                calculateCouponPrice(coupon);
                calculateTotalPrice();
        }
    })
}

function calculateCouponPrice(data) {
    if(data.isValid == 1) {
        var totalPrice = parseFloat(preOrderInfo.price) - parseFloat(preOrderInfo.specialPrice);
        //toFixed 方法保留2为小数并转换为string
        totalPrice = parseFloat(totalPrice.toFixed(2));
        var couponAmount = data.amount;
        if (data.isDiscount == 0) {
            if (totalPrice < data.amount) {
                couponAmount = totalPrice;
            }
        } else {
            couponAmount = totalPrice - (((totalPrice * 100) * (data.amount * 100)) / 100 / 1000).toFixed(2);
            if (couponAmount > data.discountMaxLimitAmount) {
                couponAmount = data.discountMaxLimitAmount;
            }
        }
        couponAmount = couponAmount.toFixed(2);
        $("#couponUsePrice").html("-" + couponAmount + "元");
        $("#couponUsePrice").removeClass('text-gray');
        $("#couponUsePrice").addClass('text-red');
        $("#couponUsePrice").attr("data-id", data.recordId);//选择的是哪个优惠券
        $("#couponUsePrice").attr("data-price", couponAmount);//选择的是哪个优惠券
    }else{
        if(data.recordId == '0'){//不使用优惠券
            $("#couponUsePrice").attr("data-price","0");//选择的是哪个优惠券
            $("#couponUsePrice").html("不使用优惠券");
            $("#couponUsePrice").removeClass('text-red');
            $("#couponUsePrice").addClass('text-gray');
            $("#couponUsePrice").attr("data-id","");//选择的是哪个优惠券
        }else{
            $("#couponUsePrice").attr("data-price","0");//选择的是哪个优惠券
            $("#couponUsePrice").html("无可用优惠券");
            $("#couponUsePrice").removeClass('text-red');
            $("#couponUsePrice").addClass('text-gray');
            $("#couponUsePrice").attr("data-id","");//选择的是哪个优惠券
        }
    }
}

function calculateTotalPrice(){
    var totalPrice = parseFloat(preOrderInfo.price) - parseFloat(preOrderInfo.specialPrice);
    var couponPrice=$("#couponUsePrice").attr('data-price');
    if(couponPrice&&couponPrice!=null){
        if(couponPrice>totalPrice){
            totalPrice=0;
        }else{
            totalPrice=totalPrice-couponPrice;
        }
    }
    totalPrice = Math.floor(totalPrice.toFixed(2)* 100) / 100;
    $('#payPrice').html(totalPrice);
}

/*
* 优惠券 - 操作
* */
$('.coupon-toggle').off('click').on('click', function() {
    window.location = '/coupon/select?businessType='+preOrderInfo.businessType+'&specialFlag='+preOrderInfo.specialFlag+'&price='+preOrderInfo.price;
});


$('.back-btn').on('click',function () {
        window.history.go(-1);
})
    
$('.pay-btn').on('click',function () {
    var mobile = $('#mobile').val();
    if(!(/^1\d{10}$/.test(mobile))){
        $.toast('请填写正确的手机号');
        return false;
    }

    var couponId=$("#couponUsePrice").data('id');//优惠券
    var param = {
        token:serverUtil.token,
        qrcId:'',//二维码ID
        busIds:'',
        couponId:'',
        specialPrice:'',
        ospTraceId:'',
        sign:serverUtil.sign,
        orderContactMobile:mobile,
    }
    if(couponId&&couponId!=null){
        param.couponId=couponId;
    }

    request(commuteApi.addOrder,param).then(function (result) {
        if(result.code == 0){
            var orderNo = result.data;
            var b = new Base64();
            var url = b.encode("/commute/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+orderNo);
            window.location.href='/order/payunit?orderNo='+orderNo+'&userCouponId='+couponId+'&url='+url;
        }
        else if(result.code == 30086){
            window.location.href = '/commute/commuteOrder/toPaySuccess?orderNo='+result.data; // 0元支付
        }
        else if(result.code == 30087){
            $.alert('支付失败，已关闭此订单',function(){
                window.location.href = '/commuteIndex';
            });
        }else if(result.code == 30001){
            $.alert(result.message,function(){
                history.go(0);
            })
        }else if(result.code == 88888){
            $.alert('10秒之内不允许重复操作下单');
        }else if(result.code == 88889){
            $.alert('您已存在待支付的订单',function(){
                window.location.href = '/bus/toCommuteOrderDetail?orderNo='+result.data;
            });
        }
        else if(result.code == 88890){
            $.alert(result.message,function(){
                window.location.href = '/bus/toCommuteOrderDetail?orderNo='+result.data;
            });
        }else{
            $.alert(result.message);
        }
    })
})

$(function () {
    getPreOrderInfo();
})