import type Network from '@/core/network';
import type { Emitter, Queue } from '@/utils';
import type Heartbeat from '@/core/heartbeat';
import { ISocketOptions as _ISocketOptions, IMessageType as _IMessageType } from '@globalType/index';

export type ISocketOptions = _ISocketOptions;

export type IMessageType = _IMessageType;

// 消息队列
export type ITaps<T = IMessageType> = {
	data: T; // 数据
	fn: (data: T, next: () => void) => void; // 函数
};

export interface ISocketStore {
	id: string; // 当前实例id
	queue: Queue;
	emitter: Emitter;
	network: Network | null;
	heartbeat: Heartbeat | null;
	reconnectTimes: number;
	reconnectTimer: number; // 重连定时器标识
	config: ISocketOptions;
	instance: WebSocket | null;
}
