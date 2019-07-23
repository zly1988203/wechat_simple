$(function () {
    //留言样式
    $('.notes').on('focus',function () {
        $(this).attr('placeholder','');
    });
    $('.notes').on('blur',function () {
        var value = $.trim($(this).val());
        if(value){
            $(this).attr('placeholder','');
        }else {
            $(this).val('');
            $(this).attr('placeholder','给司机留言');
        }
    });

    //初始化页面：获取上下车经纬度，渲染地图，请求后台数据是否有线路，请求过程中一直loading
    initPage();

    //请求后台数据进行线路匹配  /innerCity/optimize/judgeService
    judgeService();

    //回到原点
    $('#currLocation').on('click', function() {
        // todo 定位
        // map.panTo([lng, lat]);
    });

    //TODO 自动定位 添加当前位置marker

    /*var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

    //回到原点
    $('#currLocation').on('click', function() {
        // todo 定位
        // map.panTo([lng, lat]);
    });


   //自定义标记
    var markers = [];//所有maker对象、
    // marker点信息
    var markerList = [{
        icon: '../../dist/images/newInnerCity/icon-current.png',
        size:[25,50],
        position: [116.379028, 39.865042],
        offset: [0,25],
        markerType: 0//1-出发站点，2-结束，0-其他
    },{
        icon: '../../dist/images/newInnerCity/icon-start.png',
        size:[21,32],
        position: [116.379028, 39.865042],
        offset: [0,0],
        markerType: 1//1-出发站点，2-结束，0-其他
    },{
        icon: '../../dist/images/newInnerCity/icon-end.png',
        size:[21,32],
        position: [116.427281, 39.903719],
        offset: [0,0],
        markerType: 2//1-出发站点，2-结束，0-其他
    }];

    //构建自定义信息窗体
    function createInfoWindow(title) {
        var info = document.createElement("div");
        info.className = "marker-info-box";
        var tips = document.createElement('div');
        tips.className = 'marker-tips';
        tips.innerHTML = title;
        info.appendChild(tips);
        return info;
    }

    //生成marker和自定义信息框
    $.each(markerList,function (index, marker) {
        var tempMarker = new AMap.Marker({
            map: map,
            position: [marker.position[0], marker.position[1]],
            icon:new AMap.Icon({
                size: new AMap.Size(marker.size[0], marker.size[1]),  //图标大小
                image: marker.icon,
                imageOffset: new AMap.Pixel(marker.offset[0], marker.offset[1])//偏移量 0-left;60-top
            })
        });

        tempMarker.on('click', function (e) {
            //上车提示信息
            var startInfoWindow ;
            //下车提示信息
            var endInfoWindow ;
            if(marker.markerType == 1){
                startInfoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow('从这里上车'),
                    offset: new AMap.Pixel(0, -34)
                });
                startInfoWindow.open(map, e.target.getPosition());
            }else if(marker.markerType == 2){
                endInfoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow('从这里下车'),
                    offset: new AMap.Pixel(0, -34)
                });
                endInfoWindow.open(map, e.target.getPosition());
            }
        });
        tempMarker.emit('click', {target: tempMarker});//出发自定义函数

        markers.push(tempMarker);
    });



    //地图自适应使点标记显示在视野中
    var newCenter = map.setFitView();*/
});

$('.market-rules-btn').on('click',function () {
    $('.market-rule-container').popup('modal')
})

//初始化页面
function initPage() {
    var departLat = 39.865042;
    var departLng = 116.379028;
    var departAreaCode = '';
    var departTitle = '';
    var arriveLat = 39.903719;
    var arriveLng = 116.427281;
    var arriveAreaCode = '';
    var arriveTitle = '';
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

    var markers = [];//所有maker对象、
    // marker点信息
    var markerList = [{
        icon: '../../dist/images/newInnerCity/icon-current.png',
        size:[25,50],
        position: [departLng, departLat],
        offset: [0,25],
        markerType: 0//1-出发站点，2-结束，0-其他
    },{
        icon: '../../dist/images/newInnerCity/icon-start.png',
        size:[21,32],
        position: [departLng, departLat],
        offset: [0,0],
        markerType: 1//1-出发站点，2-结束，0-其他
    },{
        icon: '../../dist/images/newInnerCity/icon-end.png',
        size:[21,32],
        position: [arriveLng, arriveLat],
        offset: [0,0],
        markerType: 2//1-出发站点，2-结束，0-其他
    }];

    //构建自定义信息窗体
    function createInfoWindow(title) {
        var info = document.createElement("div");
        info.className = "marker-info-box";
        var tips = document.createElement('div');
        tips.className = 'marker-tips';
        tips.innerHTML = title;
        info.appendChild(tips);
        return info;
    }

    //生成marker和自定义信息框
    $.each(markerList,function (index, marker) {
        var tempMarker = new AMap.Marker({
            map: map,
            position: [marker.position[0], marker.position[1]],
            icon:new AMap.Icon({
                size: new AMap.Size(marker.size[0], marker.size[1]),  //图标大小
                image: marker.icon,
                imageOffset: new AMap.Pixel(marker.offset[0], marker.offset[1])//偏移量 0-left;60-top
            })
        });

        tempMarker.on('click', function (e) {
            //上车提示信息
            var startInfoWindow ;
            //下车提示信息
            var endInfoWindow ;
            if(marker.markerType == 1){
                startInfoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow('从这里上车'),
                    offset: new AMap.Pixel(0, -34)
                });
                startInfoWindow.open(map, e.target.getPosition());
            }else if(marker.markerType == 2){
                endInfoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow('从这里下车'),
                    offset: new AMap.Pixel(0, -34)
                });
                endInfoWindow.open(map, e.target.getPosition());
            }
        });
        tempMarker.emit('click', {target: tempMarker});//出发自定义函数

        markers.push(tempMarker);
    });

    //地图自适应使点标记显示在视野中
    var newCenter = map.setFitView();
}

// 线路匹配
function judgeService() {
    //模拟返回数据
    var reqData = {
        'cityLine':{
            'price':'',
            'comfortablePrice':'',
            'luxuriousPrice':'',
            'sevenSeatPrice':'',
            'comfortableSeat':'3',
            'luxuriousSeat':'4',
            'businessSeat':'5',
            'upRegionId':'',
            'downRegionId':'',
            'lineName':'',
            'name':'',
            'type':'',
            'id':''
        },
        'isInfo':'',
        'isCardNo':'',
        'bookTime':'',
        'timeArea':'',
        'activityTag':'',
        'carPool':{
            'price':'',
            'payPrice':'',
            'discount':'',
            'couponPrice':'',
            'specialPrice':'',
            'promoteType':'',
            'sale':'',
            'oldPrice':'',
        },
        'comfortable':{
            'price':'',
            'payPrice':'',
            'discount':'',
            'couponPrice':'',
            'specialPrice':'',
            'promoteType':'',
            'sale':'',
            'oldPrice':'',
        },
        'luxurious':{
            'price':'',
            'payPrice':'',
            'discount':'',
            'couponPrice':'',
            'specialPrice':'',
            'promoteType':'',
            'sale':'',
            'oldPrice':'',
        },
        'business':{
            'price':'',
            'payPrice':'',
            'discount':'',
            'couponPrice':'',
            'specialPrice':'',
            'promoteType':'',
            'sale':'',
            'oldPrice':'',
        }
    }

    //座位数 实名制isCardNo 0-否 1-是
    if(reqData.isCardNo != undefined && reqData.isCardNo ==1){
        // 实名制
        $('#amount').data('type',1);
    }else{
        // 非实名制
        $('#amount').data('type',0);
        //最大座位数
        var maxSeatNo = (reqData.cityLine.comfortableSeat == undefined)? 0 : reqData.cityLine.comfortableSeat;
        if(maxSeatNo < reqData.cityLine.luxuriousSeat){
            maxSeatNo = reqData.cityLine.luxuriousSeat;
        }
        if(maxSeatNo < reqData.cityLine.businessSeat){
            maxSeatNo = reqData.cityLine.businessSeat;
        }
        $('#amount').data('max',maxSeatNo);
    }

    //出发时间 默认60分
    $('.startTime').data('intervalminute',(reqData.cityLine.timeArea==undefined || reqData.cityLine.timeArea=='' ? 60 : reqData.cityLine.timeArea));

    // 选择车型模块
    var personAmount = $('#amount').val();// 选择的人数
    //舒适型
    if(personAmount > reqData.cityLine.comfortableSeat){
        reqData.comfortable = null//对象置空 则不显示
    }
    // 豪华型
    if(personAmount > reqData.cityLine.luxuriousSeat){
        reqData.luxurious = null;
    }
    // 商务型
    if(personAmount > reqData.cityLine.businessSeat){
        reqData.business = null;
    }

    //动态生成车型模块
    var _switchBoxHtml = '';
    //优惠类型
    var type = '';
    //车型
    var stage = 0;
    //原价
    var price = 0;
    //优惠价
    var couponPrice = 0;
    //拼车
    if(reqData.carPool != null){
        type = reqData.carPool.promoteType;
        stage = 1;
        price = reqData.carPool.price;
        couponPrice = reqData.carPool.couponPrice;
        _switchBoxHtml += createVehicleItem(type,stage,price,couponPrice);
    }
    //舒适型
    if(reqData.comfortable != null){
        stage = 2;
        type = reqData.comfortable.promoteType;
        price = reqData.comfortable.price;
        couponPrice = reqData.comfortable.couponPrice;
        _switchBoxHtml += createVehicleItem(type,stage,price,couponPrice);
    }
    //豪华型
    if(reqData.luxurious != null){
        stage = 3;
        type = reqData.luxurious.promoteType;
        price = reqData.luxurious.price;
        couponPrice = reqData.luxurious.couponPrice;
        _switchBoxHtml += createVehicleItem(type,stage,price,couponPrice);
    }
    // 商务型
    if(reqData.business != null){
        stage = 4;
        type = reqData.business.promoteType;
        price = reqData.business.price;
        couponPrice = reqData.business.couponPrice;
        _switchBoxHtml += createVehicleItem(type,stage,price,couponPrice);
    }

    $('.confirm-container .vehicle-switch-box').html(_switchBoxHtml);

    // 车型选择
    $('.vehicle-item .vehicle-info').on('click',function () {
        var self = $(this).find('i');
        $(this).parent().addClass('active').siblings().removeClass('active');
        console.log($(this).parents('.vehicle-switch-box'))

    });
    // 查看费用明细
    $('.vehicle-item .price-box').on('click',function () {
        var parent = $(this).parent();
        var stageName = switchStage($(parent).data('stage'));
        var price = $(parent).data('price');
        var couponName = $(parent).data('couponname');
        var couponPrice = $(parent).data('couponprice');
        var _detailHtml = '';
        _detailHtml += '<div class="detail-box">' +
                '<div class="detail-item"><div class="name">'+stageName+'一口价</div><div class="number">'+price+'元</div></div>' +
                '<div class="detail-item"><div class="name">人数</div><div class="number">'+$('#amount').val()+'人</div></div>' +
            '</div>' +
            '<div class="coupon-box">' +
                '<div class="coupon-item"><div class="name">'+couponName+'</div><div class="number">-'+couponPrice+'元</div></div>' +
            '</div>';

        // 生成费用明细
        $('.price-detail-container .price-detail-main').html(_detailHtml);
        $('.price-detail-container').popup('push')
    });
}

/**
 * 生成item
 * @param type 优惠类型 1-特价 2-券
 * @param stage 车型 1-拼车 2-舒适型 3-豪华型 4-商务型
 * @param price 正常价格
 * @param couponPrice 优惠价格
 * @returns {string}
 */
function createVehicleItem(type,stage,price,couponPrice) {
    var _vehicleItemHtml = '';
    // 活动类型 0-优惠券 1-特价
    var couponName = '';

    if(type == 1){
        couponName = '特价';
    }
    if(	type == 2){
        couponName = '券已抵扣';
    }

    var className = '';
    var stageName = switchStage(stage);

    if(stage == 1 ){
        className = ' stage-one';
        // stageName = '拼车';
    }else if(stage == 2 ){
        className = ' stage-two';
        // stageName = '舒适型';
    }else if(stage == 3 ){
        className = ' stage-three';
        // stageName = '豪华型';
    }else if(stage == 4 ){
        className = ' stage-four';
        // stageName = '商务型';
    }

    _vehicleItemHtml +='<div class="vehicle-item" data-stage="'+stage+'" data-price="'+price+'" data-couponname="'+couponName+'" data-couponprice="'+couponPrice+'">' +
        '<div class="vehicle-info">' +
        '<div class="name">' + stageName + '</div>' +
        '<div class="stage-icon'+ className +'"><i></i></div>' +
        '</div>' +
        '<div class="price-box">' +
        '<div class="price">一口价<span>' + price + '元&nbsp;&gt;</span></div>' +
        '<div class="coupon">' + couponName + couponPrice + '元</div>' +
        '</div>' +
        '</div>';

    return _vehicleItemHtml;
}

function switchStage(stage) {
    var stageName = '';
    switch(stage){
        case 2: stageName='舒适型';break;
        case 3: stageName='豪华型';break;
        case 4: stageName='商务型';break;
        default : stageName='拼车';break;
    }
    return stageName;
}

// 温馨提示
$('.tips-btn').on('click',function () {
    $('.tips-container-popup').show();
});
// 弹出框关闭
$('.popup-container .close').on('click',function () {
    $('.popup-container').hide();
});

$('#closeButton').on('click',function () {
    $('.price-detail-container').closePopup();
});
//实名制选择人数
$('#amount').on('click',function () {
    var type = $(this).data('type');// 0-非实名制 1-实名制
    var max = $(this).data('max');// 非实名制最大座位数
    if(type == 1){
        // 实名制
        showSelectPerson();
    }else{
        // 非实名制选择人数
        var maxData = [];
        for(var i=1; i<max+1; i++){
            var temp = {
                'value':i,
                'text':i
            };
            maxData.push(temp);
        };

        $.selectPicker({
            title:'选择出行人数',
            data:maxData,
            current: $('#present_peopleNumber').data('value'),
            onChange: function(v, t) {
                var people = $('#amount');

                if(people.val() != t) {
                    people.data('value', v).val(t).trigger('change');
                }
            }
        });
    }
});

//TODO 动态生成实名制乘车人信息
function showSelectPerson() {
    $('.select-person-container').show();
}

$('.notes-box textarea').on('input',function () {
    var _this = this;
    var maxLength = parseInt($(_this).data('maxlength'));
    var length = textLength($(_this));
    if(length > maxLength){
        $(_this).val($(_this).val().substring(0,maxLength)) ;
    }
});

// 计算字符长度 汉子2字符 数字英文为1字符
function textLength(res) {
    var len = 0;
    var str = $(res).val();
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}

// 选择实名制乘车人弹窗
$('.selection').on('click',function () {
    var classNames = $(this).attr('class');
    var selected = $('.select-person-main .title .selected').data('value');//选中的人数
    // var total = $('.select-person-main .title .total').data('value');//总人数
    // $('.select-person-main .title .total').html(total);
    if( classNames.indexOf('active') == -1){
        //选中乘车人
        $(this).addClass('active');
        $(this).parent().data('selected',true);//选中标记
        selected++;

    }else{
        $(this).removeClass('active');
        $(this).parent().data('selected',false);
        selected--;
    }
    $('.select-person-main .title .selected').html(selected);
    $('.select-person-main .title .selected').data('value',selected);
});
//确定选中的实名制乘车人按钮
$('.select-person-container .confirm-btn').on('click',function () {
    var selected = $('.select-person-main .title .selected').data('value');//选中的人数
    var selectedList = [];//选中的乘客列表
    var _selectedInputHtml = '';
    if(selected <= 0){
        $.toast('请选择乘车人');
    }else {
        $('#amount').val(selected);
        var allList = $('.select-person-container .person-box .person-item');
        $.each(allList,function (index, item) {
            var person = {};
            if($(item).data('selected')){
                // person.id = $(item).data('id');
                person.name = $(item).data('name');
                person.idno = $(item).data('idno');
                selectedList.push(person);
                _selectedInputHtml +='<input type="hidden" data-id="" data-name="'+ $(item).data('name') +'" data-idno="'+ $(item).data('idno') +'" />'
            }
        });
        //添加到页面
        $('#personList').html(_selectedInputHtml);
        $('.select-person-container').hide();
    }

});
// 编辑实名制乘车人
$('.person-item .edit-btn').on('click',function () {
    $('.select-person-container').hide();

    //动态生成编辑弹窗数据
    var _parent = $(this).parent();
    var name = $(_parent).data('name');
    var idNo = $(_parent).data('idno');
    showEditPersonContainer(name,idNo);
});
//添加实名制乘车人
$('.add-person').on('click',function () {
    $('.select-person-container').hide();
    showEditPersonContainer();
});
// 出发时间选择
$('.startTime').on('click', function() {
    var _input = $(this);
    initCityTimePicker(_input)
});
//动态生成 编辑/添加 实名制乘车人信息
function showEditPersonContainer(name,idno) {
    var _editPersonContainer = '';
    var _titleHtml = '';
    var editType = 0;//编辑类型 0-编辑 1-新增
    if(name == undefined){
        name = '';
    }
    if(idno == undefined){
        idno = '';
    }
    if( name==''&&  idno==''){
        //添加乘车人
        _titleHtml ='<div class="title">添加乘车人</div>';
        editType =1;
    }else{
        // 编辑乘车人
        _titleHtml ='<div class="title">编辑乘车人</div>';
        editType = 0;
    }
    _editPersonContainer +=
        '<div class="popup-main">' +
            '<div class="title-content">' +
                '<div class="close-edit">取消</div>'+ _titleHtml +'<div class="confirm-btn">确定</div>' +
            '</div>' +
            '<div class="edit-box">' +
                '<div class="edit-item">' +
                    '<div class="name">姓名</div><input id="personName" class="value" value="' + name + '" placeholder="请输入乘车人姓名"/>' +
                '</div>' +
                '<div class="edit-item">' +
                    '<div class="name">身份证</div><input id="personIDNo" class="value" value="' + idno + '" placeholder="请输入乘车人证件号码"/>' +
                '</div>' +
            '</div>' +
        '</div>';

    $('.edit-person-container').html(_editPersonContainer).show();

    //取消 添加/编辑 乘车人
    $('.edit-person-container .close-edit').on('click',function () {
        $('.select-person-container').show();
        $('.edit-person-container').hide();
    });
    //确定 添加/编辑 乘车人
    $('.edit-person-container .confirm-btn').on('click',function () {
        // TODO 数据提交
        var name = $('#personName').val();
        var IDNo = $('#personIDNo').val();
        if(name == ''){
            $.toast('请输入乘车人姓名');
        }else if(IDNo == ''){
            $.toast('请输入乘车人证件号码');
        }else if(!checkIDCard(IDNo)){
            $.toast('请输入正确的乘车人证件号码');
        }else if(name !='' && IDNo!='' && checkIDCard(IDNo)){
            confirmEditPerson(name,IDNo,editType);
            $('.select-person-container').show();
            $('.edit-person-container').hide();
        }
    });
}

//TODO 提交编辑/添加的乘车人信息 editType:0-编辑，1-新增
function confirmEditPerson(name, idNo, editType) {
    // TODO 数据提交到后台 成功后回显

    //TODO 数据回显到选择乘车人页面
}

//身份证号码校验
function checkIDCard(idcode){
     // 加权因子
     var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
     // 校验码
     var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

     var code = idcode + "";
     var last = idcode[17];//最后一个

     var seventeen = code.substring(0,17);

     // 最后一位算法--ISO 7064:1983.MOD 11-2
     // 判断最后一位校验码是否正确
     var arr = seventeen.split("");
     var len = arr.length;
     var num = 0;
     for(var i = 0; i < len; i++){
             num = num + arr[i] * weight_factor[i];
         }

     // 获取余数
     var resisue = num%11;
     var last_no = check_code[resisue];

     // 格式的正则
     // 正则思路
     /*
         第一位不可能是0
         第二位到第六位可以是0-9
         第七位到第十位是年份，所以七八位为19或者20
         十一位和十二位是月份，这两位是01-12之间的数值
         十三位和十四位是日期，是从01-31之间的数值
         十五，十六，十七都是数字0-9
         十八位可能是数字0-9，也可能是X
   */
     var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

     // 判断格式是否正确
     var format = idcard_patter.test(idcode);

     // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
     return last === last_no && format ? true : false;
 }

 function showSharingCarPrice() {
     //do noting
 }

var winHeight = $(window).height();   //获取当前页面高度
$(window).resize(function(){
    var thisHeight = $(this).height();
    if(winHeight - thisHeight > 50){
        //当软键盘弹出，在这里面操作
        $('.confirm-container').hide();
    }else{
        //当软键盘收起，在此处操作
        $('.confirm-container').show();
    }
});