const WebSocket = require('ws');

// 创建WebSocket服务器实例
const wss = new WebSocket.Server({ port: 8080 });

// 监听连接事件
wss.on('connection', function connection(ws) {
  // 向客户端发送欢迎消息
    ws.send('欢迎连接WebSocket服务器！');

  // 监听消息接收事件
  ws.on('message', function incoming(message) {
      ws.send(message.toString('utf8'));
    console.log('收到消息：', message.toString('utf8'));
    // 向所有连接的客户端广播消息
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 监听关闭连接事件
  ws.on('close', function close() {
    console.log('连接已关闭。');
  });
});

console.log('WebSocket服务器已启动，监听端口8080。');