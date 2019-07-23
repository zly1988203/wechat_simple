// 绑定滚动条
var _myIScroll;
var bindScroll = function(el) {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll(el + ' .listWrapper');
    }, 300);
}

$('.listWrapper').each(function () {
    $(this).css('height', ($(window).height() - 74) + 'px');
});

/*
* 乘客 - 操作
* */
function passengerHandle() {
    // 打开选择乘车人列表
    $('#selectPassengerButton').on('click', function() {
        $('#passengerList').popup('modal', function() {
            bindScroll('#passengerList');  //加载滚动条
        });
    });

    //点击内容区，自动选中或取消
    function triggerCheckbox($el) {
        var $input = $el.prev('.name').find('input[type=checkbox]');

        if($input.prop('checked')) {
            $input.prop('checked', false);
        } else {
            $input.prop('checked', true);
        }

        changeSelect($input);
    }

    $('#passengerList .passenger-list li .info').on('click', function () {
        triggerCheckbox($(this));
    });

    /*
    * 更新select状态
    * */
    function changeSelect(el) {
        el.parents('li').data('select', el.prop('checked'));
    }

    //选择乘客 - 更新select状态
    $('.passenger-list input[type=checkbox]').on('change', function () {
        changeSelect($(this));
    });

    //确定选择
    $('#selectButton').on('click', function() {
        var _html = '';

        $('.passenger-list li').each(function () {
            var el = $(this);

            if(el.data('select')) {
                _html += '<div class="item">' +
                    '<div class="handle-minus"></div>' +
                    '<div class="name">' + el.data('name') + '</div>' +
                    '<div class="info">' +
                    '<p><span class="label">手机号</span>' + el.data('phone') + '</p>' +
                    '<p><span class="label">身份证</span>' + el.data('code') + '</p>' +
                    '</div>' +
                    '</div>';
            }
        });

        //更新选中的乘客
        $('#passengerWrapper .content').html('').append(_html);

        $('#passengerList').closePopup();
    });

    /*
    * 添加乘客
    * */
    // 打开添加界面
    $('.addPassengerButton').on('click', function() {
        $('#addPassenger').popup('push', function() {
            $('#name').val('');
            $('#phone').val('');
            $('#code').val('');
        })
    });

    //取消添加
    $('#cancelAddButton').on('click', function () {
        $('#addPassenger').closePopup();
    });

    //提交添加
    $('#submitAddButton').on('click', function() {

        //TODO: 提交添加
        var name = $('#addPassengerName').val();
        var phone = $('#addPassengerPhone').val();
        var code = $('#addPassengerCode').val();

        //创建标签
        var $strLi = $('<li class="sui-border-b" data-select="true" data-name="' + name + '" data-phone="' + phone + '" data-code="' + code + '"></li>'),
            $strName = $('<div class="name"><input type="checkbox" class="frm-checkbox" checked /></div>'),
            $strInfo = $('<div class="info"><h4>' + name + '</h4><p><em>手机号</em>' + phone + '</p><p><em>身份证</em>' + code + '</p></div>'),
            $strHandle = $('<div class="handle"><i class="icon-edit editPassengerButton"></i></div>');

        //合并标签
        $strLi.append($strName).append($strInfo).append($strHandle);

        //添加到父元素里
        $('#passengerList .passenger-list').append($strLi);

        //绑定 - 更新乘客选择
        $strName.find('input[type=checkbox]').on('change', function () {
            changeSelect($(this));
        });

        //绑定 - 编辑乘客
        $strHandle.find('.editPassengerButton').on('click', function () {
            editHandle($(this));
        });

        //绑定 - 点击内容区，自动选中或取消
        $strInfo.on('click', function () {
            triggerCheckbox($(this));
        });

        if(_myIScroll) {
            _myIScroll.refresh();   // 刷新滚动条
        }

        $('#addPassenger').closePopup();
    });

    /*
    * 编辑乘客
    * */
    //编辑操作
    function editHandle(el) {
        var $parent = el.parents('li');
        var _name  = $parent.data('name'),
            _phone = $parent.data('phone'),
            _code  = $parent.data('code');

        $('#editPassenger').popup('push', function() {
            $('#editPassengerName').val(_name);
            $('#editPassengerPhone').val(_phone);
            $('#editPassengerCode').val(_code);

            //设置触发的元素
            $('#editPassenger').data('trigger', $parent.index());
        });
    }

    // 打开编辑界面
    $('.editPassengerButton').on('click', function() {
        editHandle($(this));
    });

    //关闭编辑
    $('#submitEditButton').on('click', function () {
        $('#editPassenger').closePopup(function () {
            var targetZindex = $('#editPassenger').data('trigger'),
                _target = $('.passenger-list li').eq(targetZindex);
            var _editName = $('#editPassengerName').val(),
                _phoneName = $('#editPassengerPhone').val(),
                _codeName = $('#editPassengerCode').val();

            //更新 - 存储数据
            _target.data('name', _editName)
                .data('phone', _phoneName)
                .data('code', _codeName);

            //更新 - 展示数据
            _target.find('.info h4').text(_editName);
            _target.find('.info p:first').html('</h4><p><em>手机号</em>' + _phoneName);
            _target.find('.info p:last').html('</h4><p><em>身份证</em>' + _codeName);
        });
    });

    //乘客人数运算
    $('.operation .icon-minus').on('click', function () {
        //减
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);

            var _v = parseInt(el.next().text());

            if(_v == 5) {
                el.siblings('.icon-plus').removeClass('out');
            }

            if(_v == 1) {
                //TODO
//                    $.alert('人数至少为1');
            } else {
                el.next().text(_v - 1);

                if(el.next().text() == 1) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });

    $('.operation .icon-plus').on('click', function () {
        //加
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);

            var _v = parseInt(el.prev().text());

            if(_v == 1) {
                el.siblings('.icon-minus').removeClass('out');
            }

            if(_v == 5) {
                //TODO
//                    $.alert('人数最多5位');
            } else {
                el.prev().text(_v + 1);

                if(el.prev().text() == 5) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
}

$(function() {
    passengerHandle();

    //取票/退票规则
    $('.ticket-rule').on('tap', function(e) {
        e.stopPropagation();
        $('#ticketRule').popup('modal');
    });

    // 选择支付方式
    $('.payment-way li').off('click').on('click', function() {
        $(this).find('input').prop('checked', true);
    });

    //返回键
    back();

    //填充日历
    $('.datepicker-wrapper').datePicker({
        dateBase: '2017-6-1',
        gather: [
            { date: '2017-6-19', comment: '已发车', state: 'readonly' },
            { date: '2017-6-20', comment: '已售罄', state: 'readonly' },
            { date: '2017-6-21', comment: '¥180.00', state: 'select' },
            { date: '2017-6-22', comment: '¥18', state: 'select', 'badge-right': '/dist/images/common/icon-discounts.png', 'badge-right-active': '/dist/images/common/icon-discounts-active.png' },
            { date: '2017-6-26', comment: '¥18', state: 'select' },
            { date: '2017-6-27', comment: '¥18', state: 'select', 'badge-right': '/dist/images/common/icon-discounts.png', 'badge-right-active': '/dist/images/common/icon-discounts-active.png' },
            { date: '2017-6-28', comment: '¥18', state: 'select' },
            { date: '2017-6-29', state: 'disabled' },
            { date: '2017-6-30', state: 'disabled' },
            { date: '2017-7-4', comment: '¥18', state: 'select' }
        ],
        selectCallback: function (data) {
            $('.pay-handle').find('.day').html(data.selectData.length);
        }
    });
});

function back() {
    if (window.history && window.history.pushState) {
        var href = window.location.href;
        var level = -1;

        history.pushState({page: 1}, 'page', href);

        //点击返回键
        $(window).on('popstate', function() {
            history.go(level);
        });

        //弹窗层，返回0
        $('#selectPassengerButton, .coupon-toggle, .insurance-toggle, .ticket-rule').on('click.back', function () {
            level = 0;
        });

        //关闭弹窗层，返回-1
        $('#selectButton, #closeCoupon, #closeInsurance').on('click.back', function () {
            level = -1;
        });
    }
}

$('.new-btn-bar .detail-btn').off('click').on('click',function () {
    var _this = this;
    if($(_this).data('switch') == 'close'){
        $(_this).data('switch','open');
        $(_this).addClass('detail-open');
        $('#totalAmount').show();
    }else{
        $(_this).data('switch','close');
        $(_this).removeClass('detail-open');
        $('#totalAmount').hide();
    }
});


$('.item-banner').off('click').on('click',function () {
    $('#attIntroduce').popup();
})


$('.btn-buy').off('click').on('click',function () {
    $('#attOrderInfo').popup();
})

$('.btn-edit').off('click').on('click',function () {
    $('#attOrderInfo').popup();
})

$('.item-readme').off('click').on('click',function (e) {
    e.stopPropagation();
    $('#attReadInfo').popup();
})

$('.att-readme').off('click').on('click',function (e) {
    e.stopPropagation();
    $('#attReadInfo').popup();
})

$('.btn-order-canle').off('click').on('click',function () {
    $('#attOrderInfo').closePopup();
})
$('.btn-order-ok').off('click').on('click',function () {
    $('#attOrderInfo').closePopup();
})

$('#btn-date').on('click', function() {
    // $('#attOrderInfo').closePopup();
    $('#selectDate').popup('plate', function () {
        console.log('open')
    }, function (data) {
        console.log(data);
    });
}).backtrack({
    cancel: '#selectDate .sui-popup-mask'
});

