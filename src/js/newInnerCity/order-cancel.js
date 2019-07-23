$(function () {
    $('.compute .max').html($('.refund-notes-box textarea').attr('maxlength'));
    $('.refund-notes-box textarea').on('input',function () {
        $('.compute .current').html($(this).val().length);
    });
});