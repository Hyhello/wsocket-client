import Network from './network';
import Heartbeat from './heartbeat';
import { getInstanceId, warn } from '@/utils';
import { CONFIG, CloseEventCode } from '@/common';
import { ISocketStore, IMessageType, ISocketOptions } from '@/types';
import { useStore, resetStore, restoreStore, clearReconnectTimer } from './store';

export default class WSocketJS {
	public url: string | URL; // 当前链接地址
	private store: ISocketStore; // 当前存储
	constructor(url: string | URL, opts: ISocketOptions) {
		if (!(this instanceof WSocketJS)) {
			warn('WSocketJS is a constructor and should be called with the `new` keyword');
		}

		const id = getInstanceId();

		// store
		this.store = useStore(id);

		// url
		this.url = url;

		// set config
		const config = {
			...CONFIG,
			...opts
		};

		this.store.config = {
			...config,
			heartbeatInterval: Math.min(config.heartbeatInterval, config.heartbeatTimeout),
			heartbeatTimeout: Math.max(config.heartbeatInterval, config.heartbeatTimeout)
		};

		// heartbeat
		if (config.heartbeat && !this.store.heartbeat) {
			this.store.heartbeat = new Heartbeat(this.store.id);

			// Listening for heartbeat related events
			this.$on('_wsocket_heartbeat_send', this.send.bind(this));
			this.$on('_wsocket_heartbeat_close', this.close.bind(this));
		}

		// network watch
		if (config.networkWatch && !this.store.network) {
			this.store.network = new Network((type: string) => {
				if (type === 'online') {
					this.$emit('online');
					// Reset reconnection times
					clearReconnectTimer(this.store);
					this.store.heartbeat?.start();
				} else {
					this.$emit('offline');
					this.store.heartbeat?.end();
				}
			});
		}
	}
	// 重连
	private _reconnect() {
		const { reconnect, reconnectInterval, allowReconnectMaxTimes } = this.store.config;
		// this.store.reconnectTimer is a positive integer, which does not contain 0
		if (!reconnect || this.store.reconnectTimer !== 0) return;
		if (this.store.reconnectTimes++ >= allowReconnectMaxTimes) {
			return warn(
				'The current number of connections has reached the maximum: ' + allowReconnectMaxTimes + ' times.'
			);
		}

		this.connect();

		// add setTimeout to reconnect
		this.store.reconnectTimer = window.setTimeout(() => {
			this.store.reconnectTimer = 0;
			this._reconnect();
		}, reconnectInterval);
	}
	// event handler
	private _bindEvent() {
		if (!this.store.instance) return this;
		// init event handler
		this.store.instance.onclose = (ev) => {
			this.$emit('close', ev);

			// Abnormal shutdown, ev. code===1000, indicating normal shutdown or Actively Close
			const isNeedReconnnect = ev.code !== CloseEventCode.Normal;

			// reset
			// If reconnection is required, do not reset, reconnection timer and number of reconnection times
			resetStore(this.store, !isNeedReconnnect);

			if (isNeedReconnnect) {
				this._reconnect();
			}
		};
		this.store.instance.onerror = (ev) => {
			this.$emit('error', ev);
		};
		this.store.instance.onopen = (ev) => {
			this.$emit('open', ev);

			// clear reconnect timeout
			clearReconnectTimer(this.store);

			// network watcher
			this.store.network?.start();
			// heartbeat watcher
			this.store.heartbeat?.start();
		};
		// 接收消息
		this.store.instance.onmessage = (ev) => {
			const { heartbeatPongText } = this.store.config;
			// 如果需要维持心跳
			if (this.store.heartbeat?.isRunning) {
				this.store.heartbeat?.restart();
				if (ev.data === JSON.stringify({ type: heartbeatPongText })) return;
			}
			this.$emit('message', ev);
		};
		return this;
	}
	// connect to server
	public connect() {
		if (!this.store.id) return;
		const { url } = this;
		const { protocols } = this.store.config;

		if (!('WebSocket' in window)) {
			return warn('The current browser does not support the WebSocket protocol. Suggest replacing the browser.');
		}

		if (this.store.instance) return this;

		if (this.store.reconnectTimes === 0) {
			this.$emit('connect');
		} else {
			this.$emit('reconnect', this.store.reconnectTimes);
		}

		try {
			this.store.instance = new WebSocket(url, protocols);
			this._bindEvent();
		} catch (e) {
			warn(e);
		}
		return this;
	}
	// send a message
	public send(msg: IMessageType) {
		if (!this.store.id) return;
		const { instance, queue } = this.store;
		if (instance && instance.readyState === WebSocket.OPEN) {
			const callback = function (msg: IMessageType, next: () => void) {
				if (instance.bufferedAmount === 0) {
					instance.send(msg);
					next();
				} else {
					setTimeout(callback, 10, msg, next);
				}
			};
			queue.enqueue({ data: msg, fn: callback });
		}
		return this;
	}
	// close Websocket
	public close(ev: { code?: number; reason?: string } = {}) {
		const { code = CloseEventCode.Normal, reason } = ev;
		if (!this.store.id || !this.store.instance) return this;
		this.store.instance.close(code, reason);
		return this;
	}
	public $emit<T extends unknown[]>(type: string, ...list: T) {
		if (!this.store.id) return;
		this.store.emitter.$emit(type, ...list);
	}
	public $on(type: string, listener: Function) {
		this.store.emitter.$on(type, listener);
	}
	public $off(type: string, listener: Function) {
		this.store.emitter.$off(type, listener);
	}
	// destory websocket
	public destory(): void {
		if (!this.store.id) return;
		this.$emit('destory');
		this.close();
		// No longer following the close callback after destruction
		restoreStore(this.store);
	}
}
