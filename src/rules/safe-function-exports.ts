import {makeRule} from '../util/make-rule';

export const safeFunctionExports = makeRule(context => {
	const hasFirebaseImports = context.getSourceCode().ast.body.some(node => {
		if (node.type === 'ImportDeclaration') {
			const namespaces = node.specifiers.filter(
				specifier => specifier.type === 'ImportNamespaceSpecifier',
			);

			if (namespaces.length === 0) {
				return false;
			}

			return (
				node.source.value === 'firebase-functions' &&
				namespaces.some(namespace => namespace.local.name === 'functions')
			);
		}

		return false;
	});

	return {
		VariableDeclaration(node) {
			node.declarations;
		},
	};
});
