// checkListenerType
const checkListenerType = (listener: Function) => {
	if (typeof listener !== 'function') {
		throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	}
};

export default class Emitter {
	private listeners: Record<string, Function[]>;
	constructor() {
		this.listeners = {};
	}
	public $emit<T extends unknown[]>(type: string, ...list: T) {
		const listenerList = this.listeners[type] || [];
		listenerList.forEach((listener) => {
			listener.apply(this, list);
		});
	}
	public $on(type: string, listener: Function) {
		checkListenerType(listener);
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(listener);
	}
	public $off(type: string, listener: Function) {
		checkListenerType(listener);
		const listenerList = this.listeners[type];
		if (!Array.isArray(listenerList)) return;
		this.listeners[type] = listenerList.filter((func) => func !== listener);
	}
	public $clear() {
		this.listeners = {};
	}
}
