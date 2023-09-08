/**
 * 作者：hyhello
 * 时间：2022-05-31
 * 描述：心跳检测机制
 */
import { warn } from '@/utils';

export default class Network {
	public isRunning = false; // 是否启动
	public onChange: (type: string) => void;
	public isSupported = 'onLine' in window.navigator; // 是否支持
	constructor(onChange: (type: string) => void) {
		if (!this.isSupported) {
			warn('The current browser does not support network monitoring');
		}
		this.onChange = onChange;
	}

	get onLine() {
		return window.navigator.onLine;
	}

	private _bindEvent() {
		this.isRunning = true;
		window.addEventListener('online', this, false);
		window.addEventListener('offline', this, false);
	}

	private _unbindEvent() {
		this.isRunning = false;
		window.removeEventListener('online', this, false);
		window.removeEventListener('offline', this, false);
	}

	handleEvent(ev: Event) {
		this.onChange(ev.type);
	}

	start() {
		if (!this.isSupported || this.isRunning) return;
		this._bindEvent();
	}

	end() {
		if (!this.isSupported || !this.isRunning) return;
		this._unbindEvent();
	}
}
