var _bgAdapt = true;	// 背景适配器
$(function() {
        
    // 适配背景图
    var _multiple = 1.666666666666667;
    $('#tipRule').css('height', $(window).width() / _multiple - 30);
    window.onresize = function() {
		if(_bgAdapt) {
			$('#tipRule').css('height', $(window).width() / _multiple - 30);
		}
    };
    
    // 选择时间
    var zeroize = function(number) {
        return number > 9 ? number : '0' + number;
    }
    $('#selectTime').on('click', function() {
        var tips = $(this).find('h1');
        var input = $(this).find('input');
        
        var config = {title: '选择出发时间'};
        if(input.val() && input.data('day') && input.data('hour') && input.data('minute')) {
            config.data = {day:input.data('day'), hour:input.data('hour'), minute:input.data('minute')};
        } else {
            var today = new Date();
            var day = today.getFullYear() + '-' + zeroize(today.getMonth() + 1) + '-' + zeroize(today.getDate());
            var hour = today.getHours();
            var minute = today.getMinutes();
            if(minute > 40 && minute < 50) {
               hour++;
               minute = 0;
            } else if(minute > 50) {
               hour++;
               minute = 10;
            } else {
                var flag = true;
                $.each([30, 20, 10, 0], function(k, v) {
                    if(!flag) return;
                    if(minute >= v) {
                        minute = v + 20;
                        flag = false;
                    }
                });
            }
            
            if(hour > 23) {
                today.setDate(today.getDate() + 1);
                day = today.getFullYear() + '-' + zeroize(today.getMonth() + 1) + '-' + zeroize(today.getDate());
                hour = 0;
            }
            config.data = {day: day, hour: hour, minute: minute};
        }

        $.timePicker(config, function(values, texts) {
            input.val(values.day + ' ' + values.hour + ':' + values.minute + ':00');
            input.data('day', values.day);
            input.data('hour', values.hour);
            input.data('minute', values.minute);
            tips.text(texts.day + ' ' + zeroize(values.hour) + ':' + zeroize(values.minute));
			if('showReservationPrice' in window) {
                showReservationPrice();
            }
        });
        
    });
});

// 移除背景
function hideBackgroundImge() {
	_bgAdapt = false;
    $('#tipRule').animate({
        height: '17px'
    }, 'fast', function() {
        $('.call-car-tip').remove();
        $('body').css('background', 'none');
    })
}