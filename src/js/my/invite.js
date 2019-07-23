$(function () {
    //弹出隐藏层
    $(".btn").click(function () {
        var scrollHeight = $(document).height();//文档高度
        $("#fade").height = scrollHeight+"px";

        $("#myDiv").fadeIn("fast");
        $("#fade").fadeIn("fast");
    });
    //关闭弹出层
    $(".invite-tip-close").click(function () {
        $("#myDiv").hide();
        $("#fade").hide();
    });
});