/**
 * 常用工具js
 */
/**
 * 查询字符串上的指定值
 * @param key
 * @param strURL
 * @returns {string}
 */
function getParam(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ?
        decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}

/***
 * 判断两个日期是否是同一天
 * @param date1 yyyy-mm-dd
 * @param date2 yyyy-mm-dd
 */
function isSameDate(date1,date2) {
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
 * 判断当前日期date是否是今天
 * @param date 格式yyyy-mm-dd
 */
function isToday(date) {
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
/***
 * 格式化date类型日期
 * @param date date对象 返回yyyy-mm-dd格式的string
 */
function formatDateToString(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if(month <= 9){
        month = '0' + month;
    }
    if(day <=9 ){
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

/**
 * string类型日历转换为date
 * @param dateStr string yyyy-mm-dd
 */
function formatStringToDate(dateStr) {
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
 * 获取参数日期的前/后几天
 * @param currentDay： string yyyy-mm-dd
 * @param n：number n-负数表示前几天，n-正数表示后几天，0为当天
 */
function getCountDay(currentDay,n) {
    var currentDate = formatStringToDate(currentDay);
    var b = currentDate.getTime() + n*24*60*60*1000;
    // console.log(b);
    var c = new Date(b);
    console.log(formatDateToString(c))
}


/**
 * 获取参数日期的前/后几个月
 * @param currentDay string yyyy-mm-dd
 * @param n number n-负数表示前几个月，n-正数表示后几个月，0为当月
 * @returns {String} string-date string格式的日期 yyyy-mm-dd 返回的是月初1号
 */
function getCountMonthEarlier (currentDay,n){
    if(!n){
        n = 0;
    }
    var currentDate = formatStringToDate(currentDay);
    console.log(currentDate);
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();
    console.log( year + '-' + month + '-' + day);
    var result = currentDate.getTime() + n*24*60*60*1000;
    // console.log(result)
    var final = new Date(result);
    // console.log(formatDateToString(final));
    return formatDateToString(final);
}

/**
 * 获取一个日期的当月最大天数
 * @param date String yyyy-mm-dd
 * @param n number n为正时，取后n月的最大月份数；n为负时，取前n月的最大月份数
 * @returns {number} 返回最大天数列表

 */
function getMaxDate(date) {
    //获取最大天数
    var max = [31,28,31,30,31,30,31,31,30,31,30,31];
    var tempDate = formatStringToDate(date);
    var year = tempDate.getFullYear();
    if(year % 4 == 0){
        //闰年
        max[1] = 29;
    }
    var month = tempDate.getMonth();
    return max[month];
}

/**
 * 获取参数日期的前/后几个月
 * @param currentDay string yyyy-mm-dd
 * @param n n-负数表示前几个月，n-正数表示后几个月，0为当月
 * @returns string-date string格式的日期 yyyy-mm-dd 返回的是月初1号
 */
function getCountMonthEarlier (currentDay, n){
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

/**
 * 格式化时间
 * @param n 单位是秒
 */
function format(n) {
    var s = parseInt(n);
    var	m = 0;
    var	h = 0;

    if(s > 60) {
        m = parseInt(s / 60);
        s = parseInt(s % 60);

        if(m > 60) {
            h = parseInt(m / 60);
            m = parseInt(m % 60)
        }
    }

    var result = {}
    result.second = s;
    if(m > 0) {
        result.minute = m;
    }
    if(h > 0) {
        result.hour = h;
    }

    return result;
}