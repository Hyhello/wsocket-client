import Queue from './queue';
import config from './config';
import Emitter from './emitter';
import Network from './network';
import Heartbaet from './heartbeat';

type ISocketOptions = typeof config;

let index = 1;

export default class SocketJS extends Emitter {
	public $url: string;
	public $id = 'socket_' + index++;
	public $opts: ISocketOptions; // 配置文件
	public instance: WebSocket | null = null; // 当前实体
	private _q: Queue; // 消息队列
	private _rtimer = 0; // 定时器
	private _network: Network; // 心跳监测
	private _reconnectTimes = 0; // 重连次数
	private _heartbeat: Heartbaet; // 心跳监测
	constructor(url: string, opts?: ISocketOptions) {
		super();

		if (!(this instanceof SocketJS)) {
			console.error('SocketJS is a constructor and should be called with the `new` keyword');
		}

		if (!url) {
			throw new Error('socket链接地址不能为空');
		}

		this.$url = url;

		// 配置文件
		this.$opts = {
			...config,
			...opts
		};

		// 消息队列
		this._q = new Queue();

		// 心跳监测
		this._heartbeat = new Heartbaet({
			disabled: !this.$opts.heartbeat,
			heartbeatInterval: this.$opts.heartbeatInterval,
			heartbeatPingText: this.$opts.heartbeatPingText,
			heartbeatTimeout: this.$opts.heartbeatTimeout,
			context: this
		});

		// 网络监控
		this._network = new Network(!this.$opts.networkWatch, (type) => {
			if (type === 'online') {
				console.log(type);
				this._heartbeat.start();
			} else {
				console.log(type);
				this._heartbeat.end();
			}
		});
	}

	// 获取当前状态
	get readyState() {
		return this.instance ? this.instance.readyState : 0;
	}

	// 重连
	private _reconnect() {
		const { reconnect, reconnectInterval, allowReconnectMaxTimes } = this.$opts;
		if (!reconnect) return;
		if (this._reconnectTimes >= allowReconnectMaxTimes) {
			this._clear();
			// 重置重连次数
			this._reconnectTimes = 0;
			return console.error('当前连接次数已达到最大：' + allowReconnectMaxTimes);
		}
		if (this._rtimer) {
			window.clearTimeout(this._rtimer);
			this._rtimer = 0;
		}
		this._rtimer = window.setTimeout(() => {
			this._reconnectTimes++;
			this.connect();
		}, reconnectInterval);
	}

	private _clear() {
		// 关闭心跳
		this._heartbeat.end();
		// 网络劫持
		this._network.end();
		// 清空队列
		this._q.clear();
		// 清空实例
		this.instance = null;
	}

	// 事件
	private _bindEvent() {
		if (!this.instance) return this;
		// 初始化事件
		this.instance.onclose = (ev) => {
			this.$emit('close', ev);

			// 清掉心跳及网络监控
			this._clear();

			// 非手动关闭，1000 表示正常关闭 或者 Actively Close
			if (ev.code !== 1000) {
				this._reconnect();
			} else {
				// 关闭重连
				if (this._rtimer) {
					window.clearTimeout(this._rtimer);
					this._rtimer = 0;
				}

				// 重置重连次数
				this._reconnectTimes = 0;
			}
		};
		this.instance.onerror = (ev) => {
			this.$emit('error', ev);
		};
		this.instance.onopen = (ev) => {
			// 如果需要维持心跳
			this._heartbeat.start();
			// 网络监听
			this._network.start();
			this.$emit('open', ev);
		};
		// 接收消息
		this.instance.onmessage = (ev) => {
			const { heartbeatPingText, heartbeatPongText } = this.$opts;
			const pingStr = JSON.stringify({ type: heartbeatPingText });
			const pongStr = JSON.stringify({ type: heartbeatPongText });
			// 如果需要维持心跳
			this._heartbeat.restart();
			if (this._heartbeat.isRuning && (ev.data === pingStr || ev.data === pongStr)) return;
			this.$emit('message', ev);
		};
	}

	public connect() {
		if (!WebSocket) return console.error('当前浏览器不支持WebSocket协议，建议使用现在浏览器');
		if (this.instance) return this;

		try {
			this.instance = new WebSocket(this.$url, this.$opts.protocols);
			this._bindEvent();
		} catch (e) {
			this._reconnect();
			console.error(e);
		}
		return this;
	}

	// 发送消息
	public send(msg: IMessageType) {
		const { instance, readyState } = this;
		if (instance && readyState === WebSocket.OPEN) {
			const callback = function (msg: IMessageType, next: () => void) {
				if (instance.bufferedAmount === 0) {
					instance.send(msg);
					next();
				} else {
					setTimeout(callback, 10, msg, next);
				}
			};
			this._q.enqueue({ data: msg, fn: callback });
		}
		return this;
	}

	public close() {
		if (!this.instance) return this;
		this.instance.close();
		return this;
	}
}
