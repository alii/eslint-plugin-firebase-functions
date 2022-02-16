import {RuleTester} from 'eslint';
import plugin from '../';

const rules = new RuleTester();

describe('ESLint Rules', () => {
	rules.run('safe-function-exports', plugin.rules['safe-function-exports'], {
		valid: [` `],
	});
});
