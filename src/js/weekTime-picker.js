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
    return d;
}

function configHour() {
    var hours = [];
    for(var i = 0; i < 24; i++) {
        if(i < 10) i = "0"+i;
        hours.push({value: i , text:  i + "点"});
    }
    return hours;
}

function configMinute() {
    var minutes = [];
    for(var i=0;i<60;i++){
        if(i < 10) i = "0" + i;
        minutes.push({value:i, text:i+"分"});
    }
    return minutes;
}

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
    return nowHour;
}

function getAddMinutes(input) {
    var d = new Date(new Date().getTime());
    var nowHour = d.getHours();
    var totalM = Number(d.getMinutes()) + Number(input.data('intervalminute'));
    var resMinute = totalM % 60;
    return resMinute;
}

function initWeekTime(_this,callback) {
    var config = {};
    var input = _this;
    var _tips = "00";
    config.key = input.prop('id');

    var interval = 3;
    if( input.data('interval')){
        interval  = input.data('interval');//最大可选择的天数
    }

    // 日期
    var d = new Date();
    var dates = [];
    var days = getAddDays(input); //从今天开始过几天可以开始订票
    var init_day = getDate(d).value;
    if(days == 0){
        dates.push({value:getDate(d).value, text:'今天'});
        d.setDate(d.getDate() + 1)
        dates.push({value:getDate(d).value, text:'明天'});
        d.setDate(d.getDate() + 1);
        interval = interval-2;
    }else if(days == 1){
        d.setDate(d.getDate() + 1);
        init_day = getDate(d).value;
        dates.push({value:getDate(d).value, text:'明天'});
        d.setDate(d.getDate() + 1);
        interval = interval-1;
    }else {
        d.setDate(d.getDate() + days);
        init_day = getDate(d).value;
    }

    for(var i=0; i < interval; i++) {
            var str = "周" + "日一二三四五六".charAt(d.getDay());
            dates.push({value:getDate(d).value, text:getDate(d).text+""+str});
            d.setDate(d.getDate() + 1);
    }
    config.day = dates;

    // 时间
    config.hour = configHour();
    // config.hour.splice(0,0,{value:"now",text:"现在出发"})
    // data-level 未赋值显示两级，赋值3显示3级
    var minutes = [{value:"", text:""}];
    config.minute = minutes;

    // 默认值
    var d = getNow();
    config.data = {day:getDate(d).value, hour:"", minute:""};
    if(input.val()) {
        config.data = {day:input.data('date'), hour:input.data('time'), minute: _tips};
    }

    // 改变日期，更新时间
    var init = 0;
    config.onChange = function(values, name, element, scroll) {
        if(name === "minute") return;
        if(name === 'day') {
            var nowHour = getAddHours(input);

            if(element.day.find('li .selected').data('value') == getDate(d).value) {
                element.hour.find('li').each(function() {
                    if($(this).data('value')) {
                        var arr = Number($(this).data('value'));

                        if(arr === nowHour && init == 0){
                            // $(this).addClass('selected');
                            //添加现在出发选项
                            var _now = $(this).data('value');
                            var selected = ' class="selected"';
                            $(this).before('<li data-value="now"' + selected + '>现在出发</li>');
                            // $(this).remove();
                            init = 1;
                        }
                        //如果可选择的时间小于当前时间，则删除不显示
                        if (arr < nowHour) {
                            $(this).remove();
                        }
                    }
                })
                addMinutes(element,[]);
            }
            else if(element.day.find('li .selected').data('value') == init_day) {
                init = 0;
                addHours(element);
                element.hour.find('li').each(function() {
                    if($(this).data('value')) {
                        var arr = Number($(this).data('value'));
                        //如果可选择的时间小于当前时间，则删除不显示
                        if (arr < nowHour) {
                            $(this).remove();
                        }
                    }
                })
                addMinutes(element,configMinute());

            }else {
                init = 0;
                addHours(element);
                addMinutes(element,configMinute());
            }
            if(scroll.hour) {
                scroll.hour.refresh();
                element.hour.find('ul').animate({translate:'0px,0px'}, 'fast', 'linear');
            }

        }

        if(name === 'hour') {
            var resMinute = getAddMinutes(input);
            var nowHour = getAddHours(input);
            var hourLi = element.hour.find('li .selected');
            var dayLi = element.day.find('li .selected');
            // console.log("----"+dayLi.data('value') +"----"+ getDate(d).value);
            if(hourLi.data('value') != "now"){
                addMinutes(element,configMinute());
                // console.log("-----"+Number(hourLi.data('value')) +"----"+ nowHour);
                if(dayLi.data('value') === init_day && Number(hourLi.data('value')) === nowHour){
                    $.each(element.minute.find('li'),function (index,item) {
                        if($(this).data('value')) {
                            var arr = $(this).data('value');
                            if(resMinute >= arr){
                                $(this).remove();
                            }else {
                                $(this).addClass('selected');
                                return false
                            }
                        }
                    })
                }

            }else{
                addMinutes(element,[]);
            }
            if(scroll.minute) {
                scroll.minute.refresh();
                element.minute.find('ul').animate({translate:'0px,0px'}, 'fast', 'linear');
            }
        }

    }

    function addMinutes(element,minutesArr) {
        var selected = ' class="selected"';
        var minutes =  minutesArr;
        var strMinuteHtml = '<li></li><li></li>';
        $.each(minutes, function(i, v) {
            if(v.value === "00")  {
                strMinuteHtml += '<li data-value="' + v.value + '"' + selected + '>' + v.text + '</li>';
            }else {
                strMinuteHtml += '<li data-value="' + v.value + '">' + v.text + '</li>';
            }
        });
        strMinuteHtml += '<li></li><li></li>';
        element.minute.find('ul').html(strMinuteHtml);

    }

    function addHours(element) {
        var hours  = configHour();
        var strHourHtml = '<li></li><li></li>';
        var selected = ' class="selected"';
        $.each(hours, function(k, v) {
            if(v.value === "00") {
                strHourHtml += '<li data-value="' + v.value + '"' + selected + '>' + v.text + '</li>';
            }else{
                strHourHtml += '<li data-value="' + v.value + '">' + v.text + '</li>';
            }
        });
        strHourHtml += '<li></li><li></li>';
        element.hour.find('ul').html(strHourHtml);
    }

    // 载入插件
    $.timePicker(config, function(values, texts) {
        if(texts.hour) {
            if(values.hour == "now" ){
                input.val("今天" + ' ' + "现在出发" );
            }else{
                input.val(texts.day + ' ' + texts.hour + ' ' + texts.minute);
            }
            input.data('date', values.day);
            input.data('time', values.hour);
            input.data('minute', values.minute);
            if(undefined != callback && typeof callback == "function"){
                var data = {
                    date:values.day,
                    time:values.hour,
                    minute:values.minute
                }
                callback(data);
            }
        }
    });
}