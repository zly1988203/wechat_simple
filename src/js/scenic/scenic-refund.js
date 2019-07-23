$(function () {
    //规则
    $.ruleInit();
});

$('.refund-info-content li').off('click').on('click',function () {
    var value = $(this).data('value');
    $('#refundReason').val(value);
    $(this).addClass('active').siblings().removeClass('active');
});
$('#refundBtn').off('click').on('click',function () {
    var li = $('.refund-info-content').find('li[class^="active"]');
    var refundReson = $(li).data('value');
    $.confirm('确定提示退票申请吗？', function() {
        console.log('ok');
    });
});

