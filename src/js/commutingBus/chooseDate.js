var preOrderInfo = {
    selectData:[],
    busIds:'',
    qrcId:''

}
function getCalendarList() {
    var param = {
        token:serverUtil.token,
        scheduleId:'',
        startStationId:'',
        endStationId:'',
        departDate:''

    }
    
    request(commuteApi.calendarList,param).then(function (res) {
        if(res.code == 0){
            var data = res.data;
            if(data.scheduleInfoList.length > 0){
                data.scheduleInfoList.forEach(function (item,index) {
                    item.comment = "¥"+item.sellPrice;
                    item.status = 'select';

                    if(item.hasWork == 0){
                        item['tag'] = '休';
                    }else {
                        item['tag'] = '班';
                    }

                    if(item['ticketRemainNum'] == 0){
                        item['comment'] = '售罄';
                        item['status'] = 'readonly';
                    }
                    if(item['busStatus'] == 0){
                        item['comment'] = '已停售';
                        item['status'] = 'readonly';
                    }
                    if(item['busStatus'] == -1){
                        item['status'] = 'readonly';
                    }
                    if(item['id']==-1 || item['id']==-2){
                        item['comment'] = '未排班';
                        item['status'] = 'readonly';
                    }
                    if(item['hasBought'] == 1){
                        item['comment'] = '已购票';
                        item['status'] = 'readonly';
                    }

                    if(item['specialState'] == 1 && item['ticketRemainNum'] != 0 && item['busStatus'] > 0){
                        item['badge'] = '/src/images/common/icon-discounts.png';
                    }

                })
                initDatePicker(data.scheduleInfoList);
            }else {
                initDatePicker([]);
            }
        }
    })
}

function getLocalTime(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth()+1);
    var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    return d.getFullYear() + '-' + month + '-' + date;
}

function initDatePicker(list) {
    var nowDay = new Date();
    var strDay = getLocalTime(nowDay.getTime());
    $('.date-picker-container').datePicker({
        dateBase: strDay,
        switchMonth:switchMonthEvent,
        //特殊标记的日历
        gather: list,
//            before: true,
        selectCallback:function (data) {
            preOrderInfo.selectData = data.selectData;
        }
    });

    var switchMonthEvent = function (currentDate,picker) {
        //切换月份 模拟ajax
        setTimeout(function () {
            if(picker){
                picker.reset({
                    gather: [
                        {
                            date: '2019-08-05',
                            comment: '有票',
                            status: 'select',
//                                    tag: '休',
                            label: '端午',
                            badge: '',
                        },
                        {
                            date: '2019-08-09',
                            comment: '有票',
                            status: 'select',
                            tag: '休',
//                                    label: '端午',
                            badge: '',
                        }
                    ]
                });
                picker.drawMonth(currentDate);
            }
        },600)
    }
}

$('.back-btn').on('click',function () {
    window.history.go(-1);
})

$('.confirm-btn').on('click',function () {
    var param = {
        token:serverUtil.token,
        busId:'',
    }

    request(commuteApi.queryNotPayOrders,param).then(function (result) {
        if(result.code == 0){
            preOrderInfo.selectData.forEach(function (item,index) {
                preOrderInfo.busIds += item.id+','
            })
            postPage("/commutingBus/toAddOrder",[{name:'busIds',value:preOrderInfo.busIds},{name:'qrcId',value:preOrderInfo.qrcId}]);
        }else if(result.code == 50086){
            var orderNo = result.data;
            $.confirm('您当前有未支付订单，不能重复下单', '提示',['我知道了', '进入订单'], function() {
                window.location.href="/bus/toCommuteOrderDetail?orderNo="+orderNo;
            });
        }else{
            $.alert(result.message||'未知错误');
        }

    })
})

$(function () {
    getCalendarList();
})

