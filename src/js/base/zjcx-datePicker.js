;(function (_) {
    /*
    * 检测js库
    *
    *   库只能是Zepto或jQuery，建议使用Zepto
    *
    * */
    try {
        _.$ = $;
    } catch (e) {
        throw 'js库须为Zepto或jQuery';
    }

    /*
    * 默认参数
    * dateBase: 生成某月的数据 格式:yyyy-mm-dd 默认为系统时间的当月
    * gather：数据集合
    *   格式：[{date: '2017-6-20', comment: '备注', state: 'select', badge-left: 'url', badge-left-active: 'url', badge-right: 'url', badge-right-active: 'url'}...]
    *    param：
    *       date:日期
    *       comment: 备注信息(有票，价格等)
    *       status: 状态，可选（select）、只读（readonly）、禁用（disable）、已选（active），默认可选
    *       tag: 休/班 标记
    *       label：节假日名称，农历等
    *       badge：角标 特价标记等
    * after:生成几个月的数据 默认生成n个月的数据 （数据太少的情况下 swiper滚动条定位不准确）
    * multiple: 是否支持多选 默认支持
    * selectCallback: 选中后的回调函数
    * before: 今天之前的日期是否显示 默认不显示 true-显示 false-不显示
    * switchMonth：月份切换
    *
    * */
    var DEFAULT = {
        dateBase: '2019-6-4',
        currentDateBase:'',
        after: 2,//生成几个月的数据
        gather: [],//特殊标记的日历
        multiple: true,//是否可多选
        before: false,
        selectCallback: null,
        switchMonth: null,
    };



///////////////////////////////////////////////// 公历~农历转换器 ///////////////////////////////////////////////
    /**
     * @1900-2100区间内的公历、农历互转
     * @charset UTF-8
     * @Author  Jea杨(JJonline@JJonline.Cn)
     * @Time    2014-7-21
     * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
     * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
     * @Version 1.0.2
     * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
     * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
     */
    var calendar = {

        /**
         * 农历1900-2100的润大小信息表
         * @Array Of Property
         * @return Hex
         */
        lunarInfo:[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
            0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
            0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
            0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
            0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
            0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
            0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
            0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
            0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
            0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
            0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
            0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
            0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
            0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
            0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
            /**Add By JJonline@JJonline.Cn**/
            0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50, 0x06b20,0x1a6c4,0x0aae0,//2050-2059
            0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
            0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
            0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
            0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
            0x0d520],//2100

        /**
         * 公历每个月份的天数普通表
         * @Array Of Property
         * @return Number
         */
        solarMonth:[31,28,31,30,31,30,31,31,30,31,30,31],

        /**
         * 天干地支之天干速查表
         * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
         * @return Cn string
         */
        Gan:["\u7532","\u4e59","\u4e19","\u4e01","\u620a","\u5df1","\u5e9a","\u8f9b","\u58ec","\u7678"],

        /**
         * 天干地支之地支速查表
         * @Array Of Property
         * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
         * @return Cn string
         */
        Zhi:["\u5b50","\u4e11","\u5bc5","\u536f","\u8fb0","\u5df3","\u5348","\u672a","\u7533","\u9149","\u620c","\u4ea5"],

        /**
         * 天干地支之地支速查表<=>生肖
         * @Array Of Property
         * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
         * @return Cn string
         */
        Animals:["\u9f20","\u725b","\u864e","\u5154","\u9f99","\u86c7","\u9a6c","\u7f8a","\u7334","\u9e21","\u72d7","\u732a"],

        /**
         * 24节气速查表
         * @Array Of Property
         * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
         * @return Cn string
         */
        solarTerm:["\u5c0f\u5bd2","\u5927\u5bd2","\u7acb\u6625","\u96e8\u6c34","\u60ca\u86f0","\u6625\u5206","\u6e05\u660e","\u8c37\u96e8","\u7acb\u590f","\u5c0f\u6ee1","\u8292\u79cd","\u590f\u81f3","\u5c0f\u6691","\u5927\u6691","\u7acb\u79cb","\u5904\u6691","\u767d\u9732","\u79cb\u5206","\u5bd2\u9732","\u971c\u964d","\u7acb\u51ac","\u5c0f\u96ea","\u5927\u96ea","\u51ac\u81f3"],

        /**
         * 1900-2100各年的24节气日期速查表
         * @Array Of Property
         * @return 0x string For splice
         */
        sTermInfo:['9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f',
            '97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f',
            'b027097bd097c36b0b6fc9274c91aa','9778397bd19801ec9210c965cc920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd197c36c9210c9274c91aa',
            '97b6b97bd19801ec95f8c965cc920e','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bcf97c3598082c95f8e1cfcc920f',
            '97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f',
            '97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd07f595b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9210c8dc2','9778397bd19801ec9210c9274c920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bd07f1487f595b0b0bc920fb0722',
            '7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b97bd197c36c9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36b0b70c9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','977837f0e37f149b0723b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c35b0b6fc9210c8dc2',
            '977837f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '977837f0e37f14998082b0723b06bd','7f07e7f0e37f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f595b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35',
            '7ec967f0e37f14998082b0723b06bd','7f07e7f0e37f14998083b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14898082b0723b02d5','7f07e7f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66aa89801e9808297c35','665f67f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66a449801e9808297c35',
            '665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e26665b66a449801e9808297c35','665f67f0e37f1489801eb072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722'],

        /**
         * 数字转中文速查表
         * @Array Of Property
         * @trans ['日','一','二','三','四','五','六','七','八','九','十']
         * @return Cn string
         */
        nStr1:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341"],

        /**
         * 日期转农历称呼速查表
         * @Array Of Property
         * @trans ['初','十','廿','卅']
         * @return Cn string
         */
        nStr2:["\u521d","\u5341","\u5eff","\u5345"],

        /**
         * 月份转农历称呼速查表
         * @Array Of Property
         * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
         * @return Cn string
         */
        nStr3:["\u6b63","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341","\u51ac","\u814a"],

        /**
         * 返回农历y年一整年的总天数
         * @param lunar Year
         * @return Number
         * @eg:var count = calendar.lYearDays(1987) ;//count=387
         */
        lYearDays:function(y) {
            var i, sum = 348;
            for(i=0x8000; i>0x8; i>>=1) { sum += (calendar.lunarInfo[y-1900] & i)? 1: 0; }
            return(sum+calendar.leapDays(y));
        },

        /**
         * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
         * @param lunar Year
         * @return Number (0-12)
         * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
         */
        leapMonth:function(y) { //闰字编码 \u95f0
            return(calendar.lunarInfo[y-1900] & 0xf);
        },

        /**
         * 返回农历y年闰月的天数 若该年没有闰月则返回0
         * @param lunar Year
         * @return Number (0、29、30)
         * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
         */
        leapDays:function(y) {
            if(calendar.leapMonth(y))  {
                return((calendar.lunarInfo[y-1900] & 0x10000)? 30: 29);
            }
            return(0);
        },

        /**
         * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
         * @param lunar Year
         * @return Number (-1、29、30)
         * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
         */
        monthDays:function(y,m) {
            if(m>12 || m<1) {return -1}//月份参数从1至12，参数错误返回-1
            return( (calendar.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
        },

        /**
         * 返回公历(!)y年m月的天数
         * @param solar Year
         * @return Number (-1、28、29、30、31)
         * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
         */
        solarDays:function(y,m) {
            if(m>12 || m<1) {return -1} //若参数错误 返回-1
            var ms = m-1;
            if(ms==1) { //2月份的闰平规律测算后确认返回28或29
                return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
            }else {
                return(calendar.solarMonth[ms]);
            }
        },

        /**
         * 农历年份转换为干支纪年
         * @param  lYear 农历年的年份数
         * @return Cn string
         */
        toGanZhiYear:function(lYear) {
            var ganKey = (lYear - 3) % 10;
            var zhiKey = (lYear - 3) % 12;
            if(ganKey == 0) ganKey = 10;//如果余数为0则为最后一个天干
            if(zhiKey == 0) zhiKey = 12;//如果余数为0则为最后一个地支
            return calendar.Gan[ganKey-1] + calendar.Zhi[zhiKey-1];

        },

        /**
         * 公历月、日判断所属星座
         * @param  cMonth [description]
         * @param  cDay [description]
         * @return Cn string
         */
        toAstro:function(cMonth,cDay) {
            var s   = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
            var arr = [20,19,21,21,21,22,23,23,23,23,22,22];
            return s.substr(cMonth*2 - (cDay < arr[cMonth-1] ? 2 : 0),2) + "\u5ea7";//座
        },

        /**
         * 传入offset偏移量返回干支
         * @param offset 相对甲子的偏移量
         * @return Cn string
         */
        toGanZhi:function(offset) {
            return calendar.Gan[offset%10] + calendar.Zhi[offset%12];
        },

        /**
         * 传入公历(!)y年获得该年第n个节气的公历日期
         * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
         * @return day Number
         * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
         */
        getTerm:function(y,n) {
            if(y<1900 || y>2100) {return -1;}
            if(n<1 || n>24) {return -1;}
            var _table = calendar.sTermInfo[y-1900];
            var _info = [
                parseInt('0x'+_table.substr(0,5)).toString() ,
                parseInt('0x'+_table.substr(5,5)).toString(),
                parseInt('0x'+_table.substr(10,5)).toString(),
                parseInt('0x'+_table.substr(15,5)).toString(),
                parseInt('0x'+_table.substr(20,5)).toString(),
                parseInt('0x'+_table.substr(25,5)).toString()
            ];
            var _calday = [
                _info[0].substr(0,1),
                _info[0].substr(1,2),
                _info[0].substr(3,1),
                _info[0].substr(4,2),

                _info[1].substr(0,1),
                _info[1].substr(1,2),
                _info[1].substr(3,1),
                _info[1].substr(4,2),

                _info[2].substr(0,1),
                _info[2].substr(1,2),
                _info[2].substr(3,1),
                _info[2].substr(4,2),

                _info[3].substr(0,1),
                _info[3].substr(1,2),
                _info[3].substr(3,1),
                _info[3].substr(4,2),

                _info[4].substr(0,1),
                _info[4].substr(1,2),
                _info[4].substr(3,1),
                _info[4].substr(4,2),

                _info[5].substr(0,1),
                _info[5].substr(1,2),
                _info[5].substr(3,1),
                _info[5].substr(4,2),
            ];
            return parseInt(_calday[n-1]);
        },

        /**
         * 传入农历数字月份返回汉语通俗表示法
         * @param lunar month
         * @return Cn string
         * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
         */
        toChinaMonth:function(m) { // 月 => \u6708
            if(m>12 || m<1) {return -1} //若参数错误 返回-1
            var s = calendar.nStr3[m-1];
            s+= "\u6708";//加上月字
            return s;
        },

        /**
         * 传入农历日期数字返回汉字表示法
         * @param lunar day
         * @return Cn string
         * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
         */
        toChinaDay:function(d){ //日 => \u65e5
            var s;
            switch (d) {
                case 10:
                    s = '\u521d\u5341'; break;
                case 20:
                    s = '\u4e8c\u5341'; break;
                    break;
                case 30:
                    s = '\u4e09\u5341'; break;
                    break;
                default :
                    s = calendar.nStr2[Math.floor(d/10)];
                    s += calendar.nStr1[d%10];
            }
            return(s);
        },

        /**
         * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
         * @param y year
         * @return Cn string
         * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
         */
        getAnimal: function(y) {
            return calendar.Animals[(y - 4) % 12]
        },

        /**
         * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
         * @param y  solar year
         * @param m  solar month
         * @param d  solar day
         * @return JSON object
         * @eg:console.log(calendar.solar2lunar(1987,11,01));
         */
        solar2lunar:function (y,m,d) { //参数区间1900.1.31~2100.12.31
            if(y<1900 || y>2100) {return -1;}//年份限定、上限
            if(y==1900&&m==1&&d<31) {return -1;}//下限
            if(!y) { //未传参  获得当天
                var objDate = new Date();
            }else {
                var objDate = new Date(y,parseInt(m)-1,d)
            }
            var i, leap=0, temp=0;
            //修正ymd参数
            var y = objDate.getFullYear(),m = objDate.getMonth()+1,d = objDate.getDate();
            var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
            for(i=1900; i<2101 && offset>0; i++) { temp=calendar.lYearDays(i); offset-=temp; }
            if(offset<0) { offset+=temp; i--; }

            //是否今天
            var isTodayObj = new Date(),isToday=false;
            if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
                isToday = true;
            }
            //星期几
            var nWeek = objDate.getDay(),cWeek = calendar.nStr1[nWeek];
            if(nWeek==0) {nWeek =7;}//数字表示周几顺应天朝周一开始的惯例
            //农历年
            var year = i;

            var leap = calendar.leapMonth(i); //闰哪个月
            var isLeap = false;

            //效验闰月
            for(i=1; i<13 && offset>0; i++) {
                //闰月
                if(leap>0 && i==(leap+1) && isLeap==false){
                    --i;
                    isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
                }
                else{
                    temp = calendar.monthDays(year, i);//计算农历普通月天数
                }
                //解除闰月
                if(isLeap==true && i==(leap+1)) { isLeap = false; }
                offset -= temp;
            }

            if(offset==0 && leap>0 && i==leap+1)
                if(isLeap){
                    isLeap = false;
                }else{
                    isLeap = true; --i;
                }
            if(offset<0){ offset += temp; --i; }
            //农历月
            var month   = i;
            //农历日
            var day     = offset + 1;

            //天干地支处理
            var sm      =   m-1;
            var gzY     =   calendar.toGanZhiYear(year);

            //月柱 1900年1月小寒以前为 丙子月(60进制12)
            var firstNode   = calendar.getTerm(year,(m*2-1));//返回当月「节」为几日开始
            var secondNode  = calendar.getTerm(year,(m*2));//返回当月「节」为几日开始

            //依据12节气修正干支月
            var gzM     =   calendar.toGanZhi((y-1900)*12+m+11);
            if(d>=firstNode) {
                gzM     =   calendar.toGanZhi((y-1900)*12+m+12);
            }

            //传入的日期的节气与否
            var isTerm = false;
            var Term   = null;
            if(firstNode==d) {
                isTerm  = true;
                Term    = calendar.solarTerm[m*2-2];
            }
            if(secondNode==d) {
                isTerm  = true;
                Term    = calendar.solarTerm[m*2-1];
            }
            //日柱 当月一日与 1900/1/1 相差天数
            var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
            var gzD = calendar.toGanZhi(dayCyclical+d-1);
            //该日期所属的星座
            var astro = calendar.toAstro(m,d);

            return {'lYear':year,'lMonth':month,'lDay':day,'Animal':calendar.getAnimal(year),'IMonthCn':(isLeap?"\u95f0":'')+calendar.toChinaMonth(month),'IDayCn':calendar.toChinaDay(day),'cYear':y,'cMonth':m,'cDay':d,'gzYear':gzY,'gzMonth':gzM,'gzDay':gzD,'isToday':isToday,'isLeap':isLeap,'nWeek':nWeek,'ncWeek':"\u661f\u671f"+cWeek,'isTerm':isTerm,'Term':Term,'astro':astro};
        },

        /**
         * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
         * @param y  lunar year
         * @param m  lunar month
         * @param d  lunar day
         * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
         * @return JSON object
         * @eg:console.log(calendar.lunar2solar(1987,9,10));
         */
        lunar2solar:function(y,m,d,isLeapMonth) {   //参数区间1900.1.31~2100.12.1
            var isLeapMonth = !!isLeapMonth;
            var leapOffset  = 0;
            var leapMonth   = calendar.leapMonth(y);
            var leapDay     = calendar.leapDays(y);
            if(isLeapMonth&&(leapMonth!=m)) {return -1;}//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
            if(y==2100&&m==12&&d>1 || y==1900&&m==1&&d<31) {return -1;}//超出了最大极限值
            var day  = calendar.monthDays(y,m);
            var _day = day;
            //bugFix 2016-9-25
            //if month is leap, _day use leapDays method
            if(isLeapMonth) {
                _day = calendar.leapDays(y,m);
            }
            if(y < 1900 || y > 2100 || d > _day) {return -1;}//参数合法性效验

            //计算农历的时间差
            var offset = 0;
            for(var i=1900;i<y;i++) {
                offset+=calendar.lYearDays(i);
            }
            var leap = 0,isAdd= false;
            for(var i=1;i<m;i++) {
                leap = calendar.leapMonth(y);
                if(!isAdd) {//处理闰月
                    if(leap<=i && leap>0) {
                        offset+=calendar.leapDays(y);isAdd = true;
                    }
                }
                offset+=calendar.monthDays(y,i);
            }
            //转换闰月农历 需补充该年闰月的前一个月的时差
            if(isLeapMonth) {offset+=day;}
            //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
            var stmap   =   Date.UTC(1900,1,30,0,0,0);
            var calObj  =   new Date((offset+d-31)*86400000+stmap);
            var cY      =   calObj.getUTCFullYear();
            var cM      =   calObj.getUTCMonth()+1;
            var cD      =   calObj.getUTCDate();

            return calendar.solar2lunar(cY,cM,cD);
        }
    };
///////////////////////////////////////////////// 公历~农历转换器 ///////////////////////////////////////////////

    var DatePicker = function (element, opt) {
        /*
         * 返回数据
         *
         * 	base：初始日期（year：年，month：月，day：日，week：星期）
         * 	selectData：选中的数据，数组
         *
         * */
        DatePicker.data = {
            base: [],
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
            // //备注
            if(opt.gather) {
                if(typeof opt.gather == 'object' && !(opt.gather instanceof Array)) {
                    opt.gather = [opt.gather];
                }
            }

            $.extend(DEFAULT, opt);
        }

        //当前月份
        DEFAULT.currentDateBase = DEFAULT.dateBase;

        DatePicker.init.call(this);
    };

    var $self = null;
    var swiper = null;
    var gatherKeys = [];//备注keylist

    //初始化
    DatePicker.init = function () {
        $self = this;

        drawWeeks();
        for(var i=0;i< DEFAULT.after;i++){
            $self.drawMonth(DEFAULT.currentDateBase);
            //月份+1
            DEFAULT.currentDateBase = getCountMonthEarlier(DEFAULT.currentDateBase,1);
        }
        initSwiper();
    }

    var initSwiper = function() {
        swiper = new Swiper('.swiper-container',{
            speed: 300,
            slidesPerView: 'auto',
            freeMode: true,
            direction: 'vertical',
            setWrapperSize: true,
            autoHeight: true,
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            on:{
                //下拉释放刷新
//            touchEnd: function(){
//                swiper=this
//                refreshText=swiper.$el.find('.refresh')
//                if(this.translate>100){
//                    swiper.setTransition(this.params.speed);
//                    swiper.setTranslate(100);
//                    swiper.touchEventsData.isTouched=false;//跳过touchEnd事件后面的跳转(4.0.5)
//                    refreshText.html('刷新中')
//
//                    swiper.allowTouchMove=false;
//                    setTimeout(function(){//模仿AJAX
//                        swiper.removeAllSlides();
//                        for(i=0;i<20;i++){
//                            swiper.appendSlide('<div class="swiper-slide">New Slide'+(i+1)+'</div>');
//                            refreshText.html('刷新完成');
//                            refreshEnd=true;
//                            swiper.allowTouchMove=true;
//                        }
//                    },1000)
//                }
//            },
//            touchStart: function(){
//                if(refreshEnd==true){
//                    this.$el.find('.refresh').html('释放刷新');
//                    refreshEnd=false;
//                }
//            },

                //加载更多
                momentumBounce: function(){//非正式反弹回调函数，上拉释放加载更多可参考上例
                    swiper = this;
                    if(swiper.translate<-100){//swiper位移
                        swiper.allowTouchMove=false;//禁止触摸
                        swiper.params.virtualTranslate=true;//定住不给回弹
                        if (DEFAULT.switchMonth!=null) {
                            DEFAULT.switchMonth(DEFAULT.currentDateBase, $self, function () {
                                swiper.params.virtualTranslate=false;
                                swiper.allowTouchMove= true;
                            });
                        }
                    }
                },
            }
        });
    }

    // 日期历转换为对象 支持Date对象，yyyy-mm-dd格式的日期
    var changeDateToObj = function (date) {
        var dateObj = {
            year: 0,
            month: 0,
            day: 0,
        };
        if(typeof date == 'string' ){
            var newDate = date.split('-')
            dateObj.year = parseInt(newDate[0]);
            dateObj.month = parseInt(newDate[1]);
            dateObj.day = parseInt(newDate[2]);
        }else if(typeof date == 'object' && date instanceof Date){
            dateObj.year = date.getFullYear();
            dateObj.month = dateObj.getMonth() + 1;
            dateObj.day = dateObj.getDate();
        }

        if(dateObj.month < 10){
            dateObj.month = '0' + dateObj.month;
        }
        if(dateObj.day < 10){
            dateObj.day = '0' + dateObj.day;
        }
        return dateObj;
    };

    // date对象转换为string， format:格式,默认为yyyy-mm-dd
    var formatDateToString = function (date, format) {
        if(!format){
            format = 'yyyy-mm-dd';
        }

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if(month < 10){
            month = '0' + month;
        }
        if(day < 10){
            day = '0' + day;
        }

        if(format == 'yyyy-mm-dd'){
            return year + '-' + month + '-' + day;
        }
    //    todo 其他格式

    };

    DatePicker.prototype.reset = function (opt) {
        $.extend(DEFAULT, opt);
    }

    var Plugin = function (options) {
        var _arg = arguments;
        return this.each(function () {
            //参数判断
            if(typeof options === 'object' || !options) {

                return new DatePicker(this, options);
            }
        });
    }

    var drawWeeks = function () {
        //星期
        var _weeksHtml = ' <table>' +
            '            <thead>' +
            '            <tr>' +
            '                <th>日</th>' +
            '                <th>一</th>' +
            '                <th>二</th>' +
            '                <th>三</th>' +
            '                <th>四</th>' +
            '                <th>五</th>' +
            '                <th>六</th>' +
            '            </tr>' +
            '            </thead>' +
            '        </table>';
        $('.date-picker-container .weeks-box').html(_weeksHtml);
    }

    DatePicker.prototype.drawMonth = function (date) {

        var dateBase = changeDateToObj(date);
        var year = dateBase.year,
            month = dateBase.month,
            day = dateBase.day;

        //月份最大天数
        var maxDay = calendar.solarDays(year,month);
        var monthDataList = [];//月对象list
        var monthHtml = '';//每月的数据
        var lineHtml = '';//每星期的数据
        var lineCurrentSize = 0;//每星期变化数量
        for(var i=1; i<=maxDay; i++){

            var dateObj = {
                year: year,
                month: month,
                day: i,
                week:(new Date(year, month-1, i)).getDay(),//星期
            };
            monthDataList.push(dateObj);
            var dateItem = dateObj.year+'-' + dateObj.month + '-' + dateObj.day;

            var dateText = i;//日历显示文案
            var today = formatDateToString(new Date());
            var result = compareDate(today,dateItem);
            var tdHtml = '';
            //今天、明天特殊处理
            if(result == 0){
                dateText = '今天';
            }
            var tomorrow = getCountDay(today,1);
            if(compareDate(tomorrow, dateItem) == 0){
                dateText = '明天';
            }
            tdHtml = `<td  data-date="${dateItem}"><p></p><em>${dateText}</em><span></span></td>`;//默认日历样式
            var tdDatas = '';

            if(DEFAULT.gather){
                // var today = formatDateToString(new Date());
                for(var j=0; j<DEFAULT.gather.length; j++){
                    var gatherItem = DEFAULT.gather[j];

                    //匹配数据
                    if(isSameDate(gatherItem.date, dateItem)){
                        var tdClass = '';
                        var tdNode = '';
                        //状态可选
                        if(gatherItem.status == "select"){
                            tdClass += ' select';
                            tdDatas += ' data-selectable="true" data-confirm="false"';
                        }
                        //节假日
                        if(gatherItem.tag){
                            tdClass += ' festival';
                            tdNode += `<i>${gatherItem.tag}</i>`;
                        }
                        //有角标
                        if(gatherItem.badge){
                            tdClass += ' badge';
                            tdNode += '<b></b>';
                        }

                        //其他备注信息处理
                        $.each(gatherItem,function (key, value) {
                            tdDatas += ` data-${key}=${value}`;
                            if(!gatherKeys.includes(key)){
                                gatherKeys.push(key)
                            }
                        });

                        tdHtml = `<td class="${tdClass}" data-date="${dateItem}" ${tdDatas}><p>${gatherItem.label?gatherItem.label:''}</p><em>${dateText}</em><span>${gatherItem.comment?gatherItem.comment:''}</span>${tdNode}</td>`;
                        continue;
                    }

                }
            }

            //每月第一个日期
            if(i == 1){
                for(var j=0; j<dateObj.week; j++){
                    lineHtml += '<td></td>';
                    lineCurrentSize++;
                }
            }

            //今天之前不显示
            if(!DEFAULT.before &&　result > 0){
                tdHtml = `<td></td>`;
            }

            lineHtml += tdHtml;
            lineCurrentSize++;

            // 每月最后一个日期
            if(i == maxDay){
                for(var j=0; j<6-dateObj.week; j++){
                    lineHtml += '<td></td>';
                    lineCurrentSize++
                }
            }

            //每行放满7个日期，清除每行的数据
            if(lineCurrentSize == 7){
                if(lineHtml.includes('data-date')){
                    monthHtml += `<tr>${lineHtml}</tr>`;
                }
                lineHtml = '';
                lineCurrentSize = 0;
            }
        }


        if(swiper){
            swiper.appendSlide(
                `<div class="swiper-slide"><div class="month-item-box">
                <table>
                    <thead><tr><th colspan="7">${year}年${month}月</th></tr></thead>
                    <tbody>${monthHtml}</tbody>
                </table>
            </div></div>`
            );
        }else {
            DatePicker.el.find('.swiper-wrapper').append(
                `<div class="swiper-slide"><div class="month-item-box">
                    <table>
                        <thead><tr><th colspan="7">${year}年${month}月</th></tr></thead>
                        <tbody>${monthHtml}</tbody>
                    </table>
                </div></div>`
            );
        }

        $('[data-selectable=true]').off('click').on('click', selectableHandle);

        var selectData = DatePicker.data.selectData;	//选中的数据
        var base = DatePicker.data.base;

        function selectableHandle() {

            var obj = $(this);
            var badgeEle = obj.find('.badge');

            if(DEFAULT.multiple) {
                //多选

                if(!obj.data('confirm')) {
                    //选中
                    obj.data('confirm', true);
                    obj.addClass('active');

                    //存储选中的数据到回调数据中
                    saveDateData(obj);

                    if(badgeEle.length == 1) {
                        badgeEle.css({
                            'background-image': 'url(' + badgeEle.data('badge-active') + ')'
                        });
                    }
                } else {
                    //取消
                    obj.data('confirm', false);
                    obj.removeClass('active');

                    //删除选中的数据
                    for(var i = 0; i < selectData.length; i++) {
                        if(checkDate(selectData[i].date, obj.data('date'))) {
                            selectData.splice(i, 1);
                        }
                    }

                    if(badgeEle.length == 1) {
                        badgeEle.css({
                            'background-image': 'url(' + badgeEle.data('badge') + ')'
                        });
                    }
                }
            } else {
                //单选

                //不可以二次取消
                if(obj.data('confirm')) {
                    return;
                }


                //其他
                $('[data-selectable=true]').each(function (index, item) {
                    $(this).removeClass('active').data('confirm', false);
                    $(this).find('.badge').css({
                        'background-image': 'url(' + $(this).find('.badge').data('badge') + ')'
                    });
                });

                //当前
                obj.data('confirm', true);
                obj.addClass('active');

                //存储选中的数据到回调数据中
                selectData.length = 0;
                saveDateData(obj);

                badgeEle.css({
                    'background-image': 'url(' + badgeEle.data('badge-active') + ')'
                });
            }


            //选择事件回调
            if (DEFAULT.selectCallback instanceof Function) {
                DEFAULT.selectCallback.call(DatePicker.el, DatePicker.data);
            }

            //存储日期数据
            function saveDateData(obj) {
                var item = {};
                gatherKeys.forEach(function (key,index) {
                    var tempKey = key.toLowerCase();
                    if(obj.data(tempKey+'')){
                        item[key] =  obj.data(tempKey+'');//没有的不存
                    }
                });



                // if(!base.includes(item.date)){
                //     base.push(item.date);
                // }

                var d = DatePicker.formatDate(item.date);
                item.date = d;
                selectData.push(item);

            }
        }
    }


    /**
    *
    * 格式化日期
    *   日期格式为：'2017-06-20'
    *
    * */
    DatePicker.formatDate = function (date) {
        var result = null;

        if(typeof date === 'string') {
            var dateArr = date.split('-');
            var dateStr = '';

            for(var i = 0; i < dateArr.length; i++) {
                var _d = parseInt(dateArr[i])
                if(_d < 10) {
                    _d = '0' + _d;
                }

                if(i < dateArr.length - 1) {
                    dateStr += _d + '-';
                } else {
                    dateStr += _d;
                }
            }

            if(dateArr.length == 2) {
                dateStr += '-01T00:00:00';
            } else {
                dateStr += 'T00:00:00';
            }

            try {
                var newDate = new Date(dateStr);

                result = {
                    year: newDate.getFullYear(),
                    month: newDate.getMonth() + 1,
                    day: newDate.getDate()
                }

                //星期
                switch(newDate.getDay()) {
                    case 0:
                        result.week = '星期日';
                        break;
                    case 1:
                        result.week = '星期一';
                        break;
                    case 2:
                        result.week = '星期二';
                        break;
                    case 3:
                        result.week = '星期三';
                        break;
                    case 4:
                        result.week = '星期四';
                        break;
                    case 5:
                        result.week = '星期五';
                        break;
                    case 6:
                        result.week = '星期六';
                        break;
                }
            } catch (e) {
                throw '日期错误';
            }
        } else if(typeof date === 'object') {
            if(date.hasOwnProperty('year') && date.hasOwnProperty('month') && date.hasOwnProperty('day') && date.hasOwnProperty('week')) {
                result = date;
            }
        }

        return result;
    };


    /**
     * 判断当前日期date是否是今天
     * @param date 格式yyyy-mm-dd
     */
    var isToday = function(date) {
        var _isToday = false;
        var _date = date.split('-');
        var _year = 0,
            _month = 0,
            _day = 0;
        if(_date.length > 2){
            _year = parseInt(_date[0]);
            _month = parseInt(_date[1] - 1);
            _day = parseInt(_date[2]);
        }else{
            return false;
        }
        date = new Date(_year, _month, _day);

        var localDate = new Date();//本地时间
        if(localDate.getFullYear() == date.getFullYear()){
            if(localDate.getMonth() == date.getMonth()){
                if(localDate.getDate() == date.getDate()){
                    _isToday = true;
                }
            }
        }
        return _isToday;
    }

    /**
     * 获取参数日期的前/后几天
     * @param currentDay  string yyyy-mm-dd
     * @param n  n-负数表示前几天，n-正数表示后几天，0为当天
     * @returns string-date 字符串类型的日期 yyyy-mm-dd
     */
    var getCountDay = function(currentDay,n) {
        if(!n){
            n = 0;
        }
        var currentDate = formatStringToDate(currentDay);
        var result = currentDate.getTime() + n*24*60*60*1000;
        var final = new Date(result);
        return formatDateToString(final);
    }

    /**
     * 支持string格式 yyyy-mm-dd和date类型参数
     * @param dateStr1
     * @param dateStr2
     * @returns {number} 0:两个日期相等;1:dateStr1>dateStr2; -1:dateStr1<dateStr2
     */
    var compareDate = function(dateStr1,dateStr2) {
        var date1,date2;
        if(typeof dateStr1 == 'string'){
            //字符串类型
            date1 = formatStringToDate(dateStr1);
        }else if(typeof dateStr1 == 'object' && dateStr1 instanceof Date){
            //date类型
            date1 = dateStr1;
        }
        if(typeof dateStr2 == 'string'){
            //字符串类型
            date2 = formatStringToDate(dateStr2);
        }else if(typeof dateStr2 == 'object' && dateStr2 instanceof Date){
            //date类型
            date2 = dateStr2;
        }

        var tempTime1,tempTime2;
        tempTime1 = date1.getTime();
        tempTime2 = date2.getTime();

        if(tempTime1 == tempTime2){
            return 0;
        }else if(tempTime1 > tempTime2){
            return 1;
        }else if(tempTime1 < tempTime2){
            return -1;
        }
    }

    /**
     * 获取参数日期的前/后几个月
     * @param currentDay string yyyy-mm-dd
     * @param n n-负数表示前几个月，n-正数表示后几个月，0为当月
     * @returns string-date string格式的日期 yyyy-mm-dd 返回的是月初1号
     */
    var getCountMonthEarlier = function(currentDay, n){
        if(!n){
            n = 0;
        }
        var currentDate = formatStringToDate(currentDay);
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + n;
        var day = 1;//月初
        var temp = new Date(year,month,day);
        return formatDateToString(temp);
    }

    /***
     * 判断两个日期是否是同一天
     * @param date1 yyyy-mm-dd
     * @param date2 yyyy-mm-dd
     */
    var isSameDate = function(date1,date2) {
        var sameDateFlag = false;
        var temp1 = date1.split('-');
        var temp2 = date2.split('-');
        if(parseInt(temp1[0]) == parseInt(temp2[0])){
            if(parseInt(temp1[1]) == parseInt(temp2[1])){
                if(parseInt(temp1[2]) == parseInt(temp2[2])){
                    sameDateFlag = true;
                }
            }
        }
        return sameDateFlag;
    }

    /**
     * string类型日历转换为date
     * @param dateStr string yyyy-mm-dd
     */
    var formatStringToDate = function(dateStr) {
        var _date = dateStr.split('-');
        var _year = 0,
            _month = 0,
            _day = 0;
        if(_date.length > 2){
            _year = parseInt(_date[0]);
            _month = parseInt(_date[1] - 1);
            _day = parseInt(_date[2]);
        }else{
            return false;
        }
        return new Date(_year, _month, _day);
    }

    /**
        * 判断日期是否相等
        *  @param
        *      date：对象或者字符串，格式（obj: {year: 2017, month: 10, day: 1...}）
        *      date2：数组或者字符串，格式（[{year: 2017, month: 10, day: 1...}, '2017-10-1']，'2017-10-1'）
        * */
    var checkDate = function(date, date2) {
        var result = false;

        if(date2 instanceof Array) {
            //数组
            var BreakException = {};
            var d1 = '',
                d2 = '';
            try {
                date2.forEach(function (item, index) {
                    d1 = DatePicker.formatDate(item.date);
                    d2 = DatePicker.formatDate(date);

                    if(d1.day == d2.day && d1.month == d2.month && d1.year == d2.year) {
                        result = index.toString();
                        throw BreakException;
                    }
                });
            } catch (e) {
                if(e != BreakException) throw e;
            }
        } else if(typeof date2 == 'string') {
            //字符串
            var d1 = DatePicker.formatDate(date),
                d2 = DatePicker.formatDate(date2);

            if(d1.day == d2.day && d1.month == d2.month && d1.year == d2.year) {
                result = true;
            }
        }

        return result;
    }

    $.fn.datePicker = Plugin;
    $.fn.datePicker.constructor = DatePicker;

})(Zepto);

