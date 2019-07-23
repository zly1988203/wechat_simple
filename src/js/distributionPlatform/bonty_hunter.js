$(function() {
    // 分页选项
    var _options = {
        pageSize: 5, // 每页数量
        totalAmount:16, //总记录条数
        totalIndex: 0, //当前条数
        flag: false // 事件锁
    };

    var loadData = function () {
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
            userName:'',
            userLevel:'中级推广员',
            userCompany:'江南出行',
            totalBounty:'666',
            customers:'35',
            orders:'125'
        }
        $(".info").find(".level").html(data.userLevel);
        $(".info").find(".current").html("当前车企："+data.userCompany);
        $(".amount span").first().html(data.totalBounty);
        $("#dvcustomers").find("span").html(data.customers)
        $("#dvorders").find("span").html(data.orders)
    }
    loadData();
    // 分页获取数据
    var requestServer = function() {
        // 显示分页指示器
        $('#line_box').loading();

        //模拟延迟, 假定是异步ajax的开始
        setTimeout(function() {
            //异步请求到的每页数据
            var dataList = [
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线1',
                    brokerage: '10'
                },
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线2',
                    brokerage: '10'
                },
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线3',
                    brokerage: '10'
                },
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线4',
                    brokerage: '10'
                },
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线5',
                    brokerage: '10'
                },
                {
                    start: '软件产业基地（学府路）',
                    end: '西乡客运站',
                    name: '广深定制专线6',
                    brokerage: '10'
                }

            ];
            // 渲染数据
            var strHtml ='';
            for(var i = 0; i < dataList.length; i++) {
                //当前记录条数 等于 总记录条数 的时候，加载完成
                if(_options.totalIndex == _options.totalAmount){
                    break;
                }else{
                    strHtml += '<li>' +
                        '<div class="station">' +
                        '<span class="start">' + dataList[i].start + '</span>' +
                        '<span class="end">' + dataList[i].end + '</span>' +
                        '</div>' +
                        '<button class="share-btn" data-href="#">推广</button>' +
                        '<div class="line-info">' +
                        '<span class="name">' + dataList[i].name + '</span>' +
                        '<span class="brokerage">赏金' + dataList[i].brokerage + '元起</span>' +
                        '</div>' +
                        '</li>';
                    _options.totalIndex++;  //当前记录条数自增
                }
            }
            $('#line_box').append(strHtml);
            /*
             * 销毁分页指示器的逻辑：
             * 1.数据加载完成的时候，移除
             * 2.假定数据不满一页，没有滚动条时候，移除
             */
            if(_options.totalIndex >= _options.totalAmount || _options.totalIndex < _options.pageSize) {
                $(document.body).rollPage('destroy');   // 销毁事件
                $('#line_box').hideLoading();               // 隐藏分页指示器
                return;
            }
            _options.flag = false;   // 数据渲染完成，事件解锁
        }, 1000);

    };

    // 页面加载完自动请求数据
    requestServer();

    $(document.body).rollPage('load', function() {
        // 事件锁, 防止频繁触发事件
        if(_options.flag) return;
        _options.flag = true;

        // 页面滚动到底部请求下一页
        requestServer();
    });
});