
const rollup = require('rollup');
const packageJson = require('../package.json');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

// banner
const author = packageJson.author || 'Hyhello';
const version = process.env.VERSION || packageJson.version;

const banner =
	'/*!\n' +
	` * ${packageJson.name} v${version}\n` +
	` * @license (c) 2021-${new Date().getFullYear()} ${author}\n` +
	' * Released under the MIT License.\n' +
    ' */';

const rollupConfig = {
    input: 'src/socket.ts',
    plugins: [
        nodeResolve({
            extensions: ['.ts']
        }),
        commonjs(),
        typescript(),
        terser({
            output: {
                ascii_only: true
            }
        }),
        filesize()
    ]
};

// build
async function buildEntry() {
    try {
        // const name = packageJson.name.replace(/^.*\/(\w+)$/, '$1').replace(/^([a-z])/, (input, _) => {
        //     return _.toUpperCase();
        // });
        const bundle = await rollup.rollup(rollupConfig);
        bundle.write({
            format: 'umd',
            name: 'SocketJS',
            banner,
            file: `lib/index.min.js`
        });
    } catch (e) {
        console.error('构建失败:', e);
    }
}

buildEntry();
