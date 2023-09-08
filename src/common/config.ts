export default {
	protocol: undefined, // protocol,服务器选择的下属协议
	networkWatch: true, // 网络监控，当开启时，网络断开，再次连上网，则进行重连
	heartbeat: true, // 是否维持心跳，目前只考虑维持客户端心跳，不考虑服务器心跳，如果考虑，则需要服务端收到客户端报文后，返回一段报文给客户端
	heartbeatInterval: 5000, // 心跳间隔(ms)
	heartbeatPingText: 'ping', // 客户端发动心跳文本
	heartbeatPongText: 'pong', // 客户端收到的心跳文本
	heartbeatTimeout: 60000, // 服务端超过多少时长未返回 heartbeatPongText ，则断定为断开连接，进行重连
	reconnect: true, // 是否重连
	reconnectInterval: 5000, // 重连间隔时间（ms）
	allowReconnectMaxTimes: 3 // 允许重连最大次数
};
