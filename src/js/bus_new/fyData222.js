(function (_) {
    try {
        _.$ = $;
    } catch (e) {
        throw 'js库必须为Zepto或jQuery';
    }

    var DEFAULT = {}
    var DatePicker = function (element, opt) {
        /*
         * 返回数据
         *
         * 	base：初始日期（year：年，month：月，day：日，week：星期）
         * 	selectData：选中的数据，数组
         *
         * */
        DatePicker.data = {
            base: {
                year: '',
                month: '',
                day: '',
                week: ''
            },
            selectData: []
        };

        //元素
        if(element) {
            DatePicker.el = $(element);
        } else {
            DatePicker.el = $(this);
        }

        //继承
        if(typeof opt === 'object') {
            //备注
            if(opt.gather) {
                if(typeof opt.gather == 'object' && !(opt.gather instanceof Array)) {
                    opt.gather = [opt.gather];
                }
            }

            $.extend(DEFAULT, opt);
        }

        DatePicker.init.call(this);
    };


    var Plugin = function (options) {
        var _arg = arguments;

        return this.each(function () {
            //参数判断




            if(typeof options === 'object' || !options) {
                return new DatePicker(this, options);
            }
        });
    }

    $.fn.datePicker = Plugin;
    $.fn.datePicker.constructor = DatePicker;
})(window);