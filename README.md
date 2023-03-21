# wsocketjs-client

### 介绍

为了快速开发业务，封装Websocket，支持特性：

- 网络监控
- 心跳机制
- 重连机制

### 安装教程

```nodejs
npm install wsocketjs-client
```

Note: add --save if you are using npm < 5.0.0

### 使用说明

Use in a browser(CDN):

```javascript
<script src="wsocketjs.min.js"></script>
```

Use In ES6:

```javascript
import Socketjs from 'wsocketjs-client';
```

#### Options

options can be object.

```javascript
{
    protocols: undefined, // protocols,服务器选择的下属协议
    networkWatch: true, // 网络监控，当开启时，网络断开，再次连上网，则进行重连
    heartbeat: true, // 是否维持心跳，目前只考虑维持客户端心跳，不考虑服务器心跳，如果考虑，则需要服务端收到客户端报文后，返回一段报文给客户端
    heartbeatInterval: 3000, // 心跳间隔(ms)
    heartbeatPingText: 'ping', // 客户端发动心跳文本
    heartbeatPongText: 'pong', // 客户端收到的心跳文本
    heartbeatTimeout: 10000, // 服务端超过多少时长未返回 heartbeatPongText ，则断定为断开连接，进行重连
    reconnect: true, // 是否重连
    reconnectInterval: 5000, // 重连间隔时间（ms）
    allowReconnectMaxTimes: 3 // 允许重连最大次数
}
```

#### For example, the default behavior

```javascript
const ws = new SocketJS('ws://xx.xx.xx.xx');
ws.$on('message', function (ev) {
    console.log(JSON.stringify(ev.data));
});
ws.$on('open', function (ev) {
    console.log('open', ev);
});
ws.$on('error', function (ev) {
    console.log('error', ev);
});
ws.$on('close', function (ev) {
    console.log('close', ev);
});
ws.connect();
```

### 支持情况

- Internet Explorer 10
- Firefox 6
- Chrome 14
- Safari 6.0
- Opera 12.1
- iOS Safari 6.0
- Chrome for Android 27.0
