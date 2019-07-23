;(function() {
    "use strict";
    
    var zeroize = function(number) {
        return number > 9 ? number : '0' + number;
    }
    
    var updateSelected = function(event, className) {
        var index = Math.round(-event.y / 36 + 2);
        var current = $(className).find('li').eq(index);
        current.addClass('selected').siblings().removeClass('selected');
    }
    
    // 绑定touch事件
    var _dateScroll = {}, _isEnd = true;
    var bindTouch = function(className, el, onChange) {
        if(el.length <= 0) {
            el = $(className).find('li:eq(2)');
        }
        var name = className.replace(/^\.picker\-/, '');
        
        var dateScroll = new IScroll(className, {
            vScrollbar:false,
            momentum: true,
            bounce: true,
            probeType: 3,
        });
        _dateScroll[name] = dateScroll;
        
        dateScroll.on('scrollStart', function() {
            _isEnd = false;
        },{ passive: false });
        
        dateScroll.on('scroll', function(){
            // var className = this.wrapper.classList[1];
            updateSelected(this, className);
            if(className === '.picker-day'){
                $('.picker-hour ul').animate({
                    translate: '0, 0px'
                }, 'fast', 'linear');
            }
        });

        var self = {
            'day': $(className).parents('.picker-container').find('.picker-day'),
            'hour': $(className).parents('.picker-container').find('.picker-hour'),
            'minute': $(className).parents('.picker-container').find('.picker-minute')
        };
        
        dateScroll.on('scrollEnd', function(){
            setTimeout(function () {
                    updateSelected(this, className);
                    var index = Math.round(-this.y / 36 + 2);
                    index -= 2;
                    $(className + ' ul').animate({
                        translate: '0, -' + (index * 36) + 'px'
                    }, 'fast', 'linear');
                    if(className === '.picker-day'){
                        $('.picker-hour ul').animate({
                            translate: '0, 0px'
                        }, 'fast', 'linear');
                    }
                    if($.isFunction(onChange)) {
                        var values = {
                            day: $('.picker-day li.selected').data('value'),
                            hour: $('.picker-hour li.selected').data('value'),
                            minute: $('.picker-minute li.selected').data('value')
                        };
                        onChange(values, name, self, _dateScroll);
                    }
                    _isEnd = true;
            }, 500)

        });
        
        // 初始化
        el.addClass('selected').siblings().removeClass('selected');
        dateScroll.scrollToElement(el.prev().prev()[0], 0);
        if($.isFunction(onChange)) {
            var values = {
                day: $('.picker-day li.selected').data('value'),
                hour: $('.picker-hour li.selected').data('value'),
                minute: $('.picker-minute li.selected').data('value')
            };
            onChange(values, name, self, _dateScroll);
        }
        return dateScroll;
    }
    
    $.timePicker = function(params, callback) {
        if(typeof params == 'function') {
            callback = arguments[0];
            params = undefined
        }
        
        var _day = [];
        var d = new Date();
        $.each(['今天', '明天', '后天'], function(k, v) {
            _day.push({text:v, value: d.getFullYear() + '-' + zeroize(d.getMonth() + 1) + '-' + zeroize(d.getDate())});
            d.setDate(d.getDate() + 1);
        });
        
        // 小时
        var _hour = [];
        for(var i = 0; i <= 23; i++) {
            _hour.push({
                text: (i <= 9 ? '0' + i : i) + '点',
                value: i
            });
        }
        
        // 分钟
        var _minute = [];
        for(var i = 0; i <= 50; i += 10) {
            _minute.push({
                text: (i <= 9 ? '0' + i : i) + '分',
                value: i
            });
        }

        // 默认值
        var params = $.extend({
            title: '请选择时间',
            day: _day,   // 天
            hour: _hour,
            minute: _minute,
            data: {day:'今天', hour:8, minute:30}, // 数据回显
            onChange: null
        }, params);

        var strHtml = '<div id="timer-picker-popup" class="sui-popup-container">' +
                '<div class="sui-popup-mask"></div>' +
                '<div class="sui-popup-modal">' +
                    '<div class="toolbar-inner">' +
                        '<button class="sui-cancel" type="button">取消</button>' +
                        '<span>{{=it.title}}</span>' +
                        '<button class="sui-ok" type="button">确定</button>' +
                    '</div>' +
                    '<ul class="picker-container">' +
                        '<li class="picker-col-wrapper"><div class="picker-control picker-day"><ul>' +
                        '<li></li><li></li>' +
                        '{{~it.day:d}}' +
                        '<li data-value="{{=d.value}}">{{=d.text}}</li>'+
                        '{{~}}' +
                        '<li></li><li></li>' +
                        '</ul></div></li>' +
                        '<li class="picker-col-wrapper"><div class="picker-control picker-hour"><ul>' +
                        '<li></li><li></li>' +
                        '{{~it.hour:d}}' +
                        '<li data-value="{{=d.value}}">{{=d.text}}</li>'+
                        '{{~}}' +
                        '<li></li><li></li>' +
                        '</ul></div></li>' +
                        '<li class="picker-col-wrapper"><div class="picker-control picker-minute"><ul>' +
                        '<li></li><li></li>' +
                        '{{~it.minute:d}}' +
                        '<li data-value="{{=d.value}}">{{=d.text}}</li>'+
                        '{{~}}' +
                        '<li></li><li></li>' +
                        '</ul></div></li>' +
                    '</ul>' +
                    '<div class="picker-center-highlight sui-border-tb"></div>' +
                '</div>' +
            '</div>';

        var template = $(doT.template(strHtml)(params));
        var panel = template.appendTo(document.body);
        $('#timer-picker-popup').popup('plate');

        var data = params.data;
        var dayScroll = bindTouch('.picker-day', $('.picker-day li[data-value="' + data.day + '"]'), params.onChange);
        var hourScroll = bindTouch('.picker-hour', $('.picker-hour li[data-value="' + data.hour + '"]'), params.onChange);
        var minuteScroll = bindTouch('.picker-minute', $('.picker-minute li[data-value="' + data.minute + '"]'), params.onChange);
        
         // 取消
        panel.find('.sui-mask,.sui-cancel').on('click', function() {
            $('#timer-picker-popup').closePopup(function() {
                dayScroll.destroy();
                hourScroll.destroy();
                minuteScroll.destroy();
                dayScroll = null;
                hourScroll = null;
                minuteScroll = null;
                $('#timer-picker-popup').remove();
            });
        });
        
        // 确定
        panel.find('.sui-ok').on('click', function() {
            if(!_isEnd) return;
            var values = {
                day: $('.picker-day li.selected').data('value'),
                hour: $('.picker-hour li.selected').data('value'),
                minute: $('.picker-minute li.selected').data('value')
            };
            
            var texts = {
                day: $('.picker-day li.selected').text(),
                hour: $('.picker-hour li.selected').text(),
                minute: $('.picker-minute li.selected').text()
            };

            $('#timer-picker-popup').closePopup(function() {
                if($.isFunction(callback)) callback(values, texts);
                dayScroll.destroy();
                hourScroll.destroy();
                minuteScroll.destroy();
                dayScroll = null;
                hourScroll = null;
                minuteScroll = null;
                $('#timer-picker-popup').remove();
            });
        });
        
        
    }
    
})(Zepto);