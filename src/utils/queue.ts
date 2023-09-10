// 消息队列
import { ITaps } from '@/types';

export default class Queue {
	private isRunning: boolean; // 运行状态
	public taps: Array<ITaps>; // 消息队列集合
	constructor() {
		// 运行状态
		this.isRunning = false;
		// 消息队列集合
		this.taps = [];
	}
	public enqueue(item: ITaps) {
		this.taps.push(item);
		if (!this.isRunning) {
			this.dequeue();
		}
	}
	public dequeue() {
		const len = this.taps.length;
		if (!len) {
			this.isRunning = false;
			return;
		}
		this.isRunning = true;
		const item = this.taps.shift();
		const next = () => {
			this.dequeue();
		};
		item?.fn(item?.data, next);
	}
	public clear() {
		this.taps = [];
		this.isRunning = false;
	}
}
