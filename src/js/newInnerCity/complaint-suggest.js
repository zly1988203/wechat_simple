//多行文本输入框剩余字数计算
function checkMaxInput(obj, maxLen) {
    $(".input-tip").show();
    if (obj == null || obj == undefined || obj == "") {
        return;
    }
    if (maxLen == null || maxLen == undefined || maxLen == "") {
        maxLen = 200;
    }

    var strResult;
    if (obj.value.length > maxLen) {	//如果输入的字数超过了限制
        obj.value = obj.value.substring(0, maxLen); //就去掉多余的字
        strResult = maxLen+"/"+maxLen; //计算并显示剩余字数
    }
    else {
        strResult = obj.value.length+"/"+maxLen; //计算并显示剩余字数
    }
    $(".input-tip").text(strResult);
}

//清空剩除字数提醒信息
function resetMaxmsg() {
    $(".input-tip").hide();
}

$(".btn-primary").click(function () {
    $(".suggest-main").hide();
    $(".suggest-commited").show();
});

$(".suggest-commited-foot").click(function () {
    $(".suggest-main").show();
    $(".suggest-commited").hide();
});