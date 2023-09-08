// utils
let idx = 1;

// 获取当前id
export const getInstanceId = (prefix = 'socket') => {
	return prefix + '_' + idx++;
};
