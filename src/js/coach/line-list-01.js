$(function() {
    //日历左右滑动效果
    var dateScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });
    var active_li = $('.ola-date li.active');
    dateScroll.scrollToElement(active_li[0], 500, false, false, IScroll.utils.ease.circular);

    //绑定点击事件
    var date_event = isAndroid() ? 'tap' : 'click';
    $('.ola-date li').on(date_event, function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
    });









    selectDate();
    //出发站点
    footHandle($('#selectStartStation'), $('#start-station'), function () {
        //TODO
        //选中项
        var station = [];

        $('[name=startStation]:checked').each(function (index, item) {
            station.push($(item).val());
        });

        console.log('出发站点', station);
    });

    //到达站点
    footHandle($('#selectEndStation'), $('#end-station'), function () {
        //TODO
        //选中项
        var station = [];

        $('[name=endStation]:checked').each(function (index, item) {
            station.push($(item).val());
        });

        console.log('到达站点', station);
    });

    //发车时间
    footHandle($('#selectStartTime'), $('#start-time'), function () {
        //TODO
        //选中项
        var startTime = [];

        $('[name=startTime]:checked').each(function (index, item) {
            startTime.push($(item).val());
        });

        console.log('发车时间', startTime);
    });
});

/*
   * 选择日期
   * */
function selectDate() {
    var trigger = $('.all-date-btn'),
        parent = $('#select-date');
    var initDateStatus = false;

    var init = function () {
        //只初始化一次
        if(!initDateStatus) {
            initDateStatus = true;
            parent.find('.date').datePicker({
                dateBase: '2017-10-10',
                weekend: false,
                multiple: false,
                gather: createData([10, 11, 12]),
                selectCallback: function (data) {
                    //TODO
                    parent.closePopup(function () {
                        var d = data.selectData[0].date;
                        var val = d.year + '-' + d.month + '-' + d.day;

                        trigger.val(val).siblings('i').text(val);
                    });
                }
            });
        }
    };

    //弹出层
    trigger.on('click', function () {
        var self = $(this);

        parent.popup('pull', init);
    });
}

//创建随机数据
function createData(monthDrr) {
    var result = [];

    monthDrr.forEach(function (item, index) {
        var _n = 0,
            _MAX = new Date(2017, item, 0).getDate();

        var arr = [];
        //创建数组
        for(var i = 0; i < _MAX; i++) {
            _n = parseInt(Math.random().toFixed(2) * 10) + i + index;

            if(_n <= _MAX) {
                arr.push(_n);
            }
        }

        //去重
        for(var n = 0; n < arr.length; n++) {
            for(var m = 0; m < arr.length; m++) {
                if(arr[n] == arr[m]) {
                    arr.splice(m, 1);
                }
            }
        }

        //排序
        arr.sort(function () {
            return -1;
        });

        //填充数据
        for(var l = 0; l < arr.length; l++) {
            var _result = {
                date: '2017-' + item + '-' + arr[l],
                state: 'select'
            };

            if(parseInt(2 * Math.random())) {
                _result.comment = '备注';
            }

            /*switch(parseInt(4 * Math.random()) + 1) {
                case 1:
                    _result.state = 'select';
                    break;
                case 2:
                    _result.state = 'readonly';
                    break;
                case 3:
                    _result.state = 'disabled';
                    break;
            }*/
            _result.state = 'select';
            result.push(_result);
        }
    });

    return result;
}

/*
* 底部操作
* */
function footHandle(trigger, parent, submitCallback, openCallback) {
    var reset = parent.find('[data-handle=reset]'),
        submit = parent.find('[data-handle=submit]');
    var list = parent.find('.main li'),
        first = list.eq(0);

    var _myIScroll;

    var init = function () {
        var main = parent.find('.scroll-box');
        var MAX = list.height() * 5 / parseFloat($('html').css('font-size')) + 'rem';
        main.css('max-height', MAX);

        // 绑定滚动条
        var bindScroll = function() {
            if(_myIScroll) {
                _myIScroll.destroy();
            }
            setTimeout(function() {
                _myIScroll = new IScroll('#' + parent.attr('id') + ' .scroll-box', {
                    click: iScrollClick(),
                    scrollX: false,
                    scrollY: true,
                    mouseWheel: true
                });
            }, 300);
        };
        bindScroll();
    };

    //兼容安卓
    function iScrollClick(){
        if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
        if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
        if (/Silk/i.test(navigator.userAgent)) return false;
        if (/Android/i.test(navigator.userAgent)) {
            var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
            return parseFloat(s[0]+s[3]) < 44 ? false : true
        }
    }

    //弹出层
    trigger.on('click', function () {
        parent.popup('plate', function () {
            //显示前触发函数
            if(openCallback instanceof Function) {
                openCallback();
            }
        });

        if(!parent.data('init')) {
            parent.data('init', true);
            init();
        }
    });

    //选择站点
    list.on('click', function () {
        var self = $(this),
            ipt = self.find('input');

        if(!self.hasClass('active')) {
            self.addClass('active');
            ipt.prop('checked', true);

            if(ipt.val() == '不限') {
                //选择不限：其他取消选中
                first.addClass('active').find('input').prop('checked', true);
                first.nextAll().removeClass('active').find('input').prop('checked', false);
            } else if(first.find('input:checked').length == 1) {
                //选择其他项：如果不限已被选中，则取消不限
                first.removeClass('active').find('input').prop('checked', false);
            }
        } else {
            self.removeClass('active');
            ipt.prop('checked', false);

            if(first.nextAll('.active').length == 0) {
                //除不限以外，其他都取消选择
                first.addClass('active').find('input').prop('checked', true);
            }
        }
    });

    //重置
    reset.on('click', function () {
        first.addClass('active').find('input').prop('checked', true);
        first.siblings().removeClass('active').find('input').prop('checked', false);
    });

    //确定
    submit.on('click', function () {
        //关闭弹出层
        parent.closePopup(function () {
            //关闭后触发函数
            if(submitCallback instanceof Function) {
                submitCallback();
            }
        });
    });
}