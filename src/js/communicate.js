/**
 * websocket二次封装
*/
;(function (_) {
    if (!('WebSocket' in window)) {
        throw '浏览器版本过低，不支持websocket，请升级重试'
    }
    
    /**
      * 参数
      * 
      *  必填项
      *      url：                      通讯地址，只能是字符串类型
      *      errorCallback：            报错时的回调函数
      *  可选
      *      binaryType：               接受的二进制类型，默认blob，可选[blob, arraybuffer]
      *      openCallback：             连接成功后的回调函数
      *      closeCallback：            连接关闭后的回调函数
      *      messageCallback：          接收到数据回调函数
      *      keepalive：                断线重连，默认每秒一次，执行10次
      *      receiveMessageTimer：      时限内未接收到服务器消息，默认30秒
      *      autoReconnect：            默认关闭/错误之后重连
      * 
      *  方法
      *     init：               初始化，建立通讯，手动
      *     send：               发送数据
      *     close：              关闭通讯
     */
    var DEFAULT = {
        url: '',
        // binaryType:         'blob',
        openCallback: null,
        closeCallback: null,
        errorCallback: null,
        messageCallback: null,
        keepalive: 10,
        receiveMessageTimer: 30,
        autoReconnect: true
    }

    /**
     * @param   socket           websocket实例
     * @param   options          websocket选项
     * @param   health_timer     计时器
     * @param   tmpWs            临时socket
     */
    var socket = null,
        options = null,
        health_timer = null,
        tmpWs = null;

    var Communicate = function (opt) {
        if (typeof opt !== 'object') {
            throw '参数必须为对象'
        }

        var self = this

        //合并参数
        options = DEFAULT
        for (var v in opt) {
            for (var v2 in options) {
                if (v2 === v) {
                    options[v2] = opt[v]
                }
            }
        }

        return this
    }

    //init
    Communicate.prototype.init = function () {
        socket = new WebSocket(options.url)

        Communicate.bind()
    }

    //bind
    Communicate.bind = function () {
        var self = this;

        //连接成功
        socket.addEventListener('open', function (event) {
            //清除计时
            clearTimeout(health_timer);
            //发送临时未发送完的数据
            if (tmpWs && tmpWs.hasOwnProperty('tmpMessage')) {
                var tmpDataBuff = new ArrayBuffer(tmpWs.tmpMessage)
                var data = tmpDataBuff.slice(0, tmpWs.bufferedAmount);
                tmpWs.send(data);
            } else {
                tmpWs = null;
            }

            if (typeof options.openCallback === 'function') {
                var current = event.currentTarget

                //解析readystate
                var readyStateText = resolveReadyState(current.readyState)

                //返回通讯地址和readystate
                options.openCallback.bind(self.prototype, {
                    url: current.url,
                    readyStateText: readyStateText
                })()
            }
        })

        //连接关闭
        socket.addEventListener('close', function (event) {
            if (typeof options.closeCallback === 'function') {
                var current = event.currentTarget

                //解析readystate
                var readyStateText = resolveReadyState(current.readyState)
                //解析状态码
                var codeText = resolveCode(event.code)

                options.closeCallback.bind(self.prototype, {
                    url: current.url,
                    codeText: codeText,
                    reason: event.reason,
                    wasClean: event.wasClean,
                    readyStateText: readyStateText
                })()
            }

            //默认关闭重连
            options.autoReconnect && self.prototype.reconnect();
        })

        //获取服务器发送的数据
        socket.addEventListener('message', function (event) {
            //清除计时
            clearTimeout(health_timer);

            if (typeof options.messageCallback === 'function') {
                var current = event.currentTarget

                //解析readystate
                var readyStateText = resolveReadyState(current.readyState)

                //解析数据
                var msg = event.data

                try {
                    msg = JSON.parse(msg)
                } catch (error) {}

                options.messageCallback.bind(self.prototype, {
                    data: msg,
                    origin: event.origin,
                    readyStateText: readyStateText
                })()
            }
        })

        //错误
        socket.addEventListener('error', function (event) {
            if (typeof options.errorCallback === 'function') {

                options.errorCallback.bind(self.prototype, resolveReadyState(event.currentTarget.readyState))();
            }

            //默认错误重连
            options.autoReconnect && self.prototype.reconnect();
        })

        //解析readystate
        function resolveReadyState(readystate) {
            var result = '';

            /**
             * Ready state：连接状态
             * 
             *  CONNECTING  0   连接还没开启
             *  OPEN        1   连接已开启并准备好进行通信
             *  CLOSING     2   连接正在关闭的过程中
             *  CLOSED      3   连接已经关闭，或者连接无法建立
            */
            switch (readystate) {
                case 0:
                    result = '连接还没开启'
                    break;
                case 1:
                    result = '连接已开启并准备好进行通信'
                    break;
                case 2:
                    result = '连接正在关闭的过程中'
                    break;
                case 3:
                    result = '连接已经关闭，或者连接无法建立'
                    break;
                default:
                    break;
            }

            return result;
        }

        //解析状态码
        function resolveCode(code) {
            var result = '';

            /**
             * 连接状态
             * 
             *  CLOSE_NORMAL            1000   正常关闭; 无论为何目的而创建, 该链接都已成功完成任务
             *  CLOSE_GOING_AWAY        1001   终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开
             *  CLOSE_PROTOCOL_ERROR    1002   由于协议错误而中断连接
             *  CLOSE_UNSUPPORTED       1003   由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据)
             *  CLOSE_NO_STATUS         1005   表示没有收到预期的状态码
            */
            switch (code) {
                case 1000:
                    result = '正常关闭; 无论为何目的而创建, 该链接都已成功完成任务'
                    break;
                case 1001:
                    result = '终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开'
                    break;
                case 1002:
                    result = '由于协议错误而中断连接'
                    break;
                case 1003:
                    result = '由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据)'
                    break;
                case 1005:
                    result = '表示没有收到预期的状态码'
                    break;
                default:
                    break;
            }

            return result;
        }
    }

    //发送信息
    Communicate.prototype.send = function (data) {
        if (socket == null) {
            typeof options.errorCallback === 'function' && options.errorCallback('通讯暂未建立，建立通讯：Communicate.init')
            return this
        }

        var self = this;

        //当前状态
        var warn = null
        switch (socket.readyState) {
            case WebSocket.CONNECTING:
                // 表示正在连接
                warn = '通讯正在建立，请稍后'
                break;
            case WebSocket.OPEN:
                // 表示连接成功，可以通信了
                break;
            case WebSocket.CLOSING:
                // 表示连接正在关闭
                break;
            case WebSocket.CLOSED:
                // 表示连接已经关闭，或者打开连接失败
                warn = '通讯已关闭，无法发送数据'
                break;
            default:
                break;
        }

        //错误回调
        if (warn) {
            typeof options.errorCallback === 'function' && options.errorCallback(warn)
            return this
        }

        var msg = data;
        //包装json数据
        if(typeof data === 'object') {
            msg = JSON.stringify(msg)
        }

        socket.send(msg)

        //计时：若时限内服务器未返回数据，则重连
        health_timer = setTimeout(function() {
            self.reconnect(msg);
        }, options.receiveMessageTimer * 1000);
    }

    //关闭通讯
    Communicate.prototype.close = function () {
        if (socket == null) {
            typeof options.errorCallback === 'function' && options.errorCallback('通讯暂未建立，建立通讯：Communicate.init')
            return this
        }

        socket.close()
    }

    /**
     * 心跳重连communicate
     * 
     * 1. 断网重连：发送数据时，检测到连接断开（readystate 2/3）
     * 2. 关闭连接：第一次（服务端）关闭连接，默认（keepalive）尝试重连，时限10秒。如果重连成功，则继续发送消息。如果重连失败，则关闭socket，并且不再重连。
     * 3. 30秒内接收不到服务器消息，调用socket.close，然后执行2步
     */
    Communicate.prototype.reconnect = function (msg) {
        var self = this;
        
        if (socket.bufferedAmount !== 0 || socket.readyState == WebSocket.CLOSING || socket.readyState == WebSocket.CLOSED) {
            //数据未发送完成，或者连接正在关闭，或者连接已关闭
            for (var i = 0; i < options.keepalive; i++) {
                setTimeout(function() {
                    if (i == options.keepalive && (socket.bufferedAmount !== 0 || socket.readyState == WebSocket.CLOSING || socket.readyState == WebSocket.CLOSED)) {
                        tmpWs = self;                       //临时Communicate实例
                        tmpWs.bufferedAmount = socket.bufferedAmount;
                        msg && (tmpWs.tmpMessage = msg);    //要发送的数据
                        self.close();                       //关闭连接
                        options.errorCallback && typeof options.errorCallback == 'function' && options.errorCallback.bind(self.prototype, '正在重连')();
                        self.init();                        //重连
                    }
                }, 1000);
            }
        }
    }

    //绑定
    _.communicate = Communicate
}(window))