//车票状态
var TICKET_STATUS = {
    CHECKED: '1', // 已验票
    REFUNDED: '2', // 已退票
    TO_RIDE: '3', // 待乘车
};

$(function () {
    //    TODO 倒计时

    //动态电子票
    $('.checkanimat').flightChart({
        flights: ['../../dist/images/bus/check-animat/01.png', '../../dist/images/bus/check-animat/02.png', '../../dist/images/bus/check-animat/03.png', '../../dist/images/bus/check-animat/04.png', '../../dist/images/bus/check-animat/05.png', '../../dist/images/bus/check-animat/06.png', '../../dist/images/bus/check-animat/07.png', '../../dist/images/bus/check-animat/08.png'],
        flightSpeed: 3,
        text: '暂无文字'
    });
   init();
});

function init() {
    // 模拟验票码list
    var ticketList = [
        {
            checkingNo:'8976',//验票码
            ticketNo: '876553223455555',// 票号
            name: '张上哪1',
            IDNo: '4415***********975',
            status: '1',//状态
        },{
            checkingNo:'8977',//验票码
            ticketNo: '876553223455555',// 票号
            name: '张上哪2',
            IDNo: '4415***********975',
            status: '2',//状态
        },{
            checkingNo:'8978',//验票码
            ticketNo: '876553223455555',// 票号
            name: '张上哪3',
            IDNo: '4415***********975',
            status: '3',//状态
        }
    ];
    showTicketList(ticketList);
}

/**
 * 显示验票信息
 * @param ticketList
 */
function showTicketList(ticketList){
    var parent = $('.order-bottom');

    var itemHtml = '';
    ticketList.forEach(function (item ,index) {
        itemHtml += '<li data-status="'+ item.status +'">' +
            '  <div class="check-in-tips">验票码</div>' +
            '  <div class="check-in-code">'+ item.checkingNo +'</div>' +
            '  <div class="ticket-info">' +
            '    <div>票号：'+ item.ticketNo +'</div>' +
            '    <div>姓名：'+ item.name +'</div>' +
            '    <div>身份证：'+ item.IDNo +'</div>' +
            '  </div>' +
            '  <div class="status '+ getStatusClassName(item.status) +'"></div>' +
            '</li>';
    });


    var sliderHtml = '<div class="slider-box">' +
        '<div class="ticket-list slider">' +
        '  <ul class="slider-main clearfloat">' +
             itemHtml +
        '  </ul>' +
        '</div>' +
        '<div class="list-index"><span class="active"></span><span></span><span></span></div>' +
        '</div>';

    $(parent).append(sliderHtml);

    //获取slider宽度，设置样式
    var width = $('.order-bottom').width();//单个宽度
    $('.slider-main li').width(width + 'px');
    $('.slider').width(width + 'px').css({'overflow':'hidden'});//可视窗
    $('.slider-main').width(width * ticketList.length + 'px');

    //轮播功能
    sliderCheckNo(ticketList.length, width);
}
/**
 * 滑动切换验车码
 */
function sliderCheckNo(amount,width) {
    var visibleIndex = 1;// 当前可见li 的index 默认为1
    var now = $('.slider-main');//
    var startX, startY, moveEndX, moveEndY, X, Y;
    $('.slider-main li').on('touchstart',function (e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });
    $('.slider-main li').on('touchend',function (e) {
        moveEndX = e.changedTouches[0].pageX;
        moveEndY = e.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if(Math.abs(X) > Math.abs(Y) && X > 0){
            //right
            if(visibleIndex > 1){
                visibleIndex--;
                now.css({'left': -width*(visibleIndex-1) +'px'});
            }else{
                // 觉得没必要
                // now.css({'left': -width*(amount-1) + 'px'});
                // visibleIndex = amount;
            }
        }else if (Math.abs(X) > Math.abs(Y) && X < 0){
            //left
            if(visibleIndex < amount){
                visibleIndex++;
                now.css({'left': -width*(visibleIndex-1)+'px'});
            }else{
                // 觉得没必要
                // now.css({'left': '0px'});
                // visibleIndex = 1;
            }
        }
        //index指示样式改变
        var currentEle = $('.list-index').children('span')[visibleIndex-1];
        $(currentEle).addClass('active').siblings().removeClass();
    })
}

function getStatusClassName(status){
    var className = '';
    if(status == TICKET_STATUS.CHECKED){
        className = 'checked';
    }else if(status == TICKET_STATUS.REFUNDED){
        className = 'refunded';
    }else if(status == TICKET_STATUS.TO_RIDE){
        className = 'toride';
    }
    return className
}
