/**
 * Created by benjiaoxz on 2017/7/26.
 * code: https://coding.net/u/benjiaoxz/p/backtrack/git
 * pages: http://benjiaoxz.coding.me/backtrack/examples/index.html
 *
 */
(function(_) {
    /*
    * 手机返回键控制
    *
    *   param
    *       config：初始配置，用于设置页面其他弹窗的级别，必须为函数
    *       callback：回调，可以使用当前作用域，必须为函数，
    *                 返回参数为已存储的历史记录页面
    *
    *   fn
    *       setState：设置其他页面的级别，
    *                 参数必须为数字，默认当前页，
    *                 0：表示当前页，-1：表示上一页
    *       go：跳转，
    *           0：表示当前页，-1：表示上一页
    *       open：开启控制
    *
    * */
    var backtrack = function (config, callback) {
        if (_.history && _.history.pushState) {
            var self = this;
            var H = _.history,
                L = _.location;

            var page = 0,
                pageArr= [];
            var lock = false;

            //配置
            if(config instanceof Function) {
                config.call(self);
            }

            //设置state
            self.setState = function (n) {
                if(n === 0 || n === -1) {
                    page = n;
                    pageArr.push(L.pathname + '#' + page);
                }

                //解锁
                if(!lock) {
                    self.open();
                }
            };

            //跳转
            self.go = function () {
                if(page === 0) {
                    L.reload();
                } else if(page === -1) {
                    H.back();
                }
            };

            //解锁
            self.open = function () {
                lock = true;

                //init
                var pathname = L.pathname;

                H.pushState({page: pathname}, pathname, L.href);

                //点击返回键
                _.addEventListener('popstate', function() {
                    //回调
                    if(callback instanceof Function) {
                        callback.call(self, pageArr);
                    }
                }, false);
            };

            return self;
        } else {
            throw "该浏览器不支持此功能，请更新浏览器。"
        }
    };

    _.backtrack = backtrack;
})(window);