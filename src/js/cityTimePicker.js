// 选择时间
var zeroize = function(number) {
    return number > 9 ? number : '0' + number;
}

// 获取日期
var getDate = function(Date) {
    return {
        text: zeroize(Date.getMonth()+1) + '月' + zeroize(Date.getDate()) + '日',
        value: Date.getFullYear() + '-' + zeroize(Date.getMonth()+1) + '-' + zeroize(Date.getDate())
    };
}

// 获取时间
var getTime = function(hour, minute) {
    return {
        text: zeroize(hour) + ':' + zeroize(minute),
        value: zeroize(hour) + ':' + zeroize(minute)
    };
}

//获取当前时间
var getNow = function() {
    var d = new Date(new Date().getTime());
    d.setHours(d.getHours() + 1);
    if(d.getMinutes() < 30) {
        d.setMinutes(30);
    } else {
        d.setMinutes(60);
    }

    return d;
}

//过滤
var filterHoursHours = function (arr, all) {
    var result = [];

    var _new = [];
    var _tmp;
    var now = '2017-09-22T';

    for(var i = 0; i < arr.length; i++) {
        _tmp = arr[i].split('~');
        _new.push([new Date(now + _tmp[0]), new Date(now + _tmp[1])]);
    }

    var _new2 = [];
    for(var n = 0; n < all.length; n++) {
        _tmp = all[n].value.split('~');
        _new2.push([new Date(now + _tmp[0]), new Date(now + _tmp[1])]);
    }

    for(var m = 0; m < _new.length; m++) {
        for(var x = 0; x < _new2.length; x++) {
            if(_new2[x][0] >= _new[m][0] && _new2[x][0] < _new[m][1]) {
                result.push(all[x]);
            }
        }
    }

    return result;
};

function getAddDays(input) {
    var d = new Date(new Date().getTime());
    var nowHour = d.getHours();
    var totalM = Number(d.getMinutes()) + Number(input.data('intervalminute'));
    var addhour =Math.floor(totalM/60);
    var days = Math.floor((nowHour +addhour) / 24);
    return days;
}

function getAddHours(input) {
    var d = new Date(new Date().getTime());
    var nowHour = d.getHours();
    var totalM = Number(d.getMinutes()) + Number(input.data('intervalminute'));
    var addhour =Math.floor(totalM/60);
    var nowHour = (nowHour +addhour) % 24;
    var resMinute = totalM % 60;
    var bookingTime = {hour:nowHour,minute:resMinute}
    return bookingTime;
}

var initCityTimePicker = function (_input, callback) {
    var config = {};
    var input = _input;
    var _tips = '';
    config.key = input.prop('id');
    // 日期
    var d = new Date();
    var dates = [];
    var days = getAddDays(input); //从今天开始过几天可以开始订票
    var init_day = getDate(d).value;
    if(days == 0){
        dates.push({value:getDate(d).value, text:'今天'});
        d.setDate(d.getDate()+1);
    }else {
        d.setDate(d.getDate()+days);
        init_day = getDate(d).value;
    }

    for(var i=0; i < 5; i++) {//i 可选择的天数
        dates.push({value:getDate(d).value, text:getDate(d).text});
        d.setDate(d.getDate()+1);
    }
    config.day = dates;

    // 时间
    var hours = [];
    var hour,hour2,hour3;

    for(var i = 0; i < 24; i++) {
        hour = getTime(i, 0);
        hour2 = getTime(i, 30);
        hour3 = getTime(i + 1, 0);
        hours.push({value: hour.value + '~' + hour2.value, text: hour.text + '~' + hour2.text});
        hours.push({value: hour2.value + '~' + hour3.value, text: hour2.text + '~' + hour3.text});
    }

    //过滤时间
    if($.trim(input.data('filter')) != '') {
        hours = filterHoursHours(input.data('filter').split(','), hours);
    }

    if( $(this).data('level') === 3){
        for(var i = 0; i < 24; i++) {
            if(i < 10) i = "0"+i;
            hours.push({value: i , text:  i + "点"});
        }
    }

    config.hour = hours;

    // data-level 未赋值显示两级，赋值3显示3级
    config.minute = [{value:_tips, text:_tips}];
    if($(this).data('level') === 3){
        var minutes = [{value:"", text:""}];
        for(var i=0;i<60;i++){
            if(i < 10) i = "0" + i;
            minutes.push({value:i, text:i+"分"});
        }
        config.minute = minutes;
    }

    // 默认值
    var d = getNow();
    config.data = {day:getDate(d).value, hour:getTime(d.getHours(), d.getMinutes()).value, minute:_tips};
    if(input.val()) {
        config.data = {day:input.data('date'), hour:input.data('time'), minute: _tips};
    }

    // 改变日期，更新时间
    config.onChange = function(values, name, element, scroll) {
        if(name !== 'day') return;
        var d = getNow();
        if(element.day.find('.selected').data('value') == init_day) {
            element.hour.find('li').each(function() {
                if($(this).data('value')) {

                    var arr = $(this).data('value').split('~');
                    var arr2 = arr[0].split(':');
                    var bookingTime = getAddHours(input);
                    //如果可选择的时间小于当前时间，则删除不显示
                    if(arr2[0] < bookingTime.hour || (arr2[0] == bookingTime.hour && arr2[1] < bookingTime.minute)) {
                        $(this).remove();
                    }
                }
            })
        } else {
            var strHtml = '<li></li><li></li>';
            var selected = ' class="selected"';
            $.each(config.hour, function(k, v) {
                if(k > 0) selected = '';
                strHtml += '<li data-value="' + v.value + '"' + selected + '>' + v.text + '</li>';
            });
            strHtml += '<li></li><li></li>';
            element.hour.find('ul').html(strHtml);
        }

        if(scroll.hour) {
            scroll.hour.refresh();
            element.hour.find('ul').animate({translate:'0px,0px'}, 'fast', 'linear');
        }
    }

    // 载入插件
    $.timePicker(config, function(values, texts) {
        if(texts.hour) {
            input.val(texts.day + ' ' + texts.hour.split('~')[0]);
            input.data('date', values.day);
            input.data('time', values.hour);
            if(undefined != callback && typeof callback == "function"){
                var data ={
                    date:values.day,
                    time:values.hour,
                }
                callback(data);
            }
        }
    });
}