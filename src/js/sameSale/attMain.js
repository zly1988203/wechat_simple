
var wrapperScroll;


function swNewsImg(){
    /** 轮播图*/
    var sw = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'true',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 30
    });
}

$('.btn-buy').off('click').on('click',function () {
    $('#scenicSpotTicket').popup('plate');
})

$('.btn-edit').off('click').on('click',function () {
    $('#scenicSpotTicket').popup('plate');
})
$('.btn-order-canle').off('click').on('click',function () {
    $('#scenicSpotTicket').closePopup();
})
$('.btn-order-ok').off('click').on('click',function () {
    $('#scenicSpotTicket').closePopup();
});

$('.attraction-transportation-content input').off('click').on('click',function () {
    $('#stationListPopup').popup('plate');
});

$('#stationListPopup .close-popup').on('click',function () {
    $('#stationListPopup').closePopup();
})
$('#stationListPopup .confirm-btn').on('click',function () {
    $('#stationListPopup').closePopup();
    //TODO
})
$('#stationListPopup .station-list li').off('click').on('click',function () {
  var that = $(this);
  $(this).addClass('active').siblings().removeClass('active');
  //TODO
})
$('#preBuyBtn').off('click').on('click',function () {
    $('#scenicBusTicket').popup();
    wrapperScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });
})
$('#busTicketConfirm').on('click',function () {
    $('#scenicBusTicket').closePopup();
});

$('#btn-date').on('click', function() {
    $('#selectDate').popup('plate', function () {
        console.log('open')
    }, function (data) {
        console.log(data);
    });
}).backtrack({
    cancel: '#selectDate .sui-popup-mask'
});

$('.depart-date').on('click',function () {
    $('#selectDate').popup('plate', function () {
        console.log('open')
    }, function (data) {
        console.log(data);
    }).backtrack({
        cancel: '#selectDate .sui-popup-mask'
    });
});

$('.busLine #wrapper ul li').off('click').on('click',function () {
    $(this).addClass('active').siblings().removeClass('active');
    //TODO
    wrapperScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
});
$('.ticket-list li .less').off('click').on('click',function () {
    var $input = $(this).parent().find('input');
    var amount = $input.val();
    amount = parseInt(amount);
    if(amount<=0){
       return;
    }
    amount -= 1;
    $input.val(amount);
});
$('.ticket-list li .more').off('click').on('click',function () {
    var $input = $(this).parent().find('input');
    var amount = $input.val();
    amount = parseInt(amount);
    amount += 1;
    $input.val(amount);
});

$('#spotTicketConfirm').off('click').on('click',function () {
    $('#scenicSpotTicket').closePopup();
    //TODO
})


$(function () {
    swNewsImg();

    //填充日历
    $('.datepicker-wrapper').datePicker({
        dateBase: '2017-6-1',
        gather: [
            { date: '2017-6-19', comment: '已发车', state: 'readonly' },
            { date: '2017-6-20', comment: '已售罄', state: 'readonly' },
            { date: '2017-6-21', comment: '¥180.00', state: 'select' },
            { date: '2017-6-22', comment: '¥18', state: 'select', 'badge-right': '/dist/images/common/icon-discounts.png', 'badge-right-active': '/dist/images/common/icon-discounts-active.png' },
            { date: '2017-6-26', comment: '¥18', state: 'select' },
            { date: '2017-6-27', comment: '¥18', state: 'select', 'badge-right': '/dist/images/common/icon-discounts.png', 'badge-right-active': '/dist/images/common/icon-discounts-active.png' },
            { date: '2017-6-28', comment: '¥18', state: 'select' },
            { date: '2017-6-29', state: 'disabled' },
            { date: '2017-6-30', state: 'disabled' },
            { date: '2017-7-4', comment: '¥18', state: 'select' }
        ],
        selectCallback: function (data) {
            $('.pay-handle').find('.day').html(data.selectData.length);
        }
    });


})