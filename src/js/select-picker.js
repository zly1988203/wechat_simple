;(function($) {
    window.PointerEvent = undefined
    var updateSelected = function(event, className) {
        var index = Math.round(-event.y / 36 + 2);
        var current = $(className).find('li').eq(index);
        current.addClass('selected').siblings().removeClass('selected');         
    }
    
    $.selectPicker = function(params) {
        
        var params = $.extend({
            current: '',
            title: '请选择',
            data:[''],
            onChange: function() {}
        }, params);
        
        var data = params.data;
        var _defaults = $.trim(params.current).length <= 0 ? (typeof(data[0]) == 'object' ? data[0].value : data[0]) : $.trim(params.current);

        var strHtml = '<div id="select-picker-popup" class="sui-popup-container">' +
            '<div class="sui-popup-mask"></div>' +
            '<div class="sui-popup-modal">' +
                '<div class="toolbar-inner">' +
                    '<button class="sui-cancel" type="button">取消</button>' +
                    '<span>{{=it.title}}</span>' +
                    '<button class="sui-ok" type="button">确定</button>' +
                '</div>' +
                '<ul class="picker-container">' +
                    '<li class="picker-col-wrapper"><div class="picker-control picker-select"><ul>' +
                    '<li></li><li></li>' +
                    '{{~it.data:d}}' +
                    '{{?typeof(d)!="object"}}' +
                    '<li data-value="{{=d}}">{{=d}}</li>' +
                    '{{??}}' +
                    '<li data-value="{{=d.value}}">{{=d.text}}</li>' +
                    '{{?}}' +
                    '{{~}}' +
                    '<li></li><li></li>' +
                    '</ul></div></li>' +
                '</ul>' +
                '<div class="picker-center-highlight sui-border-tb"></div>' +
            '</div>' +
        '</div>';

        var template = $(doT.template(strHtml)(params));
        var panel = template.appendTo(document.body);
        $('#select-picker-popup').popup('plate');

        //绑定Touch
        var _isEnd = true;
        var myscroll = new IScroll('.picker-select', {
            vScrollbar:false,
            momentum: true,
            bounce: true,
            probeType: 3
        });

        //开始滚动
         myscroll.on('scrollStart', function() {
            _isEnd = false;
        });

        //滚动中
        myscroll.on('scroll', function(){
            updateSelected(this, '.picker-select');
        });

        //滚动结束
        myscroll.on('scrollEnd', function(){
            updateSelected(this, '.picker-select');
            var index = Math.round(-this.y / 36 + 2);
            index -= 2;
            $('.picker-select ul').animate({
                translate: '0, -' + (index * 36) + 'px'
            }, 'fast', 'linear');
            _isEnd = true;
        });

        //设置默认值
        var el = $('.picker-select li[data-value="' + _defaults + '"]');
        el.addClass('selected').siblings().removeClass('selected');
        myscroll.scrollToElement(el.prev().prev()[0], 0);

        // 取消
        panel.find('.sui-mask,.sui-cancel').on('click', function() {
            $('#select-picker-popup').closePopup(function() {
                myscroll.destroy();
                myscroll = null;
                $('#select-picker-popup').remove();
            });
        });


        // 确定
        panel.find('.sui-ok').on('click', function() {
            if(!_isEnd) return;
            var ele = $('.picker-select li.selected');
            var text = ele.text();
            var val = ele.data('value');
            $('#select-picker-popup').closePopup(function() {
                params.onChange(val, text);
                myscroll.destroy();
                myscroll = null;
                $('#select-picker-popup').remove();
            });
        });

    }
})(Zepto)