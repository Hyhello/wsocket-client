/**
 * 作者：hyhello
 * 时间：2022-05-31
 * 描述：心跳检测机制
 */
import { tip } from '@/utils';
import { useStore } from './store';
import { CloseEventCode } from '@/common';

export default class Heartbeat {
	public socketId: string;
	public isRunning = false; // 是否启动
	private _ltimer = 0; // 轮询定时器
	private _ttimer = 0; // 超时超时
	constructor(id: string) {
		this.socketId = id;

		const store = useStore(id);

		if (store.config.heartbeatTimeout - store.config.heartbeatInterval <= 100) {
			tip(
				'The interval between the configuration "heartbeatTimeout" and "heartbeatInterval" is close, which may cause duplicate reconnection issues. It is recommended to configure a minimum interval of 100ms'
			);
		}
	}

	private _clearTimer(type?: '_ltimer' | '_ttimer') {
		const clearTimerList: Array<'_ltimer' | '_ttimer'> = type ? [type] : ['_ltimer', '_ttimer'];
		clearTimerList.forEach((handle) => {
			if (this[handle]) {
				window.clearTimeout(this[handle]);
				this[handle] = 0;
			}
		});
	}

	// looper
	private _looper() {
		const store = useStore(this.socketId);
		const { heartbeatPingText, heartbeatInterval } = store.config;
		this._clearTimer('_ltimer');
		store.emitter.$emit('_wsocket_heartbeat_send', JSON.stringify({ type: heartbeatPingText }));
		this._ltimer = window.setTimeout(() => {
			this._looper();
		}, heartbeatInterval);
	}

	// _timerout
	private _timeout() {
		const store = useStore(this.socketId);
		const { heartbeatTimeout } = store.config;
		this._clearTimer('_ttimer');
		this._ttimer = window.setTimeout(() => {
			this._clearTimer('_ltimer');
			// 连接超时，触发重连机制
			store.emitter.$emit('_wsocket_heartbeat_close', {
				code: CloseEventCode.HeartbaetTimeout,
				reason: 'HEARTBEAT FAIL'
			});
		}, heartbeatTimeout);
	}

	// 开始
	public start() {
		if (this.isRunning) return;
		this.isRunning = true;
		this._looper();
		this._timeout();
		return this;
	}

	public restart() {
		if (!this.isRunning) return;
		this._timeout();
		return this;
	}

	// 结束
	public end() {
		if (!this.isRunning) return;
		this.isRunning = false;
		this._clearTimer();
		return this;
	}
}
