var dataUtils = {

    /*创建随机数据*/
     createData: function(monthDrr) {
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

            _result.state = 'select';
            result.push(_result);
        }
    });

    return result;
},

    //_el_trigger   "#id" or ".class"
    exChangeVal:function (_el_trigger,_elStart,_elEnd) {
        _el_trigger.on('click', function() {
            var startAddr = _elStart.val();
            var endAddr = _elEnd.val();
            _elStart.val(endAddr);
            _elEnd.val(startAddr);
        });
    },

    /* 选择日期
    * param {el_trigger: ,el_popup:}
    *
    * * */
    selectDate: function(param) {
        if(typeof param === "undefined") return;

        var trigger = param.el_trigger,
            parent = param.el_popup,
            cancel = parent.find('.cancel');
        var initDateStatus = false;

        var init = function () {
            //只初始化一次
            if(!initDateStatus) {
                initDateStatus = true;
                parent.find('.date').datePicker({
                    dateBase: '2017-10-10',
                    weekend: false,
                    multiple: false,
                    gather: dataUtils.createData([10, 11, 12]),
                    selectCallback: function (data) {
                        //TODO
                        var d = data.selectData[0].date;
                        var val = d.year + '-' + d.month + '-' + d.day + '  ' + d.week;

                        //是否是今天
                        var today = new Date();
                        if(today.getFullYear() == d.year && today.getMonth() + 1 == d.month && today.getDate() == d.day) {
                            val += '(今天)';
                        }

                        parent.setPopupData(val);
                        cancel.triggerHandler('click');
                    }
                });
            }
        };

        //弹出层
        trigger.on('click', function () {
            var self = $(this);
            parent.popup('modal', init, function (data) {
                trigger.val(data);
                dataUtils.reSetWidth(trigger);
            });
        }).backtrack({
            cancel: parent.selector+' .cancel'
        });

        //返回
        parent.find('.cancel').on('click',function () {
            parent.closePopup();
        })
    },

    /* 监听文字变化，重设宽度*/
    reSetWidth: function (o) {
        var _html = $('<div>' + o.val() + '</div>');
        _html.css({
            position: 'absolute',
            top: '-9999px',
            zIndex: -9999,
            paddingLeft: o.css('padding-left'),
            paddingRight: o.css('padding-right'),
            fontSize: o.css('font-size'),
            fontWeight: o.css('font-weight'),
            fontFamily: o.css('font-family')
        });
        o.after(_html);

        var w = (_html.width() + 10) / parseFloat($('html').css('font-size')) + 'rem'
        o.width(w);

        _html.remove();
    }

}

var adrsUtils = {
    /* 选择地址 选择出发地和目的地*/

    /**
     * param{
     * selectMode: mapMode,normal,other
     * el_trigger:
     * el_popup:
     * }
     *
     * **/
    targetType : isAndroid() ? 'tap' : 'click',
    selectAddress: function (param,callback) {
        var _isInitsa = false, _myIScrollsa ;
        var trigger = param.el_trigger;
        var popup_main = param.el_popup;
        if(typeof param === "undefined" || param.selectMode === undefined || param.selectMode === "normal"){
            trigger.on('click', function() {
                var _this = $(this).find('input');
                popup_main.popup('push', function() {
                    if(_isInitsa) return;
                    _isInitsa = true;
                    setTimeout(function() {
                        popup_main.find('.wrapper').css('height', $(window).height() - 44);
                        _myIScrollsa = new IScroll('#searchWrapper');
                    }, 300);
                }, function(data) {
                    _this.val(data);
                });
            });
        }else if(param.selectMode === "mapMode") {
        }else {
            callback();
        }

        //关键词搜索结果 - new (动态生成HTML并绑定事件)

        popup_main.find('.search-input input').on('input', function() {
            var self = $(this);
            var len = self.val().length;
            var strHtml = '';

            var gather = $('#searchResult').siblings();
            if($.trim(self.val()) != '') {
                //内容不为空，隐藏下面的信息
                gather.hide();
            } else {
                gather.show();
            }

            for(var i = 0; i < len; i++) {
                strHtml += '<li class="sui-border-b">' +
                    '<div class="sui-cell-map">' +
                    '<h1>'+i+'中交出行</h1>' +
                    '<h2>深圳市南山区粤海街道科园路创业投资大厦8楼</h2>' +
                    '</div>' +
                    '</li>';
            }

            $('#searchResult').html(strHtml).show().children('li').off(adrsUtils.targetType).on(adrsUtils.targetType, function() {
                var addr = $(this).find('h1').text();
                popup_main.setPopupData(addr);
                popup_main.find('.cancel').triggerHandler('click');
            });

            $('#searchResult').find('li').each(function () {
                var selfText = $(this).html();
                selfText = selfText.replace(self.val(),'<span style="color: #6392FE;">'+self.val()+'</span>');
                $(this).html(selfText);
            })
            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsa) _myIScrollsa.refresh();
        });


        /*关闭地址查询*/
        popup_main.find('.cancel').on('click', function() {
            popup_main.closePopup(function() {
                    if(_myIScrollsa) {
                        _myIScrollsa.destroy();
                        _myIScrollsa = null;
                    }
                });
            });

        /*点击历史记录返回数据*/
        popup_main.find('.wrapper').find('.history .address').on(adrsUtils.targetType, function () {
            var data = $(this).find('.address-name').text();
            popup_main.setPopupData(data);
            popup_main.find('.cancel').triggerHandler('click');
        })

        /*点击当前城市数据*/
        popup_main.find('.wrapper').find('.current span').on(adrsUtils.targetType, function () {
            var data = $(this).text();
            popup_main.setPopupData(data);
            popup_main.find('.cancel').triggerHandler('click');
        });

        /*点击当前城市数据*/
        popup_main.find('.wrapper').find('.recommend span').on(adrsUtils.targetType, function () {
            var data = $(this).text();
            popup_main.setPopupData(data);
            popup_main.find('.cancel').triggerHandler('click');
        });

        popup_main.find('.remove-history').on('click',function () {
            popup_main.find('.history').slideUp(300);
            setTimeout(function () {
                popup_main.find('.history').find('.station-group').html('');
            }, 300);
        })
    },

    // historyCity: function () {
    //     /*点击历史记录返回数据*/
    //     $('#searchWrapper .history ul li').on('click', function () {
    //         var data = $(this).text();
    //         $('#search-address').setPopupData(data);
    //         $('#search-address .cancel').triggerHandler('click');
    //     });
    // },

    /*currentCity: function () {
        /!*点击当前城市数据*!/
        $('#searchWrapper .current-city span').on('click', function () {
            var data = $(this).text();
            $('#search-address').setPopupData(data);
            $('#search-address .cancel').triggerHandler('click');
        });
    },*/
    /**
     * param {
     * el_trigger:
     * el_popup
     * }
     * **/
    openCity:function (param) {
        var _isInitsc = false, _myIScrollsc;
        if(typeof param === 'undefined') return;
        var trigger = param.el_trigger;
        var popup_main = param.el_popup;

        trigger.on('click',function () {
            var _this = $(this);
            popup_main.popup('push', function() {
                if(_isInitsc) return;
                _isInitsc = true;

                setTimeout(function() {
                    popup_main.find('.wrapper').css('height', $(window).height() - 44);
                    var _myIScrollsc = new IScroll('#cityWrapper');

                    adrsUtils.retrieveWord(function (el) {
                        _myIScrollsc.scrollToElement(el.attr('href'));
                    });
                }, 300);
            }, function(data) {
                _this.text(data);
            });
        })

        // 选择城市
        popup_main.find("#cityWrapper").find('.wrapper li').on(adrsUtils.targetType, function() {
            var data = $(this).text();
            popup_main.setPopupData(data);
            popup_main.find('.cancel').triggerHandler('click');
        });

        /*点击当前城市数据*/
        popup_main.find("#cityWrapper").find('.wrapper .current-city span').on(adrsUtils.targetType, function() {
            var data = $(this).text();
            popup_main.setPopupData(data);
            popup_main.find('.cancel').triggerHandler('click');
        });

        // 关闭选择城市
        popup_main.find('.cancel').on('click', function() {
            popup_main.closePopup(function() {
                if(_myIScrollsc) {
                    _myIScrollsc.destroy();
                    _myIScrollsc = null;
                }
            });
            popup_main.find('.search-input input').val('');
            popup_main.find('.wrapper li').each(function () {
                $(this).show();
            })
        });

        /*搜索城市*/
        popup_main.find('.search-input input').on('input', function() {
            var self = $(this).val();
            self = $.trim(self.toLowerCase());
            if (self != '' && self != null){
                popup_main.find('.wrapper li').each(function () {
                    $(this).show();
                    var strHtml = $(this).text();
                    if (strHtml.indexOf(self)<=-1){
                        $(this).hide();
                    }
                })
            }else{
                popup_main.find('.wrapper li').each(function () {
                    $(this).show();
                })
            }
        });

    },

    /* 字母快速检索 */
    retrieveWord: function(callback) {
        var $city = $('.nav-city'),
            $city_li = $city.find('li');
        var city_h = 0;

        $city_li.each(function () {
            city_h += $(this).height();
        });

        $city.css('height', city_h);

        $('.nav-city a').on('click', function (e) {
            e.preventDefault();

            /*弹窗*/
            var text = $(this).text();
            $('.pop-special').text(text).fadeIn().css('opacity','0.6');
            setTimeout(function () {
                $('.pop-special').fadeOut();
            },1200);
            if(callback instanceof Function) {
                callback($(this));
            }
        });
    },

}


