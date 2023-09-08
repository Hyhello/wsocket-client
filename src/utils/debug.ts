import { SDK_NAMESPACE } from '@/common/constant';

const errorHelpers = function (e: any) {
	let msg = e;
	if (e instanceof Error) {
		msg = e.message || e.stack;
	}
	return msg;
};

export const tip = function (e: any) {
	console?.warn(`[${SDK_NAMESPACE} tip] `, errorHelpers(e));
};

export const warn = function (e: any) {
	console?.error(`[${SDK_NAMESPACE} warn] `, errorHelpers(e));
};
