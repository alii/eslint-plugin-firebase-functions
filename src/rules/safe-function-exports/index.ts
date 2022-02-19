import {Rule} from 'eslint';
import {ImportNamespaceSpecifier} from 'estree';
import {getRootName} from '../../util/props';
import {INVALID_FUNCTION_EXPORT} from './errors';

export interface SafeFunctionExportsOptions {
	importStarName: string;
}

export const safeFunctionExports: Rule.RuleModule = {
	create: context => {
		const {importStarName = 'functions'} = (context.options[0] ||
			{}) as Partial<SafeFunctionExportsOptions>;

		const hasFirebaseImports = context.getSourceCode().ast.body.some(node => {
			if (node.type === 'ImportDeclaration') {
				const namespaces = node.specifiers.filter(
					(specifier): specifier is ImportNamespaceSpecifier =>
						specifier.type === 'ImportNamespaceSpecifier',
				);

				if (namespaces.length === 0) {
					// No `import * as functions from 'firebase-functions'`, so this is not a "valid" firebase import and we can
					// ignore this file for linting
					return false;
				}

				return (
					node.source.type === 'Literal' &&
					node.source.value === 'firebase-functions' &&
					namespaces.some(namespace => namespace.local.name === importStarName)
				);
			}

			return false;
		});

		if (!hasFirebaseImports) {
			return {};
		}

		return {
			VariableDeclaration(node) {
				const isFirebaseFunction =
					node.kind === 'const' &&
					node.declarations.every(declaration => {
						if (
							declaration.init &&
							declaration.init.type === 'CallExpression' &&
							declaration.init.callee.type === 'MemberExpression' &&
							declaration.init.callee.object
						) {
							const rootName = getRootName(declaration.init.callee.object);
							return rootName === importStarName;
						}

						return false;
					});

				if (!isFirebaseFunction) {
					return;
				}

				const isExported = node.parent.type === 'ExportNamedDeclaration';

				if (!isExported) {
					context.report({
						node,
						messageId: 'INVALID_FUNCTION_EXPORT',
						fix(fixer) {
							return [fixer.insertTextBefore(node, 'export ')];
						},
					});
				}
			},
		};
	},

	meta: {
		fixable: 'code',
		messages: {INVALID_FUNCTION_EXPORT},
		docs: {
			description: 'Ensures that all firebase functions are exported in a file',
			recommended: true,
			category: 'Possible Problems',
		},
		type: 'problem',
	},
};
