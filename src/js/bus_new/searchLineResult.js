$(function () {

    init();

    paging('.date-container');
});
function init() {
    var parent = $('.result-line-list');
    parent.find('.line-item .line-middle .station-gray').each(function (index,item) {
        var self = $(item);
        $(self).data('height',$(self).height());
        $(self).height(0);
    });
}

$('.flex-bar').off('click').on('click',function () {
    var parent = $(this).parents('.line-middle');
    var showFlag = parent.data('toggle');
    if(showFlag){
        // 收起操作
        parent.find('.station-gray').height(0);
        parent.find('.switch-t').css({'transform':'rotate(-90deg)'});
        parent.find('.switch-b').css({'transform':'rotate(90deg)'});
        parent.find('.switch-btn').html('全部');
    }else{
        // 展开
        var height = parent.find('.station-gray').data('height');
        parent.find('.station-gray').height(height);
        parent.find('.switch-t').css({'transform':'rotate(90deg)'});
        parent.find('.switch-b').css({'transform':'rotate(-90deg)'});
        parent.find('.switch-btn').html('收起');
    }
    parent.data('toggle',!showFlag);
});

$('.current-box').on('click',function () {
    var date = $($(this).find('input')[0]).val();
    var trigger = $(this).data('trigger');
    if(trigger){
        $('.date-content').hide();
    }else{
        $('.date-content').show();
    }
    $(this).data('trigger',!trigger);
});

$('.date-content').on('click',function () {
    $('.date-content').hide();
    var trigger = $('.current-box').data('trigger');
    $('.current-box').data('trigger',!trigger);
});

function paging(el) {



    // 分页选项
    var _options = {
        number: 1,  // 当前页码
        flag: false, // 事件锁
        // pageSize: 3, //每页条数
        totalPage: 2, //总页数
    };

    // 分页获取数据
    var requestServer = function() {
        // 显示分页指示器
        // $(el).loading();
        //模拟延迟, 假定这里是异步ajax的开始
        setTimeout(function() {
            // 渲染数据
            var dateObj = [
                {date: '2019-1-25',sellStatus:'0'},
                {date: '2019-1-26',sellStatus:'1'},
                {date: '2019-1-27',sellStatus:'2'},
                {date: '2019-1-28',sellStatus:'3'},
                {date: '2019-1-29',sellStatus:'3'},
                {date: '2019-1-30',sellStatus:'0',festival:'2',lunar:'十一'},
                {date: '2019-1-31',sellStatus:'1',festival:'1',lunar:'十二'},
                // {date: '2019-2-1',sellStatus:'1',lunar:'十三'},
                // {date: '2019-2-2',sellStatus:'1'},
                // {date: '2019-2-27',sellStatus:'1'}
            ];
            if(_options.number == 1){
                DatePicker2.draw(dateObj,'.content',true,callBack);
            }else{
                DatePicker2.draw(dateObj,'.content',false,callBack);
            }

            // 销毁分页指示器的逻辑：
            // 1.假定最大页码是5页, 已经到第5页，移除
            // 2.假定数据不满一页，没有滚动条时候，移除
            if(_options.number >= _options.totalPage) {
                $(document.body).rollPage('destroy');   // 销毁事件
                // $(el).hideLoading();               // 隐藏分页指示器
                $(el).find('.paging-tips').html('没有更多了');
                return;
            }
            _options.number++;       // 页码自增
            _options.flag = false;   // 数据渲染完成，事件解锁
        }, 500);
    };

    // 页面加载完自动请求数据
    requestServer();

    var callBack = function() {
        var containerHeight = $('.date-container').height();
        var contentHeight = $('.content').height();
        if(_options.number >= _options.totalPage) {
            $(document.body).rollPage('destroy');   // 销毁事件
            // $(el).hideLoading();               // 隐藏分页指示器
            $(el).find('.paging-tips').html('没有更多了');
            return;
        }
        // console.log('contentHeight:' + contentHeight + ',containerHeight: '+ containerHeight);
        if(contentHeight <= containerHeight){
            // console.log('没有滚动条:' + '_options.number:' + _options.number + ',,_options.totalPage:' + _options.totalPage);
            //   没有滚动条 用滑动来做的
            var startX,startY,endX,endY,X,Y;
            $(el).on('touchstart',function (e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            $(el).on('touchend',function (e) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;

                X = endX - startX;
                Y = endY - startY;

                if(Math.abs(Y) > 50 && Y < 0){
                    // console.log('上移');
                    if(_options.flag) return;
                    _options.flag = true;

                    // 页面滚动到底部请求下一页
                    requestServer();
                }
            });
        }else {
            //   有滚动条
            $(el).rollPage('load', function() {
                //load 事件在有滚动条的时候才生效
                // 事件锁, 防止频繁触发事件
                if(_options.flag) return;
                _options.flag = true;

                // 页面滚动到底部请求下一页
                requestServer();
            });
        }
    }
}


