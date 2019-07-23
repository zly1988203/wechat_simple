

$(function () {
    console.log('hhhh')

});

function initQrCode() {
    $('#qrcode').html('');
    var qrcode = new QRCode(document.getElementById("qrcode"));
    var ticketSerialNo = 'www.baidu.com';
    qrcode.makeCode(ticketSerialNo);
}

$('.to-check').on('click',function () {
    initQrCode();
    $('#qrCodePropup').show();
});

$('#qrCodePropup .icon-close').on('click',function () {
    $('#qrCodePropup').hide();
});