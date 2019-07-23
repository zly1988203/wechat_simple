$(function(){
    // 显示优惠券列表
    // var len = $(".coupon").length;
    // if (len<=5){
    //     $(".more-btn").hide();
    // }
    $(".coupon").each(function(index){
        if ( index > 4 ){
            $(this).hide();//第(hide+1)几个以后开始隐藏
        }
        $(".more-coupon").click(function(){
            $(".coupon").show(); // 将对象显示
            // $(".more-btn").hide();
        });
    });

    // 显示优惠券详情
    var wordLength = function(a,b){//a是文字的class，b是按钮的class
        var ininWordArr = [];//用来存储所有段落的文字
        var nowWordArr = []; //用来存储隐藏后所有段落的文字
        $(a).each(function(){
            var ininWord = $(this).html();
            var pWordArr = [];// 存储段落的文字
            $(this).children("p").each(function () {
                var pWord = $(this).text();
                if (pWord.length>30){
                    pWord = pWord.substr(0,24);
                }
                pWord = "<p>"+pWord+"...</p>";
                pWordArr.push(pWord);
            })
            nowWordArr.push(pWordArr[0]);
            ininWordArr.push(ininWord);
            $(this).html(pWordArr[0]);
            // if (pWordArr.length<=1){
            //     $(this).next().css('display','none'); // 如果字数少于限制则不显示标签
            // }
        })
        $(document).on('click',b,function(){
            var i = $(b).index($(this));
            if ($(this).data('top')) {
                $(this).addClass('down');
                $(this).data('top',false);
                $(this).prev().html(ininWordArr[i]);
            } else {
                $(this).removeClass('down');
                $(this).data('top',true);
                $(this).prev().html(nowWordArr[i]);
            }
            return false;
        })
    }('.using-condition','.condition-detail')
});