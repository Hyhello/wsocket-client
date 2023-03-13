// 消息队列

type ITaps = {
	data: IMessageType; // 数据
	fn: (data: IMessageType, next: () => void) => void; // 函数
};

export default class Queue {
	private isRuning: boolean;
	public taps: Array<ITaps>; // 消息队列集合
	constructor() {
		this.isRuning = false;
		// 消息队列集合
		this.taps = [];
	}
	public enqueue(item: ITaps) {
		const len = this.size();
		this.taps[len] = item;
		this.dequeue();
	}
	public dequeue() {
		const len = this.size();
		if (!len || this.isRuning) return;
		this.isRuning = true;
		const item = this.taps.shift();
		const next = () => {
			this.isRuning = false;
			this.dequeue();
		};
		item?.fn(item?.data, next);
	}
	public clear() {
		this.taps = [];
		this.isRuning = false;
	}
	public size() {
		return this.taps.length;
	}
}
