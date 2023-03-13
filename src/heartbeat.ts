/**
 * 作者：hyhello
 * 时间：2022-05-31
 * 描述：心跳检测机制
 */
import type SocketJS from './socket';

type IHeartOpts = {
	disabled: boolean; // 是否启用
	context: SocketJS; // 上下文
	heartbeatInterval: number; // 心跳间隔(ms)
	heartbeatPingText: string; // 客户端发动文本
	heartbeatTimeout: number; // 服务端超过多少时长未返回 heartbeatPongText ，则断定为断开连接，进行重连
};

export default class Heartbaet {
	public isRuning: boolean; // 是否启动
	public $opts: IHeartOpts; // 配置文件
	public readonly disabled: boolean; // 是否启用
	private _ltimer = 0; // 定时器
	private _ttimer = 0; // 超时
	constructor(opts: IHeartOpts) {
		this.disabled = opts.disabled || false;
		this.$opts = opts;
		this.isRuning = false;
	}

	private _destroy(type?: '_ltimer' | '_ttimer') {
		const clearList: Array<'_ltimer' | '_ttimer'> = type ? [type] : ['_ltimer', '_ttimer'];
		clearList.forEach((handle) => {
			if (this[handle]) {
				window.clearTimeout(this[handle]);
				this[handle] = 0;
			}
		});
	}

	// looper
	private _looper() {
		const { context, heartbeatPingText, heartbeatInterval } = this.$opts;
		this._destroy('_ltimer');
		context.send(JSON.stringify({ type: heartbeatPingText }));
		this._ltimer = window.setTimeout(() => {
			this._looper();
		}, heartbeatInterval);
	}

	// _timerout
	private _timeout() {
		const { context, heartbeatTimeout } = this.$opts;
		this._destroy('_ttimer');
		this._ttimer = window.setTimeout(() => {
			this._destroy('_ltimer');
			// 连接超时，触发重连机制
			context.instance?.close(4001, 'HEARTBEAT FAIL');
		}, heartbeatTimeout);
	}

	// 开始
	public start() {
		if (this.disabled) return;
		this.isRuning = true;
		this._looper();
		this._timeout();
		return this;
	}
	public restart() {
		if (this.disabled || !this.isRuning) return;
		this._timeout();
		return this;
	}

	// 结束
	public end() {
		if (this.disabled || !this.isRuning) return;
		this.isRuning = false;
		this._destroy();
		return this;
	}
}
