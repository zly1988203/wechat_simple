var DatePicker2 = function () {

};
$(function () {

    //票状态 0-有票 1-售罄 2-未排班 3-停售
    var SELL_STATUS = {
        onSell: '0',
        sellOut: '1',
        unplanned: '2',
        finished: '3'
    };
    //节假日标记 0-无 1-休 2-班
    var FESTIRVAL_TYPE = {
        vacation : '1',  //法定节假日
        workday: '2', //法定节假日调班 一般在周末
        normal: '0' //无节假日
    };


    var now  = new Date();

    /**
     * 格式化日历数据: 根据月份分组，同一月份的放在一起
     */
    DatePicker2.formatData = function(data){
        var arr = [];//放最终的数据
        var temp = {};//放
        for(var i=0; i<data.length; i++){
            var dataItem = data[i];
            var date = DatePicker2.formatDate(dataItem.date);
            date.date = dataItem.date;
            date.festival = data[i].festival ? data[i].festival : FESTIRVAL_TYPE.normal;
            date.sellStatus = data[i].sellStatus ? data[i].sellStatus : SELL_STATUS.unplanned;
            date.id = date.year + DatePicker2.formatNumToDouble(date.month);
            date.comment = switchSellStatus(date.sellStatus);
            date.classNames = switchClass(date.sellStatus,date.festival);
            date.clickable = switchClickable(date.sellStatus);
            date.lunar = data[i].lunar ? data[i].lunar : '';//农历
            if(!(temp[date.id])){
                arr.push({
                    id: date.id,
                    name: date.year + '年' + DatePicker2.formatNumToDouble(date.month) + '月',
                    data: [date]
                });
                temp[date.id] = date;
            }else{
                for(var j=0; j<arr.length; j++){
                    var arrItem = arr[j];
                    if(arrItem.id == date.id){
                        arrItem.data.push(date);
                        break;
                    }
                }
            }
        }
        return arr;
    };

    /**
     * 格式化月和日，如1月转换成01月
     * 返回结果类型为string类型
     */
    DatePicker2.formatNumToDouble = function (num) {
        var result = 0;
      if(typeof num === 'string'){
          result = parseInt(num);
      }else if(typeof num === 'number'){
          result = num;
      }else{
          throw new Error('参数错误，参数格式为String或者Number的整数数字')
      }
      if(result > 0 && result < 10){
          result = '0' + result;
      }else {
          result = '' + result;
      }
      return result;
    };

    /**
     * 格式化日期：参数格式为yyyy-mm-dd
     * 返回：{year:num, month:num, day:num, week:num}
     * week 0-周日；1-周一。。。
     */
    DatePicker2.formatDate = function (dateString) {
        var result = {};
        if(typeof dateString === 'string'){
            var dateObj = new Date(dateString.replace(/-/g,'/'));
            result.year = dateObj.getFullYear();
            result.month = dateObj.getMonth()+1;
            result.day = dateObj.getDate();
            result.week = dateObj.getDay();
        }else{
            throw new Error('日期格式错误：正确格式为yyyy-mth-dd');
        }
        return result;
    };

    /**
     * 判断是否是今天
     * 参数格式 yyyy-mm-dd
     */
    DatePicker2.isToday = function (dateString) {
        var dateFmt = DatePicker2.formatDate(dateString);
        //年月日都相等
        if(now.getFullYear() == dateFmt.year && (now.getMonth()+1) == dateFmt.month && now.getDate() == dateFmt.day){
            return true;
        }else {
            return false;
        }
    };

    /**
     * 判断是否是明天
     * 参数格式 yyyy-mm-dd
     */
    DatePicker2.isTomorrow = function (dateString) {
        var dateFmt = DatePicker2.formatDate(dateString);
        if(now.getFullYear()==dateFmt.year && (now.getMonth()+1)==dateFmt.month && (now.getDate()+1)==dateFmt.day){
            return true;
        }else{
            return false;
        }
    };

    /**
     * 画日历
     * dateObj:[[{1月1号}，{1月2号}]，[2月]...[12月]]
     */
    DatePicker2.draw = function (dateObj, parentEle,isShowWeek,callback) {
        var dateObjArr = DatePicker2.formatData(dateObj);
        DatePicker2.fullDatePicker(dateObjArr,parentEle,isShowWeek);
        if(callback && typeof callback === "function"){
            callback();
        }
    };

    /**
     * 第一个日期不是周日，则补全左侧空缺
     */
    DatePicker2.fullLeft = function(weekNum){
        var leftHtml = '';
        if(weekNum > 0 && weekNum < 7){
            for(var i=1; i<weekNum+1; i++){
                leftHtml += '<td class="hide"></td>';
            }
        }
        return leftHtml;
    };

    /**
     * 最后一个日期不是周六，则补全右侧空缺
     */
    DatePicker2.fullRight = function (weekNum) {
        var rightHtml = '';
        if(weekNum < 6){
            for(var i=0; i<6-weekNum; i++){
                rightHtml += '<td class="hide"></td>'
            }
        }
        return rightHtml;
    };

    /**
     *  画星期
     * @param parentEle 父元素选择器
     */
    DatePicker2.fullWeek = function (parentEle) {
        //parentEle : .content
        var weekBoxHtml = '<div class="week-box">' +
            '<ul>' +
            '  <li>日</li>' +
            '  <li>一</li>' +
            '  <li>二</li>' +
            '  <li>三</li>' +
            '  <li>四</li>' +
            '  <li>五</li>' +
            '  <li>六</li>' +
            '</ul>' +
            '</div>';
        $(parentEle).append(weekBoxHtml)
    };

    /**
     *
     * @param dateObj 日历对象
     * @param parentEle 父元素选择器
     */
    DatePicker2.fullDate = function (dateObj,parentEle) {
        var dateHtml = '';
        var monthHtml = '';
        //按月遍历 item为月对象
        dateObj.forEach(function (item,index) {
            var tbodyHtml = '';
            // 按日遍历 item为日对象
            item.data.forEach(function (dataItem, dateIndex) {
                //第一个日期不是星期天,最后一个日期不是星期六
                var fullLeftHtml = '';
                var fullRightHtml = '';
                if(item.data.length == 1){
                    fullLeftHtml = DatePicker2.fullLeft(dataItem.week);
                    fullRightHtml = DatePicker2.fullRight(dataItem.week);
                }else{
                    if(dateIndex == 0){
                        // 第一个日期
                        fullLeftHtml = DatePicker2.fullLeft(dataItem.week);
                    }else if(dateIndex == item.data.length - 1){
                        //最后一个日期
                        fullRightHtml = DatePicker2.fullRight(dataItem.week);
                    }
                }
                // 节假日标记
                var festivalHtml = '';
                if(dataItem.festival == FESTIRVAL_TYPE.vacation){
                    festivalHtml = '<i>休</i>';
                }else if(dataItem.festival == FESTIRVAL_TYPE.workday){
                    festivalHtml = '<i>班</i>';
                }

                //今天 明天显示
                var showDay = dataItem.day;
                if(DatePicker2.isToday(dataItem.date)){
                    showDay = '今天';
                }else if(DatePicker2.isTomorrow(dataItem.date)){
                    showDay = '明天';
                }

                tbodyHtml += fullLeftHtml
                    + '<td class="'+ dataItem.classNames +'" data-clickable="'+ dataItem.clickable +'">' +
                    '<p>'+ dataItem.lunar +'</p>' +
                    '<em>'+ showDay +'</em>' +
                    '<span>'+ dataItem.comment +'</span>'
                    + festivalHtml
                    +'</td>'
                    + fullRightHtml;
            });

            monthHtml += '<li class="sui-border-b"><table>' +
                '  <thead><tr><th colspan="7">'+ item.name +'</th></tr></thead>' +
                '  <tbody><tr>' +
                tbodyHtml +
                '  </tr></tbody>' +
                '</table>' +
                '</li>'
        });
        dateHtml += monthHtml ;
        var dateBoxHtml = '<div class="date-box"><ul>'+ dateHtml +'</ul></div>';
        $(parentEle).append(dateBoxHtml);
    };

    /**
     * 填充日历到Document上
     * @param dateObj 日历数据对象
     * @param parentEle 日历的父元素
     */
    DatePicker2.fullDatePicker = function (dateObj,parentEle,isShowWeek) {
        if(isShowWeek){
            DatePicker2.fullWeek(parentEle);
        }
        DatePicker2.fullDate(dateObj,parentEle);
    };
    /*DatePicker2.fullDatePicker = function (dateObj,parentEle) {
        var weekBoxHtml = '<div class="week-box">' +
            '<ul>' +
            '  <li>日</li>' +
            '  <li>一</li>' +
            '  <li>二</li>' +
            '  <li>三</li>' +
            '  <li>四</li>' +
            '  <li>五</li>' +
            '  <li>六</li>' +
            '</ul>' +
            '</div>';
        var dateHtml = '';
        var monthHtml = '';
        //按月遍历 item为月对象
        dateObj.forEach(function (item,index) {
            var tbodyHtml = '';
            // 按日遍历 item为日对象
            item.data.forEach(function (dataItem, dateIndex) {
                //第一个日期不是星期天,最后一个日期不是星期六
                var fullLeftHtml = '';
                var fullRightHtml = '';
                if(item.data.length == 1){
                    fullLeftHtml = DatePicker2.fullLeft(dataItem.week);
                    fullRightHtml = DatePicker2.fullRight(dataItem.week);
                }else{
                    if(dateIndex == 0){
                        // 第一个日期
                        fullLeftHtml = DatePicker2.fullLeft(dataItem.week);
                    }else if(dateIndex == item.data.length - 1){
                        //最后一个日期
                        fullRightHtml = DatePicker2.fullRight(dataItem.week);
                    }
                }
                // 节假日标记
                var festivalHtml = '';
                if(dataItem.festival == FESTIRVAL_TYPE.vacation){
                    festivalHtml = '<i>休</i>';
                }else if(dataItem.festival == FESTIRVAL_TYPE.workday){
                    festivalHtml = '<i>班</i>';
                }

                //今天 明天显示
                var showDay = dataItem.day;
                if(DatePicker2.isToday(dataItem.date)){
                    showDay = '今天';
                }else if(DatePicker2.isTomorrow(dataItem.date)){
                    showDay = '明天';
                }

                tbodyHtml += fullLeftHtml
                    + '<td class="'+ dataItem.classNames +'" data-clickable="'+ dataItem.clickable +'">' +
                    '<p>'+ dataItem.lunar +'</p>' +
                    '<em>'+ showDay +'</em>' +
                    '<span>'+ dataItem.comment +'</span>'
                    + festivalHtml
                    +'</td>'
                    + fullRightHtml;
            });
            var liClassName = '';
            if(dateObj.length > '1' && index < dateObj.length-1){
                liClassName = 'sui-border-b';
            }
            monthHtml += '<li class="'+ liClassName +'"><table>' +
                '  <thead><tr><th colspan="7">'+ item.name +'</th></tr></thead>' +
                '  <tbody><tr>' +
                tbodyHtml +
                '  </tr></tbody>' +
                '</table>' +
                '</li>'
        });
        dateHtml += monthHtml ;

        var dateBoxHtml = '<div class="date-box"><ul>'+ dateHtml +'</ul></div>';
        var contentNode = $('<div class="content"></div>');
        contentNode.append(weekBoxHtml).append(dateBoxHtml);
        $(parentEle).append(contentNode);

        //绑定事件
        $('td').off('click').on('click',function () {
            var clickable = $(this).data('clickable');
            if(clickable){
                // TODO 点击事件
            }else{
                return;
            }
        });

        /!*
        // 日历结构
        var weekBoxHtml = '<div class="week-box">' +
            '<ul>' +
            '  <li>日</li>' +
            '  <li>一</li>' +
            '  <li>二</li>' +
            '  <li>三</li>' +
            '  <li>四</li>' +
            '  <li>五</li>' +
            '  <li>六</li>' +
            '</ul>' +
            '</div>';
        var dateBoxHtml = '<div class="date-box">' +
            '<ul>' +
            '  <li class="sui-border-b">' +
            '    <table>' +
            '      <thead><tr><th colspan="7">2019年2月</th></tr></thead>' +
            '      <tbody><tr>' +
            '        <td class="on-sale"><span>廿一</span><p>今天</p><span>有票</span></td>' +
            '        <td><span>廿一</span><p>今天</p><span>/</span></td>' +
            '        <td class="festival"><span>廿一</span><p>今天</p><span>有票</span><i>班</i></td>' +
            '        <td><span>廿一</span><p>今天</p><span>有票</span></td>' +
            '        <td class="festival festival-active"><span>廿一</span><p>今天</p><span>有票</span><i>休</i></td>' +
            '        <td><span>廿一</span><p>今天</p><span>有票</span></td>' +
            '        <td><span>廿一</span><p>今天</p><span>有票</span></td>' +
            '        <td><span>廿一</span><p>今天</p><span>有票</span></td>' +
            '      </tr></tbody>' +
            '    </table>' +
            '  </li>' +
            '</ul>' +
            '</div>';
        var dateHtml = '<div class="content">'+ weekBoxHtml + dateBoxHtml+'</div>'
        $(parentEle).append(dateHtml);*!/
    };*/












    // ++++++++++++++++++调用++++++++++++++++++++++
    // var a = new DatePicker2.formatDate('2019-3-3');
    //sellStatus 0-有票
    //生成日期格式
    // var dateObj = [
    //     {date: '2019-1-25',sellStatus:'0'},
    //     {date: '2019-1-26',sellStatus:'1'},
    //     {date: '2019-1-27',sellStatus:'2'},
    //     {date: '2019-1-28',sellStatus:'3'},
    //     {date: '2019-1-29',sellStatus:'3'},
    //     {date: '2019-1-30',sellStatus:'0',festival:'2',lunar:'十一'},
    //     {date: '2019-1-31',sellStatus:'1',festival:'1',lunar:'十二'},
    //     {date: '2019-2-1',sellStatus:'1',lunar:'十三'},
    //     {date: '2019-2-2',sellStatus:'1'},
    //     {date: '2019-2-27',sellStatus:'1'}
    // ]
    // DatePicker2.draw(dateObj,0);

    // 转换状态
    function switchSellStatus(sellStatus){
        var comment = '';
        sellStatus = sellStatus+ '';
        if(sellStatus == SELL_STATUS.onSell){
            comment = '有票';
        }else if(sellStatus == SELL_STATUS.sellOut){
            comment = '售罄';
        }else if(sellStatus == SELL_STATUS.unplanned){
            comment = '/';
        }else if(sellStatus == SELL_STATUS.finished){
            comment = '停售';
        }
        return comment;
    }
    //转换样式
    function switchClass(status,festival) {
        var classNames = '';
        if(status == SELL_STATUS.onSell){
            classNames += ' on-sale';
        }
        if(festival == FESTIRVAL_TYPE.workday || festival == FESTIRVAL_TYPE.vacation){
            classNames += ' festival';
        }
        return classNames;
    }

    //转换是否可点击
    function switchClickable(status) {
        //状态为有票时 ，可点击
        if(status==SELL_STATUS.onSell){
            return true;
        }
        return false;
    }
});