import { CONFIG } from '@/common';
import { ISocketStore } from '@/types';
import { Queue, Emitter } from '@/utils';

const globalStore: Record<string, ISocketStore> = {};

// create a new store
const createStore = function (idx: string): ISocketStore {
	return {
		id: idx,
		config: {
			...CONFIG
		},
		instance: null, // 当前实体
		reconnectTimes: 0, // 当前重连次数
		reconnectTimer: 0, // 重连定时器标识
		network: null, // 网络监控
		heartbeat: null, // 心跳对象
		queue: new Queue(), // 消息队列
		emitter: new Emitter() // EMITTER 事件句柄
	};
};

export const clearReconnectTimer = function (store: ISocketStore) {
	// reset reconnect times
	store.reconnectTimes = 0;
	// 清除重连
	if (store.reconnectTimer) {
		window.clearTimeout(store.reconnectTimer);
		store.reconnectTimer = 0;
	}
};

// reset the store, but connet reset emmiter
export const resetStore = function (store: ISocketStore, isClearReconnect = true) {
	store.instance = null;
	// 是否清空重连次数，及定时器
	if (isClearReconnect) {
		clearReconnectTimer(store);
	}
	// 清除网络监控
	if (store.network) {
		store.network.end();
	}
	// 清除心跳
	if (store.heartbeat) {
		store.heartbeat.end();
	}
};

// restore the store, prevent memory overflow
export const restoreStore = function (store: ISocketStore) {
	const idx = store.id;
	resetStore(store);
	store.emitter.$clear();
	store.id = ''; // 销毁后清空当前实体id
	delete globalStore[idx];
};

// return a store, if not exists will create a store
export const useStore = function (idx: string) {
	if (!globalStore[idx]) {
		globalStore[idx] = createStore(idx);
	}
	return globalStore[idx];
};
