# 更新日志

## [0.7.1](https://github.com/Hyhello/wsocket-client/compare/0.7.0...0.7.1) (2023-09-10)


### Bug Fixes

* 修改protocol -> protocols，及去除冗余代码 ([57d2bcf](https://github.com/Hyhello/wsocket-client/commit/57d2bcf87ae3307129922e2732be8c044e0b7465))

# [0.7.0](https://github.com/Hyhello/wsocket-client/compare/0.6.0...0.7.0) (2023-09-08)


### Features

* 添加destory方法，引入store存储 ([8c770c0](https://github.com/Hyhello/wsocket-client/commit/8c770c0ea54e8f614c02e7b5e2959622a9e88e38))

# [0.6.0](https://github.com/Hyhello/wsocket-client/compare/0.5.0...0.6.0) (2023-03-28)


### Bug Fixes

* 提示由中文更改为英文 ([e6c0172](https://github.com/Hyhello/wsocket-client/commit/e6c017229cb7702ffaec535150fec55faf7c5d0d))


### Features

* 添加：reconnect、online，offline 回调方法$on('reconnect', cb)、$on('online', cb)、$on('offline', cb) ([d9ba455](https://github.com/Hyhello/wsocket-client/commit/d9ba4557c502ccff2dde13a937729adf68b13a55))

# [0.5.0](https://github.com/Hyhello/wsocket-client/compare/0.4.1...0.5.0) (2023-03-25)


### Features

* 添加连接中connect 回调方法$on('connect') ([fd0cac1](https://github.com/Hyhello/wsocket-client/commit/fd0cac131ecac195c56287f08a98d02c8f768252))

## [0.4.1](https://github.com/Hyhello/wsocket-client/compare/0.1.0...0.4.1) (2023-03-25)


### Bug Fixes

* 修复网络断开情况下，还继续重连问题 ([fb84255](https://github.com/Hyhello/wsocket-client/commit/fb84255862ae05161d1f92e14a1eef7c857e72fb))