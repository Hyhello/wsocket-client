/**
 * 作者：hyhello
 * 时间：2022-05-31
 * 描述：心跳检测机制
 */

export default class Network {
	disabled: boolean = window.navigator.onLine; // 是否启用
	onnetchange: (str: string) => void;
	constructor(disabled: boolean, onnetchange: (str: string) => void) {
		this.disabled = 'onLine' in window.navigator && disabled;
		this.onnetchange = onnetchange;
	}

	private _bindEvent() {
		window.addEventListener('online', this, false);
		window.addEventListener('offline', this, false);
	}

	private _unbindEvent() {
		window.removeEventListener('online', this, false);
		window.removeEventListener('offline', this, false);
	}

	handleEvent(ev: Event) {
		this.onnetchange(ev.type);
	}

	start() {
		if (!this.disabled) return;
		this._bindEvent();
	}

	end() {
		this._unbindEvent();
	}
}
