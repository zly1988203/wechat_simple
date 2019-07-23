$(function () {
    var isShow = $("#isShow").val();
    if(isShow === "0"){
        $("#resbtn").css('background','#ccc');
    }

        var d = new Date(new Date().getTime());
        var startTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate());
        var endTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate()+1);
        $("#present_startTime").data('date',startTime);
        $("#present_endTime").data('date',endTime);
        $("#present_endTime").val("明天" + " 09点"+" 00分");

    $("#tabOne").on("click",function () {
        $("#tabWay").val("1");
        $("#tabTwo").removeClass("active");
        $("#dvEndTime").addClass("undisplay");
        $(this).addClass("active");
    })

    $("#tabTwo").on("click",function () {
        $("#tabWay").val("2");
        $("#tabOne").removeClass("active");
        $("#dvEndTime").removeClass("undisplay");
        $(this).addClass("active");
    })

    dataUtils.exChangeVal($('.exchange'),$('#startAddr'),$('#endAddr'));

    // ================================= 选择地址相关 ===================================
    adrsUtils.selectAddress({el_trigger:$('.search-station li'),el_popup:$('#search-address')});

    // ================================= 选择城市相关 ===================================
    adrsUtils.openCity({el_trigger: $('#setCityButton'),el_popup:$('#select-Citys') });

    $("#resbtn").on('click',function () {
        if(isShow === "0"){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("此功能暂未开发。");
            return;
        }

        if($("#tabWay").val() === "1"){
            $("#resWay").html("单程");
            $("#returnItem").addClass("undisplay");
        }else{
            $("#returnItem").removeClass("undisplay");
            $("#resWay").html("往返");
        }

        if($("#startAddr").val() === "" ){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您的上车地点。");
            return;
        }

        if($("#endAddr").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您要到达的地点。");
            return;
        }

        if($("#present_startTime").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您何时出发。");
            return;
        }

        if($("#tabWay").val() === "2"){
            var date = getStart_EndTime();
            if(!compareDate(date.departTime,date.returnTime)){
                $(".cover").removeClass("undisplay");
                $("#msgBox").removeClass("undisplay");
                $("#msgBox .content").html("返程时间不能小于出发时间。");
                return;
            }
        }

        if($("#present_peopleNumber").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请填写出行人数。");
            return;
        }

        var checkNumber = /^[0-9]*[1-9][0-9]*$/;
        if(!checkNumber.test($("#present_peopleNumber").val())){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("出行人数必须为大于0的正整数。");
            return;
        }

        var phone = $("#present_phone").val();

        if(phone === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请填写你的手机号码。");
            return;
        }

        if(!checkTel(phone)){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("你填写的电话号码不正确。");
            return;
        }

        // if(!(/^1[34578]\d{9}$/.test(phone))){
        //     $(".cover").removeClass("undisplay");
        //     $("#msgBox").removeClass("undisplay");
        //     $("#msgBox .content").html("你填写的手机号码不正确。");
        //     return;
        // }

        $("#startPlace").html($("#startAddr").val());
        $("#endPalce").html($("#endAddr").val());
        $("#startTime").html($("#present_startTime").val());
        $("#returnTime").html($("#present_endTime").val());
        $("#personNumb").html($("#present_peopleNumber").val()+"人");
        $("#personPhone").html($("#present_phone").val());
        $("#remark").html($("#present_remark").val())

        $(".cover").removeClass("undisplay");
        $("#reservationInfo").removeClass("undisplay");

    })

    function checkTel(tel) {
        var mobile = /^1[3|4|5|7|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
        return mobile.test(tel) || phone.test(tel);
    }

    function compareDate(beginDate,endDate) {
        var d1 = new Date(beginDate.replace(/\-/g, "\/"));
        var d2 = new Date(endDate.replace(/\-/g, "\/"));

        if(beginDate!=""&&endDate!=""&&d1 >=d2)
        {
            return false;
        }
        return true;
    }

    function getStart_EndTime() {
        var d = new Date(new Date().getTime());
        var startTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate());
        var departTime =  $("#present_startTime").data('date')+" " +$("#present_startTime").data('time')+":"+ $("#present_startTime").data('minute');
        if($("#present_startTime").data('time') === "now"){
            departTime = startTime+" " +zeroize(d.getHours())+":"+ zeroize(d.getMinutes());
        }

        var  returnTime = $("#present_endTime").data('date')+" " +$("#present_endTime").data('time')+":"+ $("#present_endTime").data('minute');;
        if($("#tabWay").val() == 2){
            if($("#present_endTime").data('time') === "now"){
                returnTime = startTime+" " +zeroize(d.getHours())+":"+ zeroize(d.getMinutes());
            }
        }

        return {departTime:departTime,returnTime:returnTime};
    }

    var interfacePath = "";
    var flag = false;
    $("#submitInfo").on('click',function () {
        $("#reservationInfo").addClass("undisplay");


        if (!navigator.onLine) {
            $("#msgBox .content").html("您可能断网了，请检查网络");
        }

        flag = true;
        $("#msgBox").removeClass("undisplay");

        // var param = {
        //     url:interfacePath +"baseCharteredCar/index",
        //     data: {}
        // }
        // ajax(param,function (res) {
        //     alert(res.message);
        // },function (e) {
        //
        // })
        //

    })
    $("#reservationInfo .icon-close").on('click',function () {
        $(".cover").addClass("undisplay");
        $("#reservationInfo").addClass("undisplay");
    })

    $("#msgBox .btn-konw").on('click',function () {
        $(".cover").addClass("undisplay");
        $("#msgBox").addClass("undisplay");
        if(flag) location.reload();
    })

    //字数统计
    $('#present_remark').on('input', function() {
        var length = $(this).val().length;
        if(length <= 100) {
            $(this).next('div').attr('class', 'message-length').text(length + '/100');
        } else {
            /*$(this).next('div').attr('class', 'sui-red').text('字数太多了。');*/
        }
    });

    AMap.plugin('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder({
        });
        if(!lineParam["departCityName"]) {
            var shareObj = {
                url : window.location.href,
            }
            wxInitConfig(shareObj,getGpsCallback);
        }
    });

    $('.startWeekTime').on('click', function () {
        var _this = $(this)
        initWeekTime(_this);
    });

})

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


