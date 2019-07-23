//animate
(function (window, $) {
    /*
     * param
     *
     *   文字：              text
     *   方向：              direction：top（向上），bottom（向下）
     *   背景颜色：           backgroundColor
     *   背景颜色的间隔：      backgroundColorTimeout
     *   飞行物：             flights
     *   飞行物尺寸：         flightSize
     *   飞行物速度：         flightSpeed
     *
     * */
    var DEFAULT = {
        text: '暂无文字',
        direction: 'top',
        backgroundColor: ['#B4DDFF', '#E3D5F7', '#FFCECE', '#FFD799', '#FFF59B', '#BEFFB1', '#B8FFE9'],
        backgroundColorTimeout: 2,
        flights: [],
        flightSize: 43,
        flightSpeed: 2
    };
    var FlightChart = function(options) {
        var el  = this,
            $el = $(this);

        //参数
        el.opt = $.extend({}, DEFAULT, options);
        var elOpt = el.opt;

        //填充文字
        $el.html('<span class="fly-txt">' + elOpt.text + '</span>');

        //填充颜色
        var bgc = elOpt.backgroundColor;
        var bgTimeout = elOpt.backgroundColorTimeout;
        if(bgc instanceof Array) {
            var bgcCoount = floorInt(bgc.length);
            randomColor();

            //间隔
            setInterval(function () {
                randomColor();
            }, bgTimeout * 1000);
        }

        //随机颜色
        function randomColor() {
            $el.css({
                'background-color':     bgc[bgcCoount],
                'transition':           'background-color ' + bgTimeout + 's'
            });
            bgcCoount = floorInt(bgc.length);
        }

        //随机整数
        function floorInt(num) {
            return Math.floor(Math.random() * num);
        }

        //飞行物
        var fl = elOpt.flights;
        if(fl instanceof Array) {
            //飞行物数量
            var flCount = 6;

            fl = shuffle(fl);

            //选取前5个
            fl.length = flCount;

            //插入图片
            /*
             * 样式
             *
             *   parentW：        父级宽度
             *   childW：         飞行物尺寸
             *   marginW：        飞行物间距
             *   emW:             飞行物留白
             *
             * */
            var emW      = 5;
            var parentW  = parseFloat($el.outerWidth()) - emW,
                childW   = elOpt.flightSize;
            var marginW  = (parentW - (childW * fl.length)) / fl.length;

            //随机生成飞行物数量相等的延迟数
            //delayArr: 飞行物延迟数组
            var delayArr = [];
            function createDelay() {
                delayArr = [];
                for(var i = 0; i < flCount; i++) {
                    delayArr.push(flightDelay());
                }

                //判断至少有两个连续的时间
                var delayHandle = false;
                for(var n = 0; n < delayArr.length; n++) {
                    for(var m = 0; m < delayArr.length - 1; m++) {
                        if((delayArr[n] + elOpt.flightSpeed - 0.3) > delayArr[m]) {
                            delayHandle = true;
                        }
                    }
                }

                //true则返回数组
                if(delayHandle) {
                    return delayArr;
                } else {
                    createDelay();
                }
            }
            var caDelay = createDelay();

            //随机延期
            fl.forEach(csRoundDelay);
            function csRoundDelay(item, index) {
                var $ca = $('<span class="ca-icon"></span>');

                /*
                 * 样式
                 *
                 *   caUrl：        飞行物图片地址
                 *   caLeft：       飞行物定位：left
                 *   caDelay：      飞行物延期
                 *
                 * */
                writeFlight($ca, {
                    caUrl   : 'url(' + item + ')',
                    caLeft  : emW + index * childW + marginW * index,
                    // caDelay : caDelay[index]
                    caSpeed : caDelay[index]
                });
            }


            //写入飞行物
            function writeFlight(ca, data) {
                ca.css({
                    'background-image': data.caUrl,
                    'left': data.caLeft + 'px',
                    'animation-duration': data.caSpeed + 's'
                });

                $el.append(ca);
            }

            //随机延时
            function flightDelay() {
                return Math.random() * elOpt.flightSpeed + 1;
            }

            //飞行方向
            //向上飞行
            if(elOpt.direction == 'top') {
                $('.ca-icon').css({
                    'top':  (100 + Math.random() * 10) + '%'
                }).addClass('flightTop');
            }

            //向下飞行
            if(elOpt.direction == 'bottom') {
                $('.ca-icon').css({
                    'bottom':  (100 + Math.random() * 10) + '%'
                }).addClass('flightBottom');
            }
        }

        //打乱顺序
        function shuffle(arr) {
            var i,
                j,
                temp;

            for (i = arr.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }

            return arr;
        }
    };

    $.fn.flightChart = function (option) {
        FlightChart.call(this, option);
    }
})(window, Zepto);