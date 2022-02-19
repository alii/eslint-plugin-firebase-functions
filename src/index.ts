import {safeFunctionExports} from './rules/safe-function-exports';

const config = {
	rules: {
		'safe-function-exports': safeFunctionExports,
	},
};

export default config;

// Stupid CJS hack (why can't everything use esm... cries in the corner)
if (typeof module !== 'undefined') {
	module.exports = config;
	module.exports.default = config;
}
