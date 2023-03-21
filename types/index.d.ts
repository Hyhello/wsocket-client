export declare type ISocketOptions = {
	/** protocols,服务器选择的下属协议，默认：undefined. */
	protocols?: string | string[];
	/** 网络监控，当开启时，网络断开，再次连上网，则进行重连，默认：true. */
	networkWatch: boolean;
	/** 是否维持心跳，目前只考虑维持客户端心跳，不考虑服务器心跳，如果考虑，则需要服务端收到客户端报文后，返回一段报文给客户端，默认：true. */
	heartbeat: boolean;
	/** 心跳间隔(ms)，默认：3000ms. */
	heartbeatInterval: boolean;
	/** 客户端发动心跳文本，默认：‘ping’. */
	heartbeatPingText: string;
	/** 客户端收到的心跳文本，默认：‘pong’. */
	heartbeatPongText: string;
	/** 服务端超过多少时长未返回 heartbeatPongText ，则断定为断开连接，进行重连，默认：10000ms. */
	heartbeatTimeout: number;
	/** 是否重连，默认：true. */
	reconnect: boolean;
	/** 重连间隔时间，默认：5000ms. */
	reconnectInterval: number;
	/** 允许重连最大次数，默认：3次. */
	allowReconnectMaxTimes: number;
};

export default class SocketJS {
	constructor(url: string, opts?: ISocketOptions);
	$url: string;
	$id: string;
	$opts: ISocketOptions;
	instance: WebSocket | null;
	get readyState(): number;
	connect(): this;
	send(msg: IMessageType): this;
	close(): this;
	$emit<T extends unknown[]>(type: string, ...list: T): void;
	$on(type: string, listener: Function): void;
	$off(type: string, listener: Function): void;
	$once(type: string, listener: Function): void;
}
