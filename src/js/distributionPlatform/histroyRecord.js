$(function() {
     var _getMoreHtml = '<div class="get-more">点击加载更多</div>';
// 分页选项
    var _options = {
        pageSize: 2, // 每页数量
        totalAmount:22, //总记录条数
        totalIndex: 0, //当前条数
        flag: false // 事件锁
    };
    // 分页获取数据
    var requestServer = function() {
        // 显示分页指示器
        // $('#history_list').loading();
        // $('.history-container .get-more').loading();

        //模拟延迟, 假定是异步ajax的开始
        setTimeout(function() {
            //异步请求到的每页数据
            var dataList = [
                {
                    name: '提现1',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },
                {
                    name: '提现2',
                    amount: '2',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了aaaaa'
                },
                {
                    name: '提现3',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },
                {
                    name: '提现4',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },
                // {
                //     name: '提现5',
                //     amount: '-10',
                //     time: '2018/10/10  12:12:12',
                //     tips: '小姐姐下单了'
                // },
                // {
                //     name: '提现6',
                //     amount: '-10',
                //     time: '2018/10/10  12:12:12',
                //     tips: '小姐姐下单了'
                // },
                {
                    name: '提现7',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },{
                    name: '提现8',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },{
                    name: '提现9',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
                },
                {
                    name: '提现10',
                    amount: '-10',
                    time: '2018/10/10  12:12:12',
                    tips: '小姐姐下单了'
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
                        '<div class="amount">' + dataList[i].name + '<span>' + dataList[i].amount + '元</span></div>' +
                        '<div class="time">' + dataList[i].time + '<span>' + dataList[i].tips + '</span></div>' +
                        '</li>';
                    _options.totalIndex++;  //当前记录条数自增
                }
            }
            $('#history_list').append(strHtml);
             $('.get-more-box').html(_getMoreHtml);

            $('.history-container .get-more').on('click',function () {
                $.toast('加载中。。')
                // 事件锁, 防止频繁触发事件
                if(_options.flag) return;
                _options.flag = true;

                // 页面滚动到底部请求下一页
                requestServer();
            });
            /*
             * 销毁分页指示器的逻辑：
             * 1.数据加载完成的时候，移除
             * 2.假定数据不满一页，没有滚动条时候，移除
             */
            if(_options.totalIndex >= _options.totalAmount || _options.totalIndex < _options.pageSize) {
                $(document.body).rollPage('destroy');   // 销毁事件
                 // $('#history_list').hideLoading();               // 隐藏分页指示器
                return;
            }
            _options.flag = false;   // 数据渲染完成，事件解锁
        }, 1000);

    };

    // 页面加载完自动请求数据
    requestServer();

    // $(document.body).rollPage('load', function() {
    //     $.toast('加载中。。')
    //     // 事件锁, 防止频繁触发事件
    //     if(_options.flag) return;
    //     _options.flag = true;
    //
    //     // 页面滚动到底部请求下一页
    //     requestServer();
    // });
    // $('.history-container .get-more').on('click',function () {
    //     $.toast('加载中。。')
    //     // 事件锁, 防止频繁触发事件
    //     if(_options.flag) return;
    //     _options.flag = true;
    //
    //     // 页面滚动到底部请求下一页
    //     requestServer();
    // });
})