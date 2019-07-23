$(function () {
    var  initPage = function (){

        var userInfo = localStorage.getItem("userInfo")
        // httpUtils.ajax({
        //     data:{userId:userInfo.Id}
        //     url:reqPath+'myBountyInfo'
        // },function(result){
        //     if(result.code === 1){
        //         loadDate(result.data);
        //     }
        // },function(err){
        //
        // })

        var data = {
            recordedAmount:"20",
            withdrawAmount:"100",
            failureAmount:"10",
            tel:"0755-85269857"
        }
        $("#recorded").find("span").html(data.recordedAmount);
        $("#withdraw").find("span").html(data.withdrawAmount);
        $("#failure").find("span").html(data.failureAmount);
        $(".phone").find("a").html(data.tel);
        loadDate(mock_list);
    }

    var  loadDate = function(list) {
        // 显示分页指示器
        $('#ulLst').loading();
        setTimeout(function () {
            $.each(list,function (index,item) {
                var in_out = "+";
                if(item.statue === 'out'){
                    in_out = "-";
                }

                var liContent = '<li>' +
                    '<div class="list-particulars">' +
                    '<div class="name">'+item.title+'</div>' +
                    '<div class="amount">'+in_out+item.amount+'</div>' +
                    '</div>' +
                    '<div class="list-info"> ' +
                    '<div class="time">'+item.createTime+'</div>' +
                    '<div class="tips">'+item.remark+'</div>' +
                    '</div>'
                '</li>';
                $("#ulLst").append(liContent);
            })
            $('#ulLst').hideLoading();
        },1000)


    }
    var mock_list = [
        {title:"提取记录",statue:"out",amount:"10",createTime:"2018-05-11 10:30",remark:"提取"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"会员收入",statue:"in",amount:"30",createTime:"2018-05-10 10:30",remark:"下单了"},
        {title:"分销收入",statue:"in",amount:"15",createTime:"2018-05-06 05:30",remark:"下单了"},
    ]
    initPage();
});