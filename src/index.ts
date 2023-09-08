// client-socketjs
import WSocketJS from './core';
import { SDK_VERSION } from './common';

Object.defineProperty(WSocketJS.prototype, 'version', {
	value: SDK_VERSION,
	enumerable: true
});

export default WSocketJS;
