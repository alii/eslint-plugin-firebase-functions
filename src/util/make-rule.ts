import {Rule} from 'eslint';

export function makeRule(
	rule: (context: Rule.RuleContext) => Rule.RuleListener,
) {
	return {
		create: rule,
	};
}
