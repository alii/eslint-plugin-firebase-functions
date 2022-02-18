import {Rule} from 'eslint';

export function makeRule(
	rule: (context: Rule.RuleContext) => Rule.RuleListener,
	meta?: Rule.RuleMetaData,
): Rule.RuleModule {
	return {
		create: rule,
		meta,
	};
}
