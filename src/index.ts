import {create as safeFunctionExports} from './rules/safe-function-exports';

const config = {
	rules: {
		'safe-function-exports': {create: safeFunctionExports},
	},
};

export default config;
